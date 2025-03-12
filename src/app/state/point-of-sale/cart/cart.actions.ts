// cart.actions.ts
import { createAction, props } from '@ngrx/store';
import { CartItem } from 'src/app/core/models/cart.state';
import { ProductModel } from 'src/app/core/models/product.interface';
import { CartItemModel } from 'src/app/home/product/cart/cart-item.model';

export const addItemToCart = createAction(
  '[Cart] Add Item',
  props<{ item: CartItemModel }>()
);

export const updateCart = createAction(
  '[Cart] Update Cart',
  props<{ items: CartItemModel[] }>() // ✅ Se asegura de que se usa `CartItemModel[]`
);


export const removeItemFromCart = createAction(
  '[Cart] Remove Item',
  props<{ productId: number }>()
);

export const updateMembershipPlan = createAction(
  '[Cart] Update Membership Plan',
  props<{ index: number; newPlan: ProductModel }>()
);

export const updateProductQuantity = createAction(
  '[Cart] Update Product Quantity',
  props<{ index: number; quantity: number }>()
);

export const updateItemQuantity = createAction(
  '[Cart] Update Item Quantity',
  props<{ productId: number; quantity: number }>() // ✅ Asegurar que los parámetros sean correctos
);
export const clearCart = createAction('[Cart] Clear Cart');


export const calculateTotal = createAction('[Cart] Calculate Total');
