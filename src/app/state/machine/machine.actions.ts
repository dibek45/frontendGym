import { createAction, props } from '@ngrx/store';
import { MachineModel } from './machine.model';

export const loadMachines = createAction(
  '[Machine] Load Machines',
  props<{ gymId: number }>()
);

export const loadMachinesSuccess = createAction(
  '[Machine] Load Machines Success',
  props<{ machines: MachineModel[] }>()
);

export const loadMachinesFailure = createAction(
  '[Machine] Load Machines Failure',
  props<{ error: any }>()
);

export const createMachine = createAction(
  '[Machine] Create Machine',
  props<{ machine: MachineModel }>()
);

export const createMachineSuccess = createAction(
  '[Machine] Create Machine Success',
  props<{ machine: MachineModel }>()
);

export const createMachineFailure = createAction(
  '[Machine] Create Machine Failure',
  props<{ error: any }>()
);

export const updateMachine = createAction(
  '[Machine] Update Machine',
  props<{ machine: MachineModel }>()
);
export const updateMachineSuccess = createAction(
  '[Machine] Update Machine Success',
  props<{ machine: MachineModel }>()
);

export const updateMachineFailure = createAction(
  '[Machine] Update Machine Failure',
  props<{ error: any }>()
);