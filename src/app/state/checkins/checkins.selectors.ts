import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectCheckinState = (state: AppState) => state.checkins;

export const selectAllCheckins = createSelector(selectCheckinState, state => state.checkins);
export const selectSyncedCheckins = createSelector(selectAllCheckins, c => c.filter(x => x.isSynced));
export const selectUnsyncedCheckins = createSelector(
  selectAllCheckins,
  (checkins) => checkins.filter(c => !c.isSynced)
);
export const selectCheckinsWithSyncError = createSelector(selectAllCheckins, c => c.filter(x => x.syncError));
export const selectCheckinsLoading = createSelector(selectCheckinState, s => s.loading);
