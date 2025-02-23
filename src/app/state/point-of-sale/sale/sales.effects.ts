import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as SalesActions from './sale.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SalesService } from './sales.service';

@Injectable()
export class SalesEffects {
  constructor(private actions$: Actions, private salesService: SalesService) {}

  // 🔹 Effect para cargar ventas desde GraphQL con `gymId`
  loadSales$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesActions.loadSales),
      switchMap(action => {
        console.log(`📌 Cargando ventas para gymId: ${action.gymId}`);

        return this.salesService.getSales(action.gymId).pipe(
          map(sales => {
            console.log('📌 Ventas recibidas en Effects:', sales);
            return SalesActions.loadSalesSuccess({ sales }); // 🔹 Guardamos en Redux
          }),
          catchError(error => {
            console.error('❌ Error en la consulta de GraphQL:', error);
            return of(SalesActions.loadSalesFailure({ error }));
          })
        );
      })
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
