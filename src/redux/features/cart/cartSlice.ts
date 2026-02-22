// src/redux/features/cart/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/redux/type";

export interface CartItem {
  key: string;
  product: Product;
  quantity: number;
  color?: string;
  size?: string;
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
      action: PayloadAction<{
        product: Product;
        quantity?: number;
        color?: string;
        size?: string;
      }>
    ) {
      const { product, quantity = 1, color, size } = action.payload;
      const key = `${Number(product.id)}|${color ?? ""}|${size ?? ""}`;
      const existing = state.items.find((i) => i.key === key);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ key, product, quantity, color, size });
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.key !== action.payload);
    },
    updateQuantity(
      state,
      action: PayloadAction<{ key: string; quantity: number }>
    ) {
      const idx = state.items.findIndex((i) => i.key === action.payload.key);
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
