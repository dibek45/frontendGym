
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlanState } from './plan.state';

export const selectPlanState = createFeatureSelector<PlanState>('plan');

export const selectAllPlans = createSelector(selectPlanState, (state) => state?.plans || []);
export const selectPlansByGymId = (gymId: number) => 
  createSelector(selectAllPlans, (plans) => {
    console.log('🟠 Selector - Filtering plans for gymId:', gymId, 'Current plans:', plans);
    return plans ? plans.filter(plan => plan.gymId === gymId) : [];
  });
