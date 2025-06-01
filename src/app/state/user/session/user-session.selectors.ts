import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserSessionState } from './user-session.state';
import { selectExpenseState } from '../../expense/expenses.selectors';

export const selectUserSessionState = createFeatureSelector<UserSessionState>('userSession');

export const selectUserId = createSelector(selectUserSessionState, state => state.userId);
export const selectUserName = createSelector(selectUserSessionState, state => state.userName);
export const selectGymId = createSelector(selectUserSessionState, state => state.gymId);
export const selectGymName = createSelector(selectUserSessionState, state => state.gymName);
export const selectRole = createSelector(selectUserSessionState, state => state.role);
export const selectCurrentBalance = createSelector(selectUserSessionState, state => state.currentBalance);
export const selectCajaStatus = createSelector(selectUserSessionState, state => state.cajaStatus);

export const selectCashRegisterId = createSelector(
  selectUserSessionState,
  (state: UserSessionState) => state.cashRegisterId
);

export const selectAllExpenses = createSelector(
  selectExpenseState,
  state => state.list
);


export const selectCajaState = createSelector(
  selectUserSessionState,
  state => ({
    currentBalance: state.currentBalance,
    cajaStatus: state.cajaStatus
  })
);
