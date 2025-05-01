// Import the necessary modules from Redux Toolkit
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { BACKEND_BASE_URL } from "@/constants";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_BASE_URL, // Replace with your API base URL
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Token ${token}`);
      }
      return headers;
    },
  }),
  // Replace with your API base URL
  tagTypes: [
    "Service",
    "Vendor",
    "Product",
    "Plan",
    "User",
    "Booking",
    "Dashboard",
  ],
  endpoints: () => ({}),
});
