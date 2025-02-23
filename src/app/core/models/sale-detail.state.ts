export interface SaleDetail {
  id: string;         // Identificador único del detalle
  saleId: string;     // Identificador de la venta a la que pertenece
  quantity: number;   // Cantidad vendida
  unitPrice: number;  // Precio unitario del producto
  totalPrice: number; // Precio total (quantity * unitPrice)

  product: {          // Producto completo (con campos opcionales)
    id: string;
    name: string;
    created_at?: string;  // 🔹 Opcional
    available?: boolean;  // 🔹 Opcional
    img?: string;         // 🔹 Opcional
    stock?: number;       // 🔹 Opcional
    price: number;
    categoryId?: number;  // 🔹 Opcional
    gymId?: number;       // 🔹 Opcional
    barcode?: string;     // 🔹 Opcional
  };
}

  
  export interface SaleDetailState {
    saleDetails: SaleDetail[]; // Lista de detalles de venta
    error: any | null;         // Manejo de errores
  }
  
  // Define el estado inicial
  export const initialState: SaleDetailState = {
    saleDetails: [], // Inicializa la lista como vacía
    error: null,     // Sin errores al inicio
  };
  