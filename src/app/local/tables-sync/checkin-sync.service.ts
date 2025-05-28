// 📄 src/app/local/sync/checkin-sync.service.ts
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CheckinModel } from 'src/app/state/checkins/checkins.model';
import * as CheckinActions from 'src/app/state/checkins/checkins.actions';
import { LocalEncryptedStorageService } from '../services/local-encrypted-storage.service';

@Injectable({ providedIn: 'root' })
export class CheckinSyncService {
  private tableName = 'checkins';

  constructor(
    private store: Store,
    private localStorage: LocalEncryptedStorageService
  ) {}

  async handleRemoteUpdate(updatedCheckin: CheckinModel): Promise<void> {
    const identity = await this.localStorage.loadIdentity();
    if (!identity) {
      console.warn('❌ No hay identidad local');
      return;
    }

    const checkins = await this.localStorage.loadTableFromLocalCache<CheckinModel>(
      identity.userId,
      identity.gymId,
      this.tableName
    ) ?? [];

    const index = checkins.findIndex(c => String(c.id) === String(updatedCheckin.id));
    if (index >= 0) {
      checkins[index] = { ...checkins[index], ...updatedCheckin };
      console.log(`✏️ Check-in actualizado localmente (ID ${updatedCheckin.id})`);
    } else {
      checkins.push(updatedCheckin);
      console.log(`🆕 Check-in agregado localmente (ID ${updatedCheckin.id})`);
    }

    const enriched = checkins.map(c => ({
      ...c,
      updatedAt: c.updatedAt ?? new Date().toISOString()
    }));

    await this.localStorage.saveTableToLocalCache(
      identity.userId,
      identity.gymId,
      this.tableName,
      enriched
    );

    this.store.dispatch(CheckinActions.loadCheckinsSuccess({ checkins: enriched }));
  }
}
