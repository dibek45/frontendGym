import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ExpenseActions from '../../state/expense/expense.actions';
;
import { LocalEncryptedStorageService } from '../services/local-encrypted-storage.service';
import { ExpenseModel } from 'src/app/state/expense/expense.model';

@Injectable({ providedIn: 'root' })
export class ExpenseSyncService {
  private tableName = 'expenses';

  constructor(
    private store: Store,
    private localStorage: LocalEncryptedStorageService
  ) {}

  async handleRemoteUpdate(updatedExpense: ExpenseModel): Promise<void> {
    const identity = await this.localStorage.loadIdentity();
    if (!identity) {
      console.warn('❌ No hay identidad local');
      return;
    }

  console.log('🧾 updatedExpense recibido:', updatedExpense); // 👈 AQUI

    const expenses = await this.localStorage.loadTableFromLocalCache<ExpenseModel>(
      identity.userId,
      identity.gymId,
      this.tableName
    ) ?? [];

    const index = expenses.findIndex(e => String(e.id) === String(updatedExpense.id));
    if (index >= 0) {
      expenses[index] = { ...expenses[index], ...updatedExpense };
      console.log(`✏️ Gasto actualizado localmente (ID ${updatedExpense.id})`);
    } else {
      expenses.push(updatedExpense);
      console.log(`🆕 Gasto agregado localmente (ID ${updatedExpense.id})`);
    }

      const enrichedExpenses = expenses.map(e => {
        if (e.cashRegisterId === undefined) {
          console.warn('⚠️ Gasto sin cashRegisterId detectado:', e);
        }

  return {
    ...e,
    updatedAt: e.updatedAt ?? new Date().toISOString()
  };
});


    await this.localStorage.saveTableToLocalCache(
      identity.userId,
      identity.gymId,
      this.tableName,
      enrichedExpenses
    );

    this.store.dispatch(ExpenseActions.loadExpensesSuccess({ expenses: enrichedExpenses }));
  }
}
