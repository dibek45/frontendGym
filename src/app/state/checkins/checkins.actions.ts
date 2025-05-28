import { createAction, props } from '@ngrx/store';
import { CheckinModel } from './checkins.model';

export const loadCheckins = createAction('[Checkin] Load', props<{ gymId: number }>());
export const loadCheckinsSuccess = createAction('[Checkin] Load Success', props<{ checkins: ReadonlyArray<CheckinModel> }>());
export const loadCheckinsFailure = createAction('[Checkin] Load Failure', props<{ error: any }>());

export const syncCheckin = createAction('[Checkin] Sync', props<{ checkin: CheckinModel }>());
export const syncCheckinSuccess = createAction('[Checkin] Sync Success', props<{ tempId: string, updatedCheckin: CheckinModel }>());
export const syncCheckinFailure = createAction('[Checkin] Sync Failure', props<{ tempId: string, error: any }>());
