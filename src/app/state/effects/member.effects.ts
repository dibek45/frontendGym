import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, exhaustMap } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';
import { loadMemberDetail, loadMemberDetailFailed, loadMembers, loadedMemberDetail, loadedMembers } from '../actions/member.actions';
import { UserService } from 'src/app/home/user/user.service';

@Injectable()
export class MemberEffects {
  constructor(
    private actions$: Actions,
    private _members: UserService // Servicio que llama al backend

  ) {}

  loadMembers$ = createEffect(() => this.actions$.pipe(
    ofType(loadMembers), // Escucha la acción [Load members]
    exhaustMap(action => this._members.getData(action.gymId) // Pasa el gymId al servicio
      .pipe(
        map(members => loadedMembers({ members })), // Usa la acción `loadedMembers` definida
        catchError(() => EMPTY) // Maneja errores
      ))
    )
  );

  loadMemberDetail$ = createEffect(() => this.actions$.pipe(
    ofType(loadMemberDetail), // Escucha la acción [Load Member Detail]
    exhaustMap(action =>
      this._members.getMemberDetail(action.gymId, action.memberId).pipe( // Llamada al servicio con gymId y memberId
        map(member => loadedMemberDetail({ member })), // Si la llamada es exitosa, dispara loadedMemberDetail
        catchError((error) => of(loadMemberDetailFailed({ error }))) // Maneja errores
      )
    )
  ));


  
}
