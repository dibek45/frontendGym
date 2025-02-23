import { createReducer, on } from '@ngrx/store';
import * as SalesActions from './sale.actions';

export interface SalesState {
  sales: any[];
  error: any;
}

const initialState: SalesState = {
  sales: [],
  error: null
};

export const salesReducer = createReducer(
  initialState,
  on(SalesActions.loadSalesSuccess, (state, { sales }) => {
    console.log('📌 Ventas guardadas en Redux:', sales);
  
    sales.forEach(sale => {
      if (!sale.gym || !sale.gym.name) {
        console.warn(`⚠ La venta ID ${sale.id} no tiene información de gym.`);
      }
      if (!sale.cashRegister || !sale.cashRegister.id) {
        console.warn(`⚠ La venta ID ${sale.id} no tiene una caja registradora.`);
      }
    });
  
    return { 
      ...state, 
      sales: sales.map(sale => ({
        ...sale,
        gym: sale.gym ? sale.gym : { name: 'Gimnasio Desconocido' }, // 🔥 Si no hay gym, poner nombre por defecto
        cashRegister: sale.cashRegister ? sale.cashRegister : undefined, // ❓ Puede ser undefined si no existe
        paymentMethod: sale.paymentMethod || 'Desconocido' // 🔥 Valor por defecto si no hay método de pago
      }))
    };
  }),
  
  
  on(SalesActions.createSaleSuccess, (state, { sale }) => ({
    ...state,
    sales: [...state.sales, sale]
  })),
  on(SalesActions.updateSaleSuccess, (state, { sale }) => ({
    ...state,
    sales: state.sales.map(s => s.id === sale.id ? sale : s)
  })),
  on(SalesActions.deleteSaleSuccess, (state, { saleId }) => ({
    ...state,
    sales: state.sales.filter(s => s.id !== saleId)
  })),
  on(SalesActions.loadSalesFailure, SalesActions.createSaleFailure, SalesActions.updateSaleFailure, SalesActions.deleteSaleFailure, (state, { error }) => ({
    ...state,
    error
  }))
);
