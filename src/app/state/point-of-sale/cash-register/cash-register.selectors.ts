import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CashRegisterState } from './cash-register.state';

export const selectCashRegisterState = createFeatureSelector<CashRegisterState>('cashRegisters');

export const selectAllCashRegisters = createSelector(
  selectCashRegisterState,
  (state) => state.cashRegisters // Devuelve la lista completa de registros
);
