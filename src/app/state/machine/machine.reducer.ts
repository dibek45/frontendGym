import { createReducer, on } from '@ngrx/store';
import * as MachineActions from './machine.actions';
import { MachineState, initialMachineState } from './machine.state';

export const machineReducer = createReducer(
  initialMachineState,

  on(MachineActions.loadMachines, state => ({
    ...state,
    loading: true
  })),

  on(MachineActions.loadMachinesSuccess, (state, { machines }) => ({
    ...state,
    machines,
    loading: false
  })),

  on(MachineActions.loadMachinesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(MachineActions.createMachineSuccess, (state, { machine }) => ({
    ...state,
    machines: [...state.machines, machine]
  })),

  on(MachineActions.updateMachine, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(MachineActions.updateMachineSuccess, (state, { machine }) => {
    const updatedMachines = state.machines.map((m) =>
      m.id === machine.id ? machine : m
    );

    return {
      ...state,
      machines: updatedMachines,
      loading: false,
    };
  }),

  on(MachineActions.updateMachineFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
