import { createReducer, on } from '@ngrx/store';
import { CashMovementActions } from './cash-movement.actions';
import { initialCashMovementState } from '../casher/cash-movement.state';

export const cashMovementReducer = createReducer(
  initialCashMovementState,

  on(CashMovementActions['loadCashMovementsSuccess'], (state, { cashMovements }) => ({
    ...state,
    cashMovements,
    error: null,
  })),

  on(CashMovementActions['loadCashMovementsFailure'], (state, { error }) => ({
    ...state,
    error,
  })),

  on(CashMovementActions['addCashMovement'], (state, { cashMovement }) => ({
    ...state,
    cashMovements: [...state.cashMovements, cashMovement],
  })),

  on(CashMovementActions['updateCashMovement'], (state, { id, changes }) => ({
    ...state,
    cashMovements: state.cashMovements.map((movement) =>
      movement.id === id ? { ...movement, ...changes } : movement
    ),
  })),

  on(CashMovementActions['deleteCashMovement'], (state, { id }) => ({
    ...state,
    cashMovements: state.cashMovements.filter((movement) => movement.id !== id),
  }))
);
