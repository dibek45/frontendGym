import { createAction, props } from '@ngrx/store';
import { Plan } from './plan.model';

// Cargar todos los planes
export const loadPlans = createAction('[Plan] Load Plans');

// Cargar planes filtrados por gymId
export const loadPlansByGym = createAction('[Plan] Load Plans By Gym', props<{ gymId: number }>());

export const loadPlansSuccess = createAction('[Plan] Load Plans Success', props<{ plans: Plan[] }>());
export const loadPlansFailure = createAction('[Plan] Load Plans Failure', props<{ error: string }>());

export const addPlan = createAction('[Plan] Add Plan', props<{ plan: Plan }>());
export const addPlanSuccess = createAction('[Plan] Add Plan Success', props<{ plan: Plan }>());
export const addPlanFailure = createAction('[Plan] Add Plan Failure', props<{ error: string }>());

export const updatePlan = createAction('[Plan] Update Plan', props<{ plan: Plan }>());
export const updatePlanSuccess = createAction('[Plan] Update Plan Success', props<{ plan: Plan }>());
export const updatePlanFailure = createAction('[Plan] Update Plan Failure', props<{ error: string }>());

export const deletePlan = createAction('[Plan] Delete Plan', props<{ id: number }>());
export const deletePlanSuccess = createAction('[Plan] Delete Plan Success', props<{ id: number }>());
export const deletePlanFailure = createAction('[Plan] Delete Plan Failure', props<{ error: string }>());
