import { SaleDetail } from "src/app/core/models/sale-detail.state";

export interface SaleModel {
  id: number;                 // Identificador único de la venta
  cashRegisterId: number;     // Identificador de la caja registradora
  customerId: number;         // Identificador del cliente
  date: Date;                 // Fecha de la venta
  totalAmount: number;        // Monto total de la venta
  saleDetails: SaleDetail[];  // Detalles de la venta
  
  // 🔄 Campos de sincronización
  updatedAt?: string;              // Última vez actualizado
  isSynced?: boolean;              // true si ya se sincronizó con backend
  syncError?: boolean;             // true si hubo error al sincronizar
  tempId?: string;                 // ID temporal antes de obtener el ID real

  cashRegister?: { id: number };

}