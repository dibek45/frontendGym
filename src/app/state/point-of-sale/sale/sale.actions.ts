import { createAction, props } from '@ngrx/store';

// 🔹 Cargar ventas con filtros (siempre con `gymId`)
export const loadSales = createAction(
  '[Sales] Load Sales',
  props<{ gymId: number }>() // 🔹 Pasamos gymId en la acción
);
export const loadSalesSuccess = createAction(
  '[Sales] Load Sales Success',
  props<{ sales: any[] }>()
);
export const loadSalesFailure = createAction(
  '[Sales] Load Sales Failure',
  props<{ error: any }>()
);

// 🔹 Crear nueva venta (siempre con `gymId`)
export const createSale = createAction(
  '[Sales] Create Sale',
  props<{ sale: any }>()
);
export const createSaleSuccess = createAction(
  '[Sales] Create Sale Success',
  props<{ sale: any }>()
);
export const createSaleFailure = createAction(
  '[Sales] Create Sale Failure',
  props<{ error: any }>()
);

// 🔹 Actualizar venta (siempre con `gymId`)
export const updateSale = createAction(
  '[Sales] Update Sale',
  props<{ saleId: number, gymId: number, sale: any }>()
);
export const updateSaleSuccess = createAction(
  '[Sales] Update Sale Success',
  props<{ sale: any }>()
);
export const updateSaleFailure = createAction(
  '[Sales] Update Sale Failure',
  props<{ error: any }>()
);

// 🔹 Eliminar venta (siempre con `gymId`)
export const deleteSale = createAction(
  '[Sales] Delete Sale',
  props<{ saleId: number, gymId: number }>()
);
export const deleteSaleSuccess = createAction(
  '[Sales] Delete Sale Success',
  props<{ saleId: number }>()
);
export const deleteSaleFailure = createAction(
  '[Sales] Delete Sale Failure',
  props<{ error: any }>()
);
