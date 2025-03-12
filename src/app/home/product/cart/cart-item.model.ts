import { ProductModel } from "src/app/core/models/product.interface";


export interface CartItemModel {
  product: ProductModel;
  quantity: number;
  total: number; // Required total for the item
  img?: string; // Ahora la propiedad img es opcional
  selectedPlan?: number;

}
  