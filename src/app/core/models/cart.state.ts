// cart.state.ts

import { ProductModel } from "./product.interface";


export interface CartItem {
  product: ProductModel;
  quantity: number;
  total: number;

}

export interface CartState {
  items: CartItem[];
  total: number;
}
