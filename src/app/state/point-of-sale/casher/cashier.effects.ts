import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, from } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as CashierActions from './cashier.actions';
import { CashierService } from './cashier.service';

@Injectable()
export class CashierEffects {
  constructor(
    private actions$: Actions,
    private cashierService: CashierService
  ) {}

  // ✅ Crear cajero
  addCashier$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CashierActions.addCashier),
      mergeMap((action) =>
        this.cashierService.createCashier(action.cashier).pipe(
          map((cashier) =>
            CashierActions.addCashierSuccess({ cashier })
          ),
          catchError((error) =>
            of(CashierActions.addCashierFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // ✅ Cargar cajeros usando Local First
  loadCashiers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CashierActions.loadCashiers),
      mergeMap(() =>
        from(this.cashierService.getCashiersWithCache()).pipe(
          map((cashiers) => CashierActions.loadCashiersSuccess({ cashiers })),
          catchError((error) => of(CashierActions.loadCashiersFailure({ error: error.message })))
        )
      )
    )
  );
}
