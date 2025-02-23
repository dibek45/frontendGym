import { createReducer, on } from '@ngrx/store';
import { SaleDetail, initialState } from '../../../core/models/sale-detail.state';
import { SaleDetailActions } from './sale-detail.actions';
export const saleDetailsFeatureKey = 'saleDetail';

export const saleDetailReducer = createReducer(
  initialState,

  // Manejar carga exitosa
  on(SaleDetailActions['loadSaleDetailsSuccess'], (state, { saleDetails }) => ({
    ...state,
    saleDetails, // Actualizar los detalles
  })),

  // Manejar fallo en la carga
  on(SaleDetailActions['loadSaleDetailsFailure'], (state, { error }) => ({
    ...state,
    error, // Almacenar el error
  })),

  // Agregar un detalle de venta
  on(SaleDetailActions['addSaleDetail'], (state, { saleDetail }) => ({
    ...state,
    saleDetails: [...state.saleDetails, saleDetail], // Agregar nuevo detalle
  }))
);
