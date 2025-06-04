import { Sale } from "./sale.model";

// Define la estructura del estado de ventas
export interface SaleState {
  sales: Sale[];
  loading: boolean;
  error: string | null;
  startDate: string | null;
  endDate: string | null;
  selectedCashRegisterId: number | null;  // 🔹 Filtro por caja
  selectedCashierId: number | null;   
  searchTerm: string; // 🔥 Aquí debe ser "string", no ""

}

export const initialSaleState: SaleState = {
  sales: [],
  loading: false,
  error: null,
  startDate: null,
  endDate: null,
  selectedCashRegisterId: null,  // 🔹 Inicialmente sin filtro
  selectedCashierId: null ,       // 🔹 Inicialmente sin filtro
  searchTerm: '', // nuevo
};

