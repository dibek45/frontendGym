import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from 'src/app/home/user/user.service';
import { loadedMembers, loadMembers } from '../actions/member.actions';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}

  loadMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMembers), // Escucha la acción `loadMembers` con `gymId`
      mergeMap(action =>
        this.userService.getData(action.gymId).pipe(
          map((members) => loadedMembers({ members })), // Despacha `loadedMembers` con los miembros obtenidos
          catchError((error) => of({ type: '[User] Load Members Failed', error }))
        )
      )
    )
  );
}
