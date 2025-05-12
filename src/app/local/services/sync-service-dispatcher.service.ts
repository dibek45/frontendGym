import { Injectable } from '@angular/core';
import { CashRegisterService } from 'src/app/state/point-of-sale/cash-register/cash-register.service';
import { Store } from '@ngrx/store';
import { CashRegisterActions } from 'src/app/state/point-of-sale/cash-register/cash-register.actions';
import { LocalEncryptedStorageService } from './local-encrypted-storage.service';

@Injectable({
  providedIn: 'root',
})
export class SyncServiceDispatcher {
  constructor(
    private cashRegisterService: CashRegisterService,
    private store: Store,
    private localStorage: LocalEncryptedStorageService
  ) {}

  async dispatch(table: string): Promise<void> {
    const identity = await this.localStorage.loadIdentity();
    if (!identity) return;

    switch (table) {
      case 'cashRegisters': {
        const list = await this.cashRegisterService.getCashRegistersWithCache(true);
        this.store.dispatch(CashRegisterActions.loadCashRegistersSuccess({ cashRegisters: list }));
        break;
      }

      default:
        console.warn(`⚠️ Tabla no soportada en SyncServiceDispatcher: ${table}`);
        break;
    }
  }
}
