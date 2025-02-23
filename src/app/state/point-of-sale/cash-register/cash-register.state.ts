import { CashRegister } from './cash-register.model';

export interface CashRegisterState {
  cashRegisters: CashRegister[]; // Lista de cajas registradoras
  error: any | null;             // Manejo de errores
}

export const initialCashRegisterState: CashRegisterState = {
  cashRegisters: [], // Inicialmente sin cajas registradoras
  error: null,
};
