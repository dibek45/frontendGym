import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CashMovementState } from '../casher/cash-movement.state';

export const selectCashMovementState = createFeatureSelector<CashMovementState>('cashMovements');

export const selectAllCashMovements = createSelector(
  selectCashMovementState,
  (state) => state.cashMovements
);

export const selectCashMovementById = (id: number) =>
  createSelector(selectAllCashMovements, (cashMovements) =>
    cashMovements.find((movement) => movement.id === id)
  );
