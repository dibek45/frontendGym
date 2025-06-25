import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as RoutineActions from './routines.actions';
import { RoutineService } from './routines.service';
import { ExerciseType, Routine } from './routines.model';

@Injectable()
export class RoutinesEffects {
  constructor(
    private actions$: Actions,
    private routineService: RoutineService
  ) {}


loadExerciseTypes$ = createEffect(() =>
  this.actions$.pipe(
    ofType(RoutineActions.loadExerciseTypes),
    tap(({ gymId }) => console.log('📥 Action: loadExerciseTypes DISPATCHED con gymId:', gymId)),
    mergeMap(({ gymId }) =>
      from(this.routineService.getExerciseTypesWithCache()).pipe(
        tap(result => {
          console.log('📦 Resultado de getExerciseTypesWithCache():', result);
          console.log('📦 Fuente de los datos:', result.source);
        }),
        map(({ data, source }) => {
          if (source === 'local') {
            console.log('✅ Tipos de ejercicio cargados desde CACHE:', data);
          } else {
         //   alert('🌐 Tipos de ejercicio cargados desde BACKEND');
            console.log('🌐 Tipos de ejercicio cargados desde BACKEND:', data);
          }
          return RoutineActions.loadExerciseTypesSuccess({ exerciseTypes: data });
        }),
        catchError(error => {
          console.error('❌ Error en loadExerciseTypes$:', error);
          return of(RoutineActions.loadExerciseTypesFailure({ error: error.message }));
        })
      )
    )
  )
);


  // ➕ Agregar rutina
  addRoutine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoutineActions.addRoutine),
      mergeMap((action) =>
        this.routineService.addRoutine(action.routine).pipe(
          map((routine: Routine) =>
            RoutineActions.addRoutineSuccess({ routine })
          ),
          catchError((error) =>
            of(RoutineActions.addRoutineFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // ✏️ Editar rutina
  editRoutine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoutineActions.editRoutine),
      mergeMap((action) =>
        this.routineService.updateRoutine(action.routine).pipe(
          map((routine: Routine) =>
            RoutineActions.editRoutineSuccess({ routine })
          ),
          catchError((error) =>
            of(RoutineActions.editRoutineFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // ❌ Eliminar rutina
  deleteRoutine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoutineActions.deleteRoutine),
      mergeMap((action) =>
        this.routineService.deleteRoutine(action.routineId).pipe(
          map(() =>
            RoutineActions.deleteRoutineSuccess({ routineId: action.routineId })
          ),
          catchError((error) =>
            of(RoutineActions.deleteRoutineFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // 🔁 Sincronización
  syncRoutine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoutineActions.syncRoutine),
      mergeMap(({ routine }) =>
        from(this.routineService.addRoutine(routine)).pipe(
          map((response) => {
            if (!response?.id) {
              return RoutineActions.syncRoutineFailure({
                tempId: routine.tempId!,
                error: 'No se pudo crear la rutina en backend',
              });
            }

            const updatedRoutine: Routine = {
              ...routine,
              ...response,
              isSynced: true,
              syncError: false,
              tempId: routine.tempId!,
            };

            return RoutineActions.syncRoutineSuccess({
              tempId: routine.tempId!,
              updatedRoutine,
            });
          }),
          catchError((error) =>
            of(
              RoutineActions.syncRoutineFailure({
                tempId: routine.tempId!,
                error: (error as Error).message || 'Error desconocido',
              })
            )
          )
        )
      )
    )
  );
}
