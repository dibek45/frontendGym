import { Injectable } from '@angular/core';
import { CashRegisterService } from 'src/app/state/point-of-sale/cash-register/cash-register.service';
import { Store } from '@ngrx/store';
import { CashRegisterActions } from 'src/app/state/point-of-sale/cash-register/cash-register.actions';
import { LocalEncryptedStorageService } from './local-encrypted-storage.service';
import { MemberService } from 'src/app/state/member/member.service';
import { loadedMembers } from 'src/app/state/member/member.actions';
import { loadedProducts } from 'src/app/state/product/product.actions';
import { ProductService } from 'src/app/state/product/product.service';
import { loadCashiersSuccess } from 'src/app/state/point-of-sale/casher/cashier.actions';
import { CashierService } from 'src/app/state/point-of-sale/casher/cashier.service';
import { loadExpensesSuccess } from 'src/app/state/expense/expense.actions';
import { ExpenseService } from 'src/app/state/expense/expense.service';
import { CheckinSyncService } from '../tables-sync/checkin-sync.service';
import { CheckinService } from 'src/app/state/checkins/checkins.service';
import { loadCheckinsSuccess } from 'src/app/state/checkins/checkins.actions';

@Injectable({
  providedIn: 'root',
})
export class SyncServiceDispatcher {
  constructor(
    private cashRegisterService: CashRegisterService,
    private memberService: MemberService,
    private productService:ProductService,
    private store: Store,
    private localStorage: LocalEncryptedStorageService,
    private cashierService:CashierService,
    private expenseService:ExpenseService,
     private checkinService: CheckinService,
  private checkinSync: CheckinSyncService
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
      case 'members': {// ✅ este bloque nuevo{}
        const members = await this.memberService.getMembersWithCache(true);
        this.store.dispatch(loadedMembers({ members }));
        break;
      }
      case 'products': {
      const products = await this.productService.getProductsWithCache(true);
      this.store.dispatch(loadedProducts({ products }));
      break;
      }
      case 'cashiers': {
        const cashiers = await this.cashierService.getCashiersWithCache(true);
        this.store.dispatch(loadCashiersSuccess({ cashiers }));
        break;
      }
      case 'expenses': {
        console.log('🔁 Despachando sincronización de expenses...');
        const expenses = await this.expenseService.getExpensesWithCache(true);
        console.log('📦 Gastos cargados desde el servicio:', expenses);
        this.store.dispatch(loadExpensesSuccess({ expenses }));
        break
      }
  case 'checkins': {
  console.log('🔁 Despachando sincronización de checkins...');
  const checkins = await this.checkinService.getCheckinsWithCache(true);
  console.log('📦 Checkins cargados desde el servicio:', checkins);

  this.store.dispatch(loadCheckinsSuccess({ checkins }));

  // Además actualiza en cache local
  const identity = await this.localStorage.loadIdentity();
  if (identity) {
    await this.localStorage.saveTableToLocalCache(
      identity.userId,
      identity.gymId,
      'checkins',
      checkins.map(c => ({
        ...c,
        updatedAt: c.updatedAt ?? new Date().toISOString()
      }))
    );
  }

  break;
}


    default:
      console.warn('⚠️ Tabla no manejada en handleRemoteUpdate:', table);
}


    
  }
}
