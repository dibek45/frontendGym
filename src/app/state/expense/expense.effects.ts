import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { of, from } from 'rxjs';
import { map, catchError, switchMap, mergeMap, tap } from 'rxjs/operators';
import * as ExpenseActions from './expense.actions';
import { ExpenseService } from './expense.service';
import { ExpenseModel } from './expense.model';

@Injectable()
export class ExpenseEffects {
  constructor(
    private actions$: Actions,
    private expenseService: ExpenseService
  ) {}

  loadExpenses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExpenseActions.loadExpenses),
      tap(() => console.log('🟡 [Effect] loadExpenses triggered')),
      switchMap(() =>
        from(this.expenseService.getExpensesWithCache()).pipe(
          map((expenses) => ExpenseActions.loadExpensesSuccess({ expenses })),
          catchError((error) => {
            console.error('❌ Error in loadExpenses effect:', error);
            return of(ExpenseActions.loadExpensesFailure({ error }));
          })
        )
      )
    )
  );

  syncExpense$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExpenseActions.syncExpense),
      mergeMap(({ expense }) =>
        from(this.syncExpenseAsync(expense)) // Manejo manual como en miembros
      )
    )
  );

  private async syncExpenseAsync(expense: ExpenseModel) {
    try {
      console.log('🔥 Inicia sincronización de gasto:', expense);
      const response = await this.expenseService.createExpense(expense);

      if (!response || !response.id) {
        console.warn('⚠️ Backend respondió sin id');

        return ExpenseActions.syncExpenseFailure({
          tempId: expense.tempId!,
          error: 'No se pudo guardar el gasto en backend'
        });
      }

      const updatedExpense: ExpenseModel = {
        ...expense,
        ...response,
        isSynced: true,
        syncError: false,
        tempId: expense.tempId!
      };

      console.log('🟢 Gasto sincronizado:', updatedExpense);

      return ExpenseActions.syncExpenseSuccess({
        tempId: expense.tempId!,
        updatedExpense
      });

    } catch (error) {
      console.error('❌ Error al sincronizar gasto:', error);
      const errorMessage = (error as Error).message || 'Error desconocido';

      return ExpenseActions.syncExpenseFailure({
        tempId: expense.tempId!,
        error: errorMessage
      });
    }
  }
}
