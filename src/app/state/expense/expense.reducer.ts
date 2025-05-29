import { createReducer, on } from '@ngrx/store';
import { ExpenseModel } from './expense.model';
import * as ExpenseActions from './expense.actions';

export interface ExpenseState {
  list: ExpenseModel[]; // ✅ renamed from "expenses"
  loading: boolean;
  searchTerm: string;
  error?: any;
}

export const InitialExpenseState: ExpenseState = {
  list: [],
  loading: false,
  searchTerm: '',
  error: null
};

export const ExpenseReducer = createReducer(
  InitialExpenseState,

  on(ExpenseActions.loadExpenses, (state) => ({
    ...state,
    loading: true
  })),

  on(ExpenseActions.loadExpensesSuccess, (state, { expenses }) => ({
    ...state,
    loading: false,
    list: expenses.slice() // ✅ updated
  })),

  on(ExpenseActions.loadExpensesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(ExpenseActions.addExpense, (state, { expense }) => ({
    ...state,
    list: [...state.list, expense] // ✅ updated
  })),

  on(ExpenseActions.updateExpense, (state, { tempId, updatedExpense }) => ({
    ...state,
    list: state.list.map(exp =>
      exp.tempId === tempId ? { ...exp, ...updatedExpense } : exp
    )
  })),

  on(ExpenseActions.syncExpense, (state, { expense }) => ({
    ...state,
    list: state.list.map(e =>
      e.tempId === expense.tempId ? { ...e, syncing: true } : e
    )
  })),

  on(ExpenseActions.syncExpenseSuccess, (state, { tempId, updatedExpense }) => ({
    ...state,
    list: state.list.map(exp =>
      exp.tempId === tempId ? { ...exp, ...updatedExpense, syncError: false } : exp
    )
  })),

  on(ExpenseActions.syncExpenseFailure, (state, { tempId, error }) => ({
    ...state,
    list: state.list.map(exp =>
      exp.tempId === tempId ? { ...exp, syncError: true } : exp
    ),
    error
  }))
);
