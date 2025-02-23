import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { SaleDetailActions } from './sale-detail.actions';

@Injectable()
export class SaleDetailEffects {
  loadSaleDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SaleDetailActions.loadSaleDetails),
      concatMap(() =>
        // Reemplaza EMPTY con tu llamada a API o servicio real
        EMPTY.pipe(
          map((saleDetails) =>
            SaleDetailActions.loadSaleDetails() // Usar el campo correcto
          ),
          catchError((error) =>
            of(SaleDetailActions['loadSaleDetailsFailure']({ error }))
          )
        )
      )
    );
  });

  constructor(private actions$: Actions) {}
}
