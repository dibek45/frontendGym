import { createReducer, on } from '@ngrx/store';
import * as CashierActions from './cashier.actions';
import { Cashier } from './cashier.model';

// Estado inicial
export interface CashierState {
  cashiers: Cashier[];
  error: string | null;
}

export const initialState: CashierState = {
  cashiers: [],
  error: null,
};

export const cashierReducer = createReducer(
  initialState,
  on(CashierActions.addCashierSuccess, (state, { cashier }) => ({
    ...state,
    cashiers: [...state.cashiers, cashier],
  })),
  on(CashierActions.loadCashiersSuccess, (state, { cashiers }) => ({
    ...state,
    cashiers,
  })),
  on(
    CashierActions.addCashierFailure,
    CashierActions.loadCashiersFailure,
    (state, { error }) => ({
      ...state,
      error,
    })
  )
);
