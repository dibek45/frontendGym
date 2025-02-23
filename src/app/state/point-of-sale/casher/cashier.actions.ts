import { createAction, props } from '@ngrx/store';
import { Cashier } from './cashier.model';

// Acción para agregar un cajero
export const addCashier = createAction(
  '[Cashier] Add Cashier',
  props<{ cashier: Cashier }>()
);

// Acción para indicar éxito al agregar un cajero
export const addCashierSuccess = createAction(
  '[Cashier] Add Cashier Success',
  props<{ cashier: Cashier }>()
);

// Acción para manejar errores
export const addCashierFailure = createAction(
  '[Cashier] Add Cashier Failure',
  props<{ error: string }>()
);

// Acción para cargar la lista de cajeros
export const loadCashiers = createAction('[Cashier] Load Cashiers');

// Acción para éxito al cargar cajeros
export const loadCashiersSuccess = createAction(
  '[Cashier] Load Cashiers Success',
  props<{ cashiers: Cashier[] }>()
);

// Acción para manejar errores al cargar cajeros
export const loadCashiersFailure = createAction(
  '[Cashier] Load Cashiers Failure',
  props<{ error: string }>()
);
