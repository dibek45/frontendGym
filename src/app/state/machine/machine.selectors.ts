import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MachineState } from './machine.state';

export const selectMachineState = createFeatureSelector<MachineState>('machines');

export const selectAllMachines = createSelector(
  selectMachineState,
  (state: MachineState) => state.machines
);

export const selectMachineLoading = createSelector(
  selectMachineState,
  (state: MachineState) => state.loading
);

export const selectMachineError = createSelector(
  selectMachineState,
  (state) => state.error
);
