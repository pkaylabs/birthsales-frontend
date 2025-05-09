import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/redux/type";

interface WishlistItem {
  product: Product;
}

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<Product>) {
      const exists = state.items.find(
        (item) => item.product.id === action.payload.id
      );
      if (!exists) {
        state.items.push({ product: action.payload });
      }
    },
    removeFromWishlist(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => Number(item.product.id) !== action.payload
      );
    },
    clearWishlist(state) {
      state.items = [];
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
