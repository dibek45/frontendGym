import { createAction, createActionGroup, emptyProps, props } from '@ngrx/store';
import { ExpenseModel } from './expense.model';

export const loadExpenses = createAction(
  '[Load expenses]',
  props<{ gymId: number }>() // Si quieres filtrar por gym desde effects
);

export const loadExpensesSuccess = createAction(
  '[Retrieved expense List]',
  props<{ expenses: ReadonlyArray<ExpenseModel> }>()
);

export const loadExpensesFailure = createAction(
  '[Load Expenses Failed]',
  props<{ error: any }>()
);

export const addExpense = createAction(
  '[Add Expense]',
  props<{ expense: ExpenseModel }>()
);

export const updateExpense = createAction(
  '[Expenses] Update Expense',
  props<{ tempId: string; updatedExpense: ExpenseModel }>()
);

export const syncExpense = createAction(
  '[Expenses] Sync Expense',
  props<{ expense: ExpenseModel }>()
);

export const syncExpenseSuccess = createAction(
  '[Expenses] Sync Expense Success',
  props<{ tempId: string; updatedExpense: ExpenseModel }>()
);

export const syncExpenseFailure = createAction(
  '[Expenses] Sync Expense Failure',
  props<{ tempId: string; error: any }>()
);

// Acciones del formulario si las necesitas
export const ExpenseFormActions = createActionGroup({
  source: 'Expense Form',
  events: {
    'Form Submitted': emptyProps(),
    'Form Reset': emptyProps(),
    'Form Error': emptyProps()
  }
});
