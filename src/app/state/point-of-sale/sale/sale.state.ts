import { Sale } from './sale.model'; // Asegúrate de importar el modelo correcto

// Define la estructura del estado de ventas
export interface SaleState {
  sales: Sale[];
  loading: boolean;
  error: string | null;
  startDate: string | null;
  endDate: string | null;
  selectedCashRegisterId: number | null;  // 🔹 Filtro por caja
  selectedCashierId: number | null;   
}

export const initialSaleState: SaleState = {
  sales: [],
  loading: false,
  error: null,
  startDate: null,
  endDate: null,
  selectedCashRegisterId: null,  // 🔹 Inicialmente sin filtro
  selectedCashierId: null        // 🔹 Inicialmente sin filtro
};

