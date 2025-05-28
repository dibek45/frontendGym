import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { of, from } from 'rxjs';
import { map, catchError, switchMap, mergeMap, tap } from 'rxjs/operators';
import * as CheckinActions from './checkins.actions'; // ✅ Corrige esto
import { CheckinService } from './checkins.service';  // ✅ Corrige esto
import { CheckinModel } from './checkins.model';      // ✅ Corrige esto

@Injectable()
export class CheckinEffects {                        // ✅ Cambia el nombre de clase
  constructor(
    private actions$: Actions,
    private checkinService: CheckinService // ✅ usa servicio correcto
  ) {}

  loadCheckins$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CheckinActions.loadCheckins),
      tap(() => console.log('🟡 [Effect] loadCheckins triggered')),
      switchMap(() =>
        from(this.checkinService.getCheckinsWithCache()).pipe(
          map((checkins) => CheckinActions.loadCheckinsSuccess({ checkins })),
          catchError((error) => {
            console.error('❌ Error in loadCheckins effect:', error);
            return of(CheckinActions.loadCheckinsFailure({ error }));
          })
        )
      )
    )
  );

  syncCheckin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CheckinActions.syncCheckin),
      mergeMap(({ checkin }) =>
        from(this.syncCheckinAsync(checkin)) // Manejo manual
      )
    )
  );

  private async syncCheckinAsync(checkin: CheckinModel) {
    try {
      console.log('🔥 Inicia sincronización de asistencia:', checkin);
      const response = await this.checkinService.createCheckin(checkin);

      if (!response || !response.id) {
        console.warn('⚠️ Backend respondió sin id');
        return CheckinActions.syncCheckinFailure({
          tempId: checkin.tempId!,
          error: 'No se pudo guardar la asistencia en backend'
        });
      }

      const updatedCheckin: CheckinModel = {
        ...checkin,
        ...response,
        isSynced: true,
        syncError: false,
        tempId: checkin.tempId!
      };

      console.log('🟢 Asistencia sincronizada:', updatedCheckin);

      return CheckinActions.syncCheckinSuccess({
        tempId: checkin.tempId!,
        updatedCheckin
      });

    } catch (error) {
      console.error('❌ Error al sincronizar asistencia:', error);
      const errorMessage = (error as Error).message || 'Error desconocido';

      return CheckinActions.syncCheckinFailure({
        tempId: checkin.tempId!,
        error: errorMessage
      });
    }
  }
}
