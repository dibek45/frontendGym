import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as SalesActions from './sale.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { SalesService } from './sales.service';

@Injectable()
export class SalesEffects {
  constructor(private actions$: Actions, private salesService: SalesService) {}

loadSales$ = createEffect(() =>
  this.actions$.pipe(
    ofType(SalesActions.loadSales),
    tap(() => console.log('[Effect] loadSales triggered')),
    switchMap(() =>
      from(this.salesService.getSalesWithCache()).pipe(
        tap(data => console.log('✅ Ventas cargadas desde getSalesWithCache:', data)),
        map((sales) => {
          console.log('✅ Ventas cargadas con efecto:', sales);
          return SalesActions.loadSalesSuccess({ sales });
        }),
        catchError((error) =>
          of(SalesActions.loadSalesFailure({ error: error.message }))
        )
      )
    )
  )
);

  

  // 🔹 Effect para crear una nueva venta
  createSale$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesActions.createSale),
      switchMap(action =>
        this.salesService.createSale(action.sale).pipe(
          map(response => {
            console.log('📌 Venta creada:', response);
            return SalesActions.createSaleSuccess({ sale: response?.data?.createSale });
          }),
          catchError(error => {
            console.error('❌ Error al crear venta:', error);
            return of(SalesActions.createSaleFailure({ error }));
          })
        )
      )
    )
  );

  // 🔹 Effect para actualizar una venta
  updateSale$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesActions.updateSale),
      switchMap(action =>
        this.salesService.updateSale(action.saleId, action.gymId, action.sale).pipe(
          map(response => {
            console.log('📌 Venta actualizada:', response);
            return SalesActions.updateSaleSuccess({ sale: response?.data?.updateSale });
          }),
          catchError(error => {
            console.error('❌ Error al actualizar venta:', error);
            return of(SalesActions.updateSaleFailure({ error }));
          })
        )
      )
    )
  );

  // 🔹 Effect para eliminar una venta
  deleteSale$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesActions.deleteSale),
      switchMap(action =>
        this.salesService.deleteSale(action.saleId, action.gymId).pipe(
          map(() => {
            console.log(`📌 Venta eliminada con ID: ${action.saleId}`);
            return SalesActions.deleteSaleSuccess({ saleId: action.saleId });
          }),
          catchError(error => {
            console.error('❌ Error al eliminar venta:', error);
            return of(SalesActions.deleteSaleFailure({ error }));
          })
        )
      )
    )
  );
}
