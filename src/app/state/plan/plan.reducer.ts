import { createReducer, on } from '@ngrx/store';
import { initialPlanState, PlanState } from './plan.state';
import * as PlanActions from './plan.actions';

export const planReducer = createReducer(
  initialPlanState,

  on(PlanActions.loadPlansSuccess, (state, { plans }): PlanState => {
    console.log('🟢 Reducer - Saving plans to store:', plans); // Confirmar si Redux guarda los datos
    return {
      ...state,
      loading: false,
      plans
    };
  }),

  on(PlanActions.loadPlansFailure, (state, { error }): PlanState => {
    console.error('🔴 Reducer - Failed to load plans:', error);
    return {
      ...state,
      loading: false,
      error
    };
  })
);
