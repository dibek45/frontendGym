// cart.state.ts

import { CartProductModel } from "./product.interface";

export interface CartItem {
  product: CartProductModel;
  quantity: number;
  total: number;

}

export interface CartState {
  items: CartItem[];
  total: number;
}
