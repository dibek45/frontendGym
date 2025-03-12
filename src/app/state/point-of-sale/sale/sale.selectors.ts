import { createSelector, createFeatureSelector } from '@ngrx/store';
import { SaleState } from './sale.state';

export const selectSalesState = createFeatureSelector<SaleState>('sales');

export const selectFilteredSales = createSelector(
  selectSalesState,
  (state: SaleState) => {
    const { sales, startDate, endDate, selectedCashierId, selectedCashRegisterId } = state;

    return sales.filter(sale => {
      const saleDate = sale.saleDate ? new Date(sale.saleDate) : null;

      if (!saleDate) return false;
      if (startDate && saleDate < new Date(startDate)) return false;
      if (endDate && saleDate > new Date(endDate)) return false;
      if (selectedCashRegisterId !== null && sale.cashRegister?.id !== selectedCashRegisterId) return false;
      if (selectedCashierId !== null && sale.cashRegister?.cashier?.id !== selectedCashierId) return false;

      return true;
    });
  }
);
