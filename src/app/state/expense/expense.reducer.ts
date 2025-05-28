import { createReducer, on } from '@ngrx/store';
import { ExpenseModel } from './expense.model';
import * as ExpenseActions from './expense.actions';

export interface ExpenseState {
  expenses: ExpenseModel[];
  loading: boolean;
  searchTerm: string;
  error?: any;
}

export const InitialExpenseState: ExpenseState = {
  expenses: [],
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
  expenses: expenses.slice() // <-- 🔧 Clonamos como array mutable
})),


  on(ExpenseActions.loadExpensesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(ExpenseActions.addExpense, (state, { expense }) => ({
    ...state,
    expenses: [...state.expenses, expense]
  })),

  on(ExpenseActions.updateExpense, (state, { tempId, updatedExpense }) => ({
    ...state,
    expenses: state.expenses.map(exp =>
      exp.tempId === tempId ? { ...exp, ...updatedExpense } : exp
    )
  })),

  on(ExpenseActions.syncExpense, (state, { expense }) => ({
    ...state,
    expenses: state.expenses.map(e =>
      e.tempId === expense.tempId ? { ...e, syncing: true } : e
    )
  })),

  on(ExpenseActions.syncExpenseSuccess, (state, { tempId, updatedExpense }) => ({
    ...state,
    expenses: state.expenses.map(exp =>
      exp.tempId === tempId ? { ...exp, ...updatedExpense, syncError: false } : exp
    )
  })),

  on(ExpenseActions.syncExpenseFailure, (state, { tempId, error }) => ({
    ...state,
    expenses: state.expenses.map(exp =>
      exp.tempId === tempId ? { ...exp, syncError: true } : exp
    ),
    error
  }))
);
