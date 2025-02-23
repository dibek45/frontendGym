import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { CashRegister } from './cash-register.model';
import { Sale } from './sale.model';
import { CashMovement } from '../cash-movement/cash-movement.model';

export const CashRegisterActions = createActionGroup({
  source: 'CashRegister/API',
  events: {
    // Cargar todas las cajas registradoras
    'Load CashRegisters': emptyProps(),
    'Load CashRegisters Success': props<{ cashRegisters: CashRegister[] }>(),
    'Load CashRegisters Failure': props<{ error: any }>(),

    // Agregar una caja registradora
    'Add CashRegister': props<{ cashRegister: CashRegister }>(),
    'Add CashRegister Success': props<{ cashRegister: CashRegister }>(),
    'Add CashRegister Failure': props<{ error: any }>(),

    // Agregar una venta a una caja registradora

    // Actualizar una caja registradora
    'Update CashRegister': props<{ id: number; changes: Partial<CashRegister> }>(),


     // Agregar un movimiento
     'Add Movement': props<{ cashRegisterId: number; movement: CashMovement }>(),
     'Add Movement Success': props<{ cashRegisterId: number; movement: CashMovement }>(),
     'Add Movement Failure': props<{ error: any }>(),
 
     // Agregar una venta
     'Add Sale': props<{ cashRegisterId: number; sale: Sale }>(),
     'Add Sale Success': props<{ cashRegisterId: number; sale: Sale }>(),
     'Add Sale Failure': props<{ error: any }>(), // Manejo de errores
  },
});

