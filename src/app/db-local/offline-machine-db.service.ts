import Dexie, { Table } from 'dexie';
import { Injectable } from '@angular/core';
import { MachineModel } from '../state/machine/machine.model';

@Injectable({ providedIn: 'root' })
export class OfflineMachineDbService extends Dexie {
  machines!: Table<MachineModel, number>;

  constructor() {
    super('OfflineMachineDB');
    this.version(1).stores({
      machines: '++id, name, gymId'
    });
  }

  async addMachine(machine: MachineModel) {
    return await this.machines.add(machine);
  }

  async getMachinesByGym(gymId: number): Promise<MachineModel[]> {
    return await this.machines.where('gymId').equals(gymId).toArray();
  }

  async updateMachine(id: number, changes: Partial<MachineModel>) {
    return await this.machines.update(id, changes);
  }

  async deleteMachine(id: number) {
    return await this.machines.delete(id);
  }
}
