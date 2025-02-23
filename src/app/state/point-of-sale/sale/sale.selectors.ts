import { createSelector, createFeatureSelector } from '@ngrx/store';
import { SalesState } from './sale.reducer';

// 🔹 Seleccionamos el estado de ventas correctamente
export const selectSalesState = createFeatureSelector<SalesState>('sales');

// 🔹 Seleccionar el estado de ventas

export const selectAllSales = createSelector(
  selectSalesState,
  (state: SalesState) => {
    console.log('📌 Estado de ventas en Redux:', state);
    return state.sales; // 🔹 Devuelve todas las ventas sin filtrar
  }
);

