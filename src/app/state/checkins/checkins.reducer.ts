import { createReducer, on } from '@ngrx/store';
import * as CheckinActions from './checkins.actions';
import { CheckinState } from './checkin.state';

export const initialState: CheckinState = {
  checkins: [],
  loading: false,
};

export const checkinReducer = createReducer(
  initialState,
  on(CheckinActions.loadCheckins, (state) => ({ ...state, loading: true })),
on(CheckinActions.loadCheckinsSuccess, (state, { checkins }) => ({
  ...state,
  loading: false,
  checkins: [...checkins] // ✅ Esto lo convierte en mutable
})),
  on(CheckinActions.loadCheckinsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(CheckinActions.syncCheckinSuccess, (state, { tempId, updatedCheckin }) => ({
    ...state,
    checkins: state.checkins.map(c =>
      c.tempId === tempId ? { ...c, ...updatedCheckin, syncError: false } : c
    )
  })),

  on(CheckinActions.syncCheckinFailure, (state, { tempId }) => ({
    ...state,
    checkins: state.checkins.map(c =>
      c.tempId === tempId ? { ...c, syncError: true } : c
    )
  }))
);
