import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, exhaustMap, mergeMap } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';
import { loadMemberDetail, loadMemberDetailFailed, loadMembers, loadedMemberDetail, loadedMembers } from './member.actions';
import { MemberService } from 'src/app/state/member/member.service';
import * as MemberActions from './member.actions'; // <-- Make sure this path is correct

@Injectable()
export class MemberEffects {
  constructor(
    private actions$: Actions,
    private _members: MemberService // Servicio que llama al backend

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

// 2) Add an effect that calls your HTTP method to perform the GraphQL mutation
updateAvailableDays$ = createEffect(() =>
  this.actions$.pipe(
    ofType(MemberActions.updateAvailableDays),
    mergeMap(action =>
      this._members.updateDays(action.memberId, action.days).pipe(
        map(updatedDays =>
          MemberActions.updateAvailableDaysSuccess({ days: updatedDays })
        ),
        catchError(error =>
          of(MemberActions.updateAvailableDaysFailure({ error }))
        )
      )
    )
  )
);

  
}
