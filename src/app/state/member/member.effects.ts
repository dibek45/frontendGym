import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, exhaustMap, mergeMap, tap } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';
import { loadMemberDetail, loadMemberDetailFailed, loadMembers, loadedMemberDetail, loadedMembers } from './member.actions';
import { MemberService } from 'src/app/state/member/member.service';
import { OfflineDbService } from 'src/app/db-local/offline-db.service';
import * as MemberActions from './member.actions';
import { MemberModel } from 'src/app/core/models/member.interface';

@Injectable()
export class MemberEffects {
  constructor(
    private offlineDb: OfflineDbService // ✅ Aquí lo inyectas
,
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
syncMember$ = createEffect(() =>
  this.actions$.pipe(
    // 1. Escuchamos la acción de sincronizar un miembro
    ofType(MemberActions.syncMember),

    // 2. Solo para debug, muestra el miembro que va a sincronizar
    tap(({ member }) => {
      console.log('🔥 Llegó al effect: syncMember', member);
    }),

    // 3. Ejecutamos el servicio que manda al backend
    mergeMap(({ member }) =>
      this._members.createMember(member).pipe(

        // 4. Si el backend responde OK
        map(response => {
          console.log('✅ Backend respondió:', response);

          // 5. Creamos un objeto actualizado con el isSynced en true
          const updatedMember: MemberModel = {
            ...response,
            isSynced: true,   // 🔥 IMPORTANTE: marcamos que ya está sincronizado
            tempId: member.tempId // 🔥 Esto depende de tu lógica, podrías ya no necesitarlo
          };

          // 6. ACTUALIZAMOS en IndexedDB
          this.offlineDb.updateMember(member.tempId!, {
            isSynced: true,
            id: response.id // 🔥 Asignas el nuevo ID del backend (opcional según tu lógica)
          }).then(() => {
            console.log(`💾 Miembro actualizado en IndexedDB con id ${response.id}`);
          }).catch(error => {
            console.error('❌ Error al actualizar IndexedDB:', error);
          });

          // 7. Retornamos la acción de éxito al store
          return MemberActions.syncMemberSuccess({
            tempId: member.tempId!,
            updatedMember
          });
        }),

        // 8. Si hay error en el backend
        catchError(error => {
          console.error('❌ Error al sincronizar con el backend:', error);

          return of(MemberActions.syncMemberFailure({
            tempId: member.tempId!,
            error
          }));
        })
      )
    )
  )
);





  
}
