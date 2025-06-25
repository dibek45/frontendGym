import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LocalEncryptedStorageService } from '../../local/services/local-encrypted-storage.service';
import { Promotion } from 'src/app/state/promotions/promotion.model'; // no el del service
import { PromotionActions } from 'src/app/state/promotions/promotion.actions';

@Injectable({ providedIn: 'root' })
export class PromotionSyncService {
  constructor(
    private localStorage: LocalEncryptedStorageService,
    private store: Store
  ) {}

  async handleRemoteUpdate(updated: Promotion) {
    const identity = await this.localStorage.loadIdentity();
    if (!identity) return;

    const { userId, gymId } = identity;
    const list = await this.localStorage.loadTableFromLocalCache<Promotion>(userId, gymId, 'promotions') || [];

    const updatedList = [...list.filter(p => p.id !== updated.id), updated];
const enrichedList: Promotion[] = updatedList.map(p => ({
  ...p,
  updatedAt: typeof p.updatedAt === 'string' ? new Date(p.updatedAt) : p.updatedAt,
  createdAt: typeof p.createdAt === 'string' ? new Date(p.createdAt) : p.createdAt,
}));


this.store.dispatch(PromotionActions.loadPromotionsSuccess({ promotions: enrichedList }));
    await this.localStorage.saveVersion(userId, gymId, 'promotions', updated.updatedAt?.toString() || new Date().toISOString());

this.store.dispatch(PromotionActions.loadPromotionsSuccess({ promotions: enrichedList }));
    console.log('✅ Promotion updated from socket and saved locally');
  }
}
