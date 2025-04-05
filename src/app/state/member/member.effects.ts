import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, exhaustMap, mergeMap, tap } from 'rxjs/operators';
import { of, EMPTY, from } from 'rxjs';
import { loadMemberDetail, loadMemberDetailFailed, loadMembers, loadedMemberDetail, loadedMembers } from './member.actions';
import { MemberService } from 'src/app/state/member/member.service';
import * as MemberActions from './member.actions';
import { MemberModel } from 'src/app/core/models/member.interface';

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
syncMember$ = createEffect(() =>
  this.actions$.pipe(
    ofType(MemberActions.syncMember), // 1️⃣ Captura la acción de sincronización
    mergeMap(({ member }) => 
      from(this.syncMemberAsync(member)) // 2️⃣ Llama a la función que hace todo de forma asíncrona
    )
  )
);
private async syncMemberAsync(member: MemberModel) {
  try {
    console.log('🔥 Inicia sincronización de miembro:', member);

    // ✅ Llamada al backend con await (requiere que tengas createMemberAsync en el servicio)
    const response = await this._members.createMemberAsync(member);

    console.log('✅ Backend respondió correctamente:', response);

    // ✅ Validación de la respuesta del backend
    if (!response || !response.id) {
      console.warn('⚠️ Backend respondió sin id, marcando syncError');

      // ⚠️ Marca como error de sincronización en IndexedDB
   

      console.log(`💾 IndexedDB: Marcado como syncError tempId=${member.tempId}`);

      // ❌ Devuelve la acción de fallo al store de NgRx
      return MemberActions.syncMemberFailure({
        tempId: member.tempId!,
        error: 'No se pudo crear el usuario en backend'
      });
    }

    // ✅ Crea el miembro actualizado combinando la data local con el backend
    const updatedMember: MemberModel = {
      ...member,                // Los datos que ya tenías en local
      ...response,              // Los datos que trae el backend (id real, username, etc.)
      isSynced: true,
      syncError: false,
      tempId: member.tempId!    // Mantén el tempId para poder referenciarlo
    };

    console.log('🟢 updatedMember preparado para guardar:', updatedMember);

    // ✅ Guarda el miembro actualizado en IndexedDB

    console.log(`💾 IndexedDB: Miembro actualizado con tempId=${member.tempId}`);

    // ✅ Devuelve la acción de éxito al store de NgRx
    return MemberActions.syncMemberSuccess({
      tempId: member.tempId!,
      updatedMember
    });

  } catch (error) {
    console.error('❌ Error al sincronizar con el backend:', error);
  
    const errorMessage = (error as Error).message || 'Error desconocido';
  
    // ⚠️ Marca como error de sincronización en IndexedDB si hubo un fallo en el fetch
  
    console.log(`💾 IndexedDB: Marcado como syncError tempId=${member.tempId}`);
  
    return MemberActions.syncMemberFailure({
      tempId: member.tempId!,
      error: errorMessage
    });
  }
  
}

 // end createEffect








  
}
