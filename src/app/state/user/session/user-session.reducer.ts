import { createReducer, on } from '@ngrx/store';
import {
  initialUserSessionState,
  UserSessionState
} from './user-session.state';
import {
  setUserSession,
  setCajaState,
  clearUserSession
} from './user-session.actions';

export const userSessionReducer = createReducer(
  initialUserSessionState,

  on(setUserSession, (state, payload) => ({
    ...state,
    userId: payload.userId,
    userName: payload.userName,
    gymId: payload.gymId,
    gymName: payload.gymName,
    role: payload.role
  })),

 on(setCajaState, (state, payload) => ({
  ...state,
  currentBalance: payload.currentBalance,
  cajaStatus: payload.cajaStatus,
  cashRegisterId: payload.cashRegisterId // ✅ aquí agregas el campo
})),

  on(clearUserSession, () => initialUserSessionState)
);
