// cart.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { CartItem, CartState } from 'src/app/core/models/cart.state';
import { addItemToCart, calculateTotal, clearCart, removeItemFromCart, updateCart, updateItemQuantity } from '../actions/cart.actions';

const initialState: CartState = {
  items: [],
  total: 0,
};

export const cartReducer = createReducer(
  initialState,
  on(addItemToCart, (state, { item }) => {
    const existingItem = state.items.find(i => i.product.id === item.product.id);
    if (existingItem) {
      
      return {
        ...state,
        items: state.items.map(i =>
          i.product.id === item.product.id ? { ...i, quantity: i.quantity + item.quantity } : i
        ),
      };
    } else {
      return {
        ...state,
        items: [...state.items, item],
      };
    }
  }),
  on(removeItemFromCart, (state, { productId }) => ({
    ...state,
    items: state.items.filter((i:CartItem ) => i.product.id !== productId),
  })),
  on(updateItemQuantity, (state, { productId, quantity }) => ({
    ...state,
    items: state.items.map((i:CartItem )=>
      i.product.id === productId ? { ...i, quantity } : i
    ),
  })),
  on(calculateTotal, (state) => ({
    ...state,
    total: state.items.reduce((sum: number, item: CartItem) => sum + item.product.price * item.quantity, 0),
})),
on(clearCart, (state) => ({
    ...state,
    items: [],    // Empty the cart items
    total: 0      // Reset total to zero
  })),

  on(updateCart, (state, { items }) => ({
    ...state,
    items: items.map(item => ({
      ...item,
      product: {
        ...item.product,
        available: item.product.available ?? true,
        img: item.product.img ?? '',
        stock: item.product.stock ?? 0
      },
      total: item.product.price * item.quantity
    }))
  }))
);


