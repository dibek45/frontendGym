import { Plan } from './plan.model';

export interface PlanState {
  plans: Plan[];
  loading: boolean;
  error: string | null;
}

export const initialPlanState: PlanState = {
  plans: [],
  loading: false,
  error: null,
};
