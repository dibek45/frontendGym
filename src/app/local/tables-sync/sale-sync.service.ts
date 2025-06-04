import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as SaleActions from '../../state/point-of-sale/sale/sale.actions';
import { LocalEncryptedStorageService } from '../services/local-encrypted-storage.service';
import { SaleModel } from 'src/app/state/point-of-sale/cash-register/sale.model';

@Injectable({ providedIn: 'root' })
export class SaleSyncService {
  private tableName = 'sales';

  constructor(
    private store: Store,
    private localStorage: LocalEncryptedStorageService
  ) {}

  async handleRemoteUpdate(updatedSale: SaleModel): Promise<void> {
    const identity = await this.localStorage.loadIdentity();
    if (!identity) {
      console.warn('❌ No hay identidad local');
      return;
    }

    console.log('💰 updatedSale recibido:', updatedSale);

    const sales = await this.localStorage.loadTableFromLocalCache<SaleModel>(
      identity.userId,
      identity.gymId,
      this.tableName
    ) ?? [];

    const index = sales.findIndex(s => String(s.id) === String(updatedSale.id));
    if (index >= 0) {
      sales[index] = { ...sales[index], ...updatedSale };
      console.log(`✏️ Venta actualizada localmente (ID ${updatedSale.id})`);
    } else {
      sales.push(updatedSale);
      console.log(`🆕 Venta agregada localmente (ID ${updatedSale.id})`);
    }

    const enrichedSales = sales.map(s => ({
      ...s,
      updatedAt: s.updatedAt ?? new Date().toISOString()
    }));

    await this.localStorage.saveTableToLocalCache(
      identity.userId,
      identity.gymId,
      this.tableName,
      enrichedSales
    );

    this.store.dispatch(SaleActions.loadSalesSuccess({ sales: enrichedSales }));
  }
}
