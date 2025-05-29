import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { ExpenseState } from './expense.reducer';

// 🔹 Selector base del estado de gastos
export const selectExpenseState = (state: AppState) => state.expenses;

// 🔹 Lista completa de gastos
export const selectAllExpenses = createSelector(
  selectExpenseState,
  (state: ExpenseState) => state.list ?? [] // ✅ usa "list" en vez de "expenses"
);

// 🔹 Estado de carga
export const selectExpensesLoading = createSelector(
  selectExpenseState,
  (state: ExpenseState) => state.loading
);

// 🔹 Errores (si los manejas)
export const selectExpensesError = createSelector(
  selectExpenseState,
  (state: ExpenseState) => state.error
);

// 🔸 Solo sincronizados
export const selectSyncedExpenses = createSelector(
  selectAllExpenses,
  expenses => expenses.filter(e => e.isSynced === true)
);

// 🔸 Solo no sincronizados (pendientes)
export const selectUnsyncedExpenses = createSelector(
  selectAllExpenses,
  expenses => expenses.filter(e => !e.isSynced)
);

// 🔸 Con errores de sincronización
export const selectExpensesWithSyncError = createSelector(
  selectAllExpenses,
  expenses => expenses.filter(e => e.syncError === true)
);

// 🔸 Por búsqueda (si implementas searchTerm luego)
export const selectExpenseSearchTerm = createSelector(
  selectExpenseState,
  (state: ExpenseState) => state.searchTerm
);
