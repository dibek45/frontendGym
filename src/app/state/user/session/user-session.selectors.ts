import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserSessionState } from './user-session.state';

export const selectUserSessionState = createFeatureSelector<UserSessionState>('userSession');

export const selectUserId = createSelector(selectUserSessionState, state => state.userId);
export const selectUserName = createSelector(selectUserSessionState, state => state.userName);
export const selectGymId = createSelector(selectUserSessionState, state => state.gymId);
export const selectGymName = createSelector(selectUserSessionState, state => state.gymName);
export const selectRole = createSelector(selectUserSessionState, state => state.role);
export const selectCurrentBalance = createSelector(selectUserSessionState, state => state.currentBalance);
export const selectCajaStatus = createSelector(selectUserSessionState, state => state.cajaStatus);
