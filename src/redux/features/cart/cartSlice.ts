// src/redux/features/cart/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/redux/type";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(
      state,
      action: PayloadAction<{ product: Product; quantity?: number }>
    ) {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (i) => Number(i.product.id) !== action.payload
      );
    },
    updateQuantity(
      state,
      action: PayloadAction<{ productId: number; quantity: number }>
    ) {
      const idx = state.items.findIndex(
        (i) => Number(i.product.id) === action.payload.productId
      );
      if (idx >= 0) {
        state.items[idx].quantity = action.payload.quantity;
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
