import { SaleDetail } from "src/app/core/models/sale-detail.state";


export interface Sale {
  id: number;                 // Identificador único de la venta
  customerId?: number;        // 🔹 Opcional: Puede que no siempre haya cliente
  saleDate: Date;             // Fecha de la venta
  totalAmount: number;        // Monto total de la venta
  paymentMethod?: string;     // 🔹 Opcional: Puede haber ventas sin pago registrado
  saleDetails: SaleDetail[];  // Lista de detalles de la venta

  cashRegister?: {            // 🔹 Opcional: Puede no estar definido en algunos casos
    id: number;
    cashier: {
      id: number;
      name: string;
    };
  };


}

