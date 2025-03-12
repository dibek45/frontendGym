// cart.selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CartState } from 'src/app/core/models/cart.state';
import { CartItemModel } from 'src/app/home/product/cart/cart-item.model';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(
  selectCartState,
  (state: CartState) => state.items as CartItemModel[]  // Ensure the selector returns CartItemModel[]
);

export const selectCartTotal = createSelector(
  selectCartState,
  (state: CartState) => state.total
);
