import { CashMovement } from "../cash-movement/cash-movement.model";

export interface CashMovementState {
  cashMovements: CashMovement[]; // Lista de movimientos de caja
  error: any | null;             // Manejo de errores
}

export const initialCashMovementState: CashMovementState = {
  cashMovements: [], // Inicialmente sin movimientos
  error: null,       // Sin errores al inicio
};
