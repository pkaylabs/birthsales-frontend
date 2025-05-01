/* eslint-disable @typescript-eslint/no-explicit-any */
import { Middleware } from "@reduxjs/toolkit";
import { logout } from "../../redux/features/auth/authSlice";
import { persistStore } from "redux-persist";
import { store } from "../store";

export const logoutMiddleware: Middleware = () => (next) => (action: any) => {
  if (action.type === logout.type) {
    const persistor = persistStore(store);
    persistor.purge(); // Clear persisted state
  }
  return next(action);
};