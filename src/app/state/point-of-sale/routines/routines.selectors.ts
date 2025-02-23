import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RoutineState } from './routines.reducer';

// Selector base for the routine state
export const selectRoutineState = createFeatureSelector<RoutineState>('routine');

// Select all routines for a given ExerciseTypeId
export const selectRoutinesByTypeId = (exerciseTypeId: number) =>
  createSelector(
    selectRoutineState,
    (state) => state.routines.filter((routine) => routine.exerciseTypeId === exerciseTypeId)
  );

// Select a routine by ID
export const selectRoutineById = (routineId: number) =>
  createSelector(
    selectRoutineState,
    (state) => state.routines.find((routine) => routine.id === routineId)
  );

// Select all exercise types
export const selectExerciseTypes = createSelector(
  selectRoutineState,
  (state) => state.exerciseTypes
);

// Select errors for exercise types
export const selectExerciseTypeError = createSelector(
  selectRoutineState,
  (state) => state.exerciseTypeError
);

// Select errors for routines
export const selectRoutineError = createSelector(
  selectRoutineState,
  (state) => state.routineError
);
