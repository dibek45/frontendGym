export interface CashMovement {
    id: number; // Identificador único del movimiento
    amount: number; // Monto del movimiento
    type: string; // Tipo de movimiento ('sale', 'deposit', 'withdrawal', 'expense')
    concept?: string; // Concepto o descripción del movimiento (opcional)
    movementDate: Date; // Fecha y hora del movimiento
    cashRegisterId: number; // ID de la caja asociada
    cashierId?: number; // ID del cajero (opcional)
    saleId?: number; // ID de la venta asociada (opcional)
    gymId?: number; // ID del gimnasio asociado (opcional)
  }
  