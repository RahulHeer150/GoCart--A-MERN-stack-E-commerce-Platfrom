/* eslint-disable no-unused-vars */
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/products/productSlice";
import cartReducer from "../features/cart/cartSlice";
import uiReducer from "../features/ui/uiSlice";

const loadGuestCart = () => {
  try {
    const localCart = localStorage.getItem("cartItems");
    return localCart ? JSON.parse(localCart) : [];
  } catch (error) {
    return [];
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    ui: uiReducer,
  },

  preloadedState: {
    cart: {
      items: loadGuestCart(),
      status: "idle",
    },
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

store.subscribe(() => {
  const state = store.getState();

  if (!state.auth.userData) {
    localStorage.setItem("cartItems", JSON.stringify(state.cart.items));
  }
});
