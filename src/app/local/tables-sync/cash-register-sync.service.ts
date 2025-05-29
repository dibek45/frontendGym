import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LocalEncryptedStorageService } from 'src/app/local/services/local-encrypted-storage.service';
import { CashRegisterService } from '../../state/point-of-sale/cash-register/cash-register.service';
import { CashRegisterActions } from '../../state/point-of-sale/cash-register/cash-register.actions';
import { CashRegister } from '../../state/point-of-sale/cash-register/cash-register.model';

@Injectable({ providedIn: 'root' })
export class CashRegisterSyncService {
  constructor(
    private store: Store,
    private localStorage: LocalEncryptedStorageService
  ) {}

 
  async handleRemoteUpdate(updatedCashRegister: CashRegister): Promise<void> {
  const identity = await this.localStorage.loadIdentity();
  if (!identity) return;

  const { userId, gymId } = identity;

  const list = await this.localStorage.loadTableFromLocalCache<CashRegister>(
    userId,
    gymId,
    'cashRegisters'
  ) ?? [];

  const exists = list.some(c => c.id === updatedCashRegister.id);
 const updatedList = exists
  ? list.map(c => {
      if (c.id === updatedCashRegister.id) {
        return {
          ...updatedCashRegister,
          cashier: updatedCashRegister.cashier?.userId ? updatedCashRegister.cashier : c.cashier
        };
      }
      return c;
    })
  : [...list, updatedCashRegister];


  await this.localStorage.saveTableToLocalCache(
    userId,
    gymId,
    'cashRegisters',
    updatedList
  );

  await this.localStorage.saveVersion(
    userId,
    gymId,
    'cashRegisters',
  new Date(updatedCashRegister.updatedAt).toISOString() // 👈 aquí
  );

  this.store.dispatch(CashRegisterActions.loadCashRegistersSuccess({ cashRegisters: updatedList }));
  console.log(`📦 Caja ${updatedCashRegister.id} sincronizada desde WebSocket`);
}
async removeFromLocal(id: number): Promise<void> {
  const identity = await this.localStorage.loadIdentity();
  if (!identity) return;

  const { userId, gymId } = identity;

  const list = await this.localStorage.loadTableFromLocalCache<CashRegister>(
    userId,
    gymId,
    'cashRegisters'
  ) || [];

  const updatedList = list.filter(c => c.id !== id);

  await this.localStorage.saveTableToLocalCache(userId, gymId, 'cashRegisters', updatedList);

  this.store.dispatch(CashRegisterActions.loadCashRegistersSuccess({ cashRegisters: updatedList }));

  console.log(`🗑️ Caja con ID ${id} eliminada de local y actualizada en Redux`);
}

}
