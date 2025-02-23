import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as RoutineActions from './routines.actions';
import { RoutineService } from './routines.service';
import { ExerciseType, Routine } from './routines.model';

@Injectable()
export class RoutinesEffects {
  constructor(
    private actions$: Actions,
    private routineService: RoutineService
  ) {}

  // Load Exercise Types by gymId
  loadExerciseTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoutineActions.loadExerciseTypes),
      mergeMap((action) =>
        this.routineService.getExerciseTypesByGym(action.gymId).pipe(
          map((exerciseTypes: ExerciseType[]) =>
            RoutineActions.loadExerciseTypesSuccess({ exerciseTypes })
          ),
          catchError((error) =>
            of(RoutineActions.loadExerciseTypesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Load Routines by Exercise Type ID
  loadRoutinesByType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoutineActions.loadRoutinesByType),
      mergeMap((action) =>
        this.routineService.getRoutinesByType(action.exerciseTypeId).pipe(
          map((routines: Routine[]) =>
            RoutineActions.loadRoutinesSuccess({ routines })
          ),
          catchError((error) =>
            of(RoutineActions.loadRoutinesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Add a Routine
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

  // Edit a Routine
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

  // Delete a Routine
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
}
