import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MemberService } from 'src/app/state/member/member.service';
import { loadedMembers, loadMembers } from '../member/member.actions';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: MemberService
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
