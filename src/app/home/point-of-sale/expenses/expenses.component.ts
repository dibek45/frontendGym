import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, of, map } from 'rxjs';

import { ExpenseModel } from 'src/app/state/expense/expense.model';
import { AppState } from 'src/app/state/app.state';

import {
  selectAllExpenses,
  selectUnsyncedExpenses,
  selectSyncedExpenses,
  selectExpensesWithSyncError,
  selectExpensesLoading
} from 'src/app/state/expense/expenses.selectors';

import { syncExpense } from 'src/app/state/expense/expense.actions';

import { DataPerDay, SummaryWeeklyComponent } from '../components/earnings-summary/summary-weekly.component';
import { SearchCreateListComponent } from '../components/search-create-list/search-create-list.component';
import { ExpenseCardComponent } from '../components/expense-card/expense-card.component';

@Component({
  selector: 'app-expenses',
  standalone: true,
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
  imports: [CommonModule, SummaryWeeklyComponent, SearchCreateListComponent],
})
export class ExpensesComponent implements OnInit {
  cardComponent = ExpenseCardComponent;

  displayedColumns: string[] = [
    'id',
    'description',
    'amount',
    'paymentMethod',
    'expenseDate',
    'category',
    'createdBy',
    'actions'
  ];

startOfWeek = this.getStartOfWeek(new Date());

getStartOfWeek(date: Date): Date {
  const day = date.getDay(); // 0 (Sun) - 6 (Sat)
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Lunes
  return new Date(date.setDate(diff));
}

  // Store observables
  expenses$: Observable<ExpenseModel[]> = this.store.select(selectAllExpenses);
  syncedExpenses$: Observable<ExpenseModel[]> = this.store.select(selectSyncedExpenses);
  unsyncedExpenses$: Observable<ExpenseModel[]> = this.store.select(selectUnsyncedExpenses);
  expensesWithSyncError$: Observable<ExpenseModel[]> = this.store.select(selectExpensesWithSyncError);
  loading$: Observable<boolean> = this.store.select(selectExpensesLoading);

  // Para la gráfica
  gastosSemana$: Observable<DataPerDay[]> = this.expenses$.pipe(
    map((expenses) => {
      const grouped: { [date: string]: { amount: number; tickets: number } } = {};
      for (const e of expenses) {
        const date = e.expenseDate.split('T')[0];
        if (!grouped[date]) grouped[date] = { amount: 0, tickets: 0 };
        grouped[date].amount += e.amount;
        grouped[date].tickets += 1;
      }
      return Object.entries(grouped).map(([date, val]) => ({
        date,
        amount: val.amount,
        tickets: val.tickets,
      }));
    })
  );

  showActivityList = false;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.expenses$.subscribe(expenses => {
      console.log('📦 Gastos cargados desde el store:', expenses);
    });

    this.expenses$.subscribe(expenses => {
  console.log('📦 Gastos cargados desde el store:', expenses);
});
  }

  handleSeeActivity() {
    this.showActivityList = true;
  }

  handleBackToSummary() {
    this.showActivityList = false;
  }

  onCreate() {
    alert('🆕 Agregar nuevo gasto');
  }

  onEdit(item: ExpenseModel) {
    alert('✏️ Editar: ' + item.description);
  }

  onDelete(item: ExpenseModel) {
    alert('🗑️ Eliminar: ' + item.description);
  }

  onRetrySync(item: ExpenseModel) {
    this.store.dispatch(syncExpense({ expense: item }));
  }
}
