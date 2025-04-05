import { MachineModel } from "./machine.model";

export interface MachineState {
  machines: MachineModel[];
  loading: boolean;
  error: any;
}

export const initialMachineState: MachineState = {
  machines: [],
  loading: false,
  error: null
};
