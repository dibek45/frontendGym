import { SaleDetail } from "src/app/core/models/sale-detail.state";


export interface Sale {
  id: number;                 // Identificador único de la venta
  customerId?: number;        // 🔹 Opcional: Puede que no siempre haya cliente
  saleDate: Date;             // Fecha de la venta
  totalAmount: number;        // Monto total de la venta
  paymentMethod?: string;     // 🔹 Opcional: Puede haber ventas sin pago registrado
  saleDetails: SaleDetail[];  // Lista de detalles de la venta
  updatedAt?: string; // 👈 Agrega esto

   // 🔄 Campos de sincronización
  isSynced?: boolean;              // true si ya se sincronizó con backend
  syncError?: boolean;             // true si hubo error al sincronizar
  tempId?: string;                 // ID temporal antes de obtener el ID real
  cashRegister?: {            // 🔹 Opcional: Puede no estar definido en algunos casos
    
    id: number;
    cashier: {
      id: number;
      name: string;
    };
  };


}

