import { createAction, props } from '@ngrx/store';
import { Routine, ExerciseType } from './routines.model';

//
// **ExerciseType Actions**
//

// Load all exercise types by gym ID
export const loadExerciseTypes = createAction(
  '[ExerciseType] Load Exercise Types',
  props<{ gymId: number }>()
);

export const loadExerciseTypesSuccess = createAction(
  '[ExerciseType] Load Exercise Types Success',
  props<{ exerciseTypes: ExerciseType[] }>()
);

export const loadExerciseTypesFailure = createAction(
  '[ExerciseType] Load Exercise Types Failure',
  props<{ error: string }>()
);

//
// **Routine Actions**
//



export const loadRoutinesSuccess = createAction(
  '[Routine] Load Routines Success',
  props<{ routines: Routine[] }>()
);

export const loadRoutinesFailure = createAction(
  '[Routine] Load Routines Failure',
  props<{ error: string }>()
);

// Add a new routine
export const addRoutine = createAction(
  '[Routine] Add Routine',
  props<{ routine: Routine }>()
);

export const addRoutineSuccess = createAction(
  '[Routine] Add Routine Success',
  props<{ routine: Routine }>()
);

export const addRoutineFailure = createAction(
  '[Routine] Add Routine Failure',
  props<{ error: string }>()
);

// Edit an existing routine
export const editRoutine = createAction(
  '[Routine] Edit Routine',
  props<{ routine: Routine }>()
);

export const editRoutineSuccess = createAction(
  '[Routine] Edit Routine Success',
  props<{ routine: Routine }>()
);

export const editRoutineFailure = createAction(
  '[Routine] Edit Routine Failure',
  props<{ error: string }>()
);



export const deleteRoutineSuccess = createAction(
  '[Routine] Delete Routine Success',
  props<{ routineId: number }>()
);

export const deleteRoutineFailure = createAction(
  '[Routine] Delete Routine Failure',
  props<{ error: string }>()
);
// Load routines by exercise type
export const loadRoutinesByType = createAction(
  '[Routine] Load Routines By Type',
  props<{ exerciseTypeId: number }>()
);

// Delete a routine by ID and exerciseTypeId
export const deleteRoutine = createAction(
  '[Routine] Delete Routine',
  props<{ routineId: number; exerciseTypeId: number }>()
);