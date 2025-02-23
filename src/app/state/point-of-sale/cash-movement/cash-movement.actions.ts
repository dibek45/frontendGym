import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { CashMovement } from '../cash-movement';

export const CashMovementActions = createActionGroup({
  source: 'CashMovement/API',
  events: {
    'Load CashMovements': emptyProps(), // Cargar movimientos
    'Load CashMovements Success': props<{ cashMovements: CashMovement[] }>(), // Éxito
    'Load CashMovements Failure': props<{ error: any }>(), // Error
    'Add CashMovement': props<{ cashMovement: CashMovement }>(), // Agregar movimiento
    'Update CashMovement': props<{ id: number; changes: Partial<CashMovement> }>(), // Actualizar movimiento
    'Delete CashMovement': props<{ id: number }>(), // Eliminar movimiento
  },
});
