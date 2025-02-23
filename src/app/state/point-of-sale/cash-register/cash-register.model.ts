import { CashMovement } from '../cash-movement/cash-movement.model';
import { Cashier } from '../cashier-without.model';
import { Sale } from './sale.model';

export interface CashRegister {
  id?: number;               // Identificador único
  cashierId: number;        // Identificador del cajero
  openingBalance: number;   // Saldo inicial
  currentBalance?: number;   // Saldo actual
  movements?: CashMovement[]; // Movimientos de la caja
  sales?: Sale[];            // Lista de ventas asociadas
  status?: string;           // Estado de la caja ('open', 'closed', etc.)
  openingTime?: Date;        // Fecha de apertura
  cashier?:any,
  gymId:number
}


export interface Casher {
  id?: number;           // Identificador único
  name: string | null;    // Nombre del usuario
  username: string | null; // Nombre de usuario
  password: string | null; // Contraseña
  phone: string | null;    // Número de teléfono
  gymId: number | null;    // Identificador del gimnasio al que pertenece
}
