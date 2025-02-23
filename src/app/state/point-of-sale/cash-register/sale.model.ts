import { SaleDetail } from "src/app/core/models/sale-detail.state";

export interface Sale {
  id: number;                 // Identificador único de la venta
  cashRegisterId: number;     // Identificador de la caja registradora
  customerId: number;         // Identificador del cliente
  date: Date;                 // Fecha de la venta
  totalAmount: number;        // Monto total de la venta
  saleDetails: SaleDetail[];  // Detalles de la venta
}