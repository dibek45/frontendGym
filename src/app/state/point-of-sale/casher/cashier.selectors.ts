import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CashierState } from './cashier.reducer';

// Selector base
export const selectCashierState = createFeatureSelector<CashierState>('cashier');

// Selector para obtener la lista de cajeros
export const selectAllCashiers = createSelector(
  selectCashierState,
  (state) => state.cashiers
);

// Selector para obtener errores
export const selectCashierError = createSelector(
  selectCashierState,
  (state) => state.error
);
