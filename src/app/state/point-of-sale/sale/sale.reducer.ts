import { createReducer, on } from '@ngrx/store';
import { initialSaleState } from './sale.state';
import * as SaleActions from './sale.actions';

export const salesReducer = createReducer(
  initialSaleState,

  on(SaleActions.loadSalesSuccess, (state, { sales }) => ({
    ...state,
    sales: sales,
    loading: false,
    error: null
  })),

  on(SaleActions.loadSalesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(SaleActions.setStartDate, (state, { startDate }) => ({
    ...state,
    startDate
  })),

  on(SaleActions.setEndDate, (state, { endDate }) => ({
    ...state,
    endDate
  })),

  on(SaleActions.setCashRegisterId, (state, { cashRegisterId }) => ({
    ...state,
    selectedCashRegisterId: cashRegisterId
  })),

  on(SaleActions.setCashierId, (state, { cashierId }) => ({
    ...state,
    selectedCashierId: cashierId
  })),

  on(SaleActions.setSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm
  })),

  on(SaleActions.resetFilters, (state) => ({
    ...state,
    startDate: null,
    endDate: null,
    selectedCashRegisterId: null,
    selectedCashierId: null,
    searchTerm: '' // 🔥 también limpiar el término de búsqueda
  }))
);
