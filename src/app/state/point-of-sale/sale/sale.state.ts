import { Sale } from './sale.model'; // Asegúrate de importar el modelo correcto

// Define la estructura del estado de ventas
export interface SaleState {
  sales: Sale[];      // Lista de ventas
  error: any | null;  // Para manejar errores
}

// Define el estado inicial para las ventas
export const initialSaleState: SaleState = {
  sales: [],  // Inicialmente no hay ventas
  error: null, // Sin errores al inicio
};
