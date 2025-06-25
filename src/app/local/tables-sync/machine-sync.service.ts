import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MachineModel } from 'src/app/state/machine/machine.model';
import * as MachineActions from 'src/app/state/machine/machine.actions';
import { LocalEncryptedStorageService } from '../services/local-encrypted-storage.service';

@Injectable({ providedIn: 'root' })
export class MachineSyncService {
  private tableName = 'machines';

  constructor(
    private store: Store,
    private localStorage: LocalEncryptedStorageService
  ) {}

  async handleRemoteUpdate(updatedMachine: MachineModel): Promise<void> {
    const identity = await this.localStorage.loadIdentity();
    if (!identity) {
      console.warn('❌ No hay identidad local');
      return;
    }

    const machines = await this.localStorage.loadTableFromLocalCache<MachineModel>(
      identity.userId,
      identity.gymId,
      this.tableName
    ) ?? [];

    const index = machines.findIndex(m => String(m.id) === String(updatedMachine.id));
    if (index >= 0) {
      machines[index] = { ...machines[index], ...updatedMachine };
      console.log(`✏️ Máquina actualizada localmente (ID ${updatedMachine.id})`);
    } else {
      machines.push(updatedMachine);
      console.log(`🆕 Máquina agregada localmente (ID ${updatedMachine.id})`);
    }

    const enrichedMachines = machines.map(m => ({
      ...m,
      updatedAt: m.updatedAt ?? new Date().toISOString()
    }));

    await this.localStorage.saveTableToLocalCache(
      identity.userId,
      identity.gymId,
      this.tableName,
      enrichedMachines
    );

    this.store.dispatch(MachineActions.loadMachinesSuccess({ machines: enrichedMachines }));
  }
}
