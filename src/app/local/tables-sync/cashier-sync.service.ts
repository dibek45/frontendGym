import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LocalEncryptedStorageService } from '../../local/services/local-encrypted-storage.service';
import { Casher } from '../../state/point-of-sale/casher/cashier.model';
import { loadCashiersSuccess } from '../../state/point-of-sale/casher/cashier.actions';

@Injectable({ providedIn: 'root' })
export class CashierSyncService {
  constructor(
    private localStorage: LocalEncryptedStorageService,
    private store: Store
  ) {}

  async handleRemoteUpdate(updated: Casher) {
    const identity = await this.localStorage.loadIdentity();
    if (!identity) return;

    const { userId, gymId } = identity;
    const list = await this.localStorage.loadTableFromLocalCache<Casher>(userId, gymId, 'cashiers') || [];

    const updatedList = [...list.filter(c => c.id !== updated.id), updated];
    const enrichedList = updatedList.map(c => ({
      ...c,
      updatedAt: c.updatedAt ?? new Date().toISOString()
    }));

    await this.localStorage.saveTableToLocalCache(userId, gymId, 'cashiers', enrichedList);
    await this.localStorage.saveVersion(userId, gymId, 'cashiers', updated.updatedAt?.toString() || new Date().toISOString());

    this.store.dispatch(loadCashiersSuccess({ cashiers: enrichedList }));
    console.log('✅ Cashier updated from socket and saved locally');
  }
}
