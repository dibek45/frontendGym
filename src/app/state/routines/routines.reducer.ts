import { createReducer, on } from '@ngrx/store';
import * as RoutineActions from './routines.actions';
import { Routine, ExerciseType } from './routines.model';

export interface RoutineState {
  exerciseTypes: ExerciseType[];
  routines: Routine[];
  exerciseTypeError: string | null;
  routineError: string | null;
  loadingExerciseTypes: boolean; // Loading state for exercise types
  loadingRoutines: boolean; // Loading state for routines
}

export const initialState: RoutineState = {
  exerciseTypes: [],
  routines: [],
  exerciseTypeError: null,
  routineError: null,
  loadingExerciseTypes: false,
  loadingRoutines: false,
};

export const routinesReducer = createReducer(
  initialState,

  // **Exercise Types**

  on(RoutineActions.loadExerciseTypes, (state) => ({
    ...state,
    loadingExerciseTypes: true, // Set loading to true
    exerciseTypeError: null, // Clear previous errors
  })),

  on(RoutineActions.loadExerciseTypesSuccess, (state, { exerciseTypes }) => ({
    ...state,
    exerciseTypes,
    loadingExerciseTypes: false, // Set loading to false
    exerciseTypeError: null,
  })),

  on(RoutineActions.loadExerciseTypesFailure, (state, { error }) => ({
    ...state,
    loadingExerciseTypes: false, // Set loading to false
    exerciseTypeError: error,
  })),

  // **Routines**

  on(RoutineActions.addRoutine, (state) => ({
    ...state,
    loadingRoutines: true, // Set loading to true
    routineError: null, // Clear previous errors
  })),

  on(RoutineActions.loadRoutinesSuccess, (state, { routines }) => ({
    ...state,
    routines,
    loadingRoutines: false, // Set loading to false
    routineError: null,
  })),

  on(RoutineActions.loadRoutinesFailure, (state, { error }) => ({
    ...state,
    loadingRoutines: false, // Set loading to false
    routineError: error,
  })),

  // **Add Routine**

  on(RoutineActions.addRoutineSuccess, (state, { routine }) => ({
    ...state,
    routines: [...state.routines, routine],
    routineError: null,
  })),

  on(RoutineActions.addRoutineFailure, (state, { error }) => ({
    ...state,
    routineError: error,
  })),

  // **Edit Routine**

  on(RoutineActions.editRoutineSuccess, (state, { routine }) => ({
    ...state,
    routines: state.routines.map((r) =>
      r.id === routine.id ? routine : r
    ),
    routineError: null,
  })),

  on(RoutineActions.editRoutineFailure, (state, { error }) => ({
    ...state,
    routineError: error,
  })),

  // **Delete Routine**

  on(RoutineActions.deleteRoutineSuccess, (state, { routineId }) => ({
    ...state,
    routines: state.routines.filter((r) => r.id !== routineId),
    routineError: null,
  })),

  on(RoutineActions.deleteRoutineFailure, (state, { error }) => ({
    ...state,
    routineError: error,
  }))
);
