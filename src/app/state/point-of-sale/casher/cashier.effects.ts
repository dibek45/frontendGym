import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as CashierActions from './cashier.actions';
import { CashierService } from './cashier.service';

@Injectable()
export class CashierEffects {
  constructor(
    private actions$: Actions,
    private cashierService: CashierService
  ) {}

  // Efecto para agregar un cajero
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

  // Efecto para cargar cajeros
  loadCashiers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CashierActions.loadCashiers),
      mergeMap(() =>
        this.cashierService.getAllCashiers(1).pipe(
          map((cashiers) =>
            CashierActions.loadCashiersSuccess({ cashiers })
          ),
          catchError((error) =>
            of(CashierActions.loadCashiersFailure({ error: error.message }))
          )
        )
      )
    )
  );

  
}
