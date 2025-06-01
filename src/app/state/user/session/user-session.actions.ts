import { createAction, props } from '@ngrx/store';

export const setUserSession = createAction(
  '[UserSession] Set Session',
  props<{
    userId: number;
    userName: string;
    gymId: number;
    gymName: string;
    role: string;
  }>()
);

export const setCajaState = createAction(
  '[UserSession] Set Caja State',
  props<{
    currentBalance: number;
    cajaStatus: 'open' | 'closed';
    cashRegisterId: number;
  }>()
);



export const clearUserSession = createAction('[UserSession] Clear Session');
