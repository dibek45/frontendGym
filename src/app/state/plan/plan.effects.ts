import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PlanService } from './plan.service';
import * as PlanActions from './plan.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class PlanEffects {
  constructor(private actions$: Actions, private planService: PlanService) {}

  loadPlansByGym$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlanActions.loadPlansByGym),
      mergeMap(action =>
        this.planService.getPlansByGymId(action.gymId).pipe(
          map(response => {
            console.log('✅ API Response:', response); // Confirmar datos API
            console.log('🟢 Extracted Plans:', response.data.plansByGym); // Verificar que extraemos bien

            // 🔹 CORRIGE AQUÍ: Extrae "plansByGym" correctamente antes de pasarlo al reducer
            const plans = response.data.plansByGym || []; 

            return PlanActions.loadPlansSuccess({ plans });
          }),
          catchError(error => {
            console.error('❌ Error fetching plans:', error);
            return of(PlanActions.loadPlansFailure({ error: error.message }));
          })
        )
      )
    )
  );
}

