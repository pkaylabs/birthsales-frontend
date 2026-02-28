import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { logout } from "@/redux/features/auth/authSlice";
import { BACKEND_BASE_URL } from "@/constants";

const baseQuery = fetchBaseQuery({
  baseUrl: BACKEND_BASE_URL,
  prepareHeaders: (headers, { getState, endpoint }) => {
    if (endpoint === "getHomePageData") return headers;
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("Authorization", `Token ${token}`);
    return headers;
  },
});

const baseQueryWithReauth: typeof baseQuery = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && "status" in result.error && result.error.status === 401) {
    // token no longer valid, clear out auth
    api.dispatch(logout());
    // redirect to login page
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Service",
    "Vendor",
    "Payouts",
    "Products",
    "Locations",
    "DeliveryFees",
    "ServiceFees",
    "VideoAds",
    "Category",
    "Plan",
    "User",
    "Booking",
    "Dashboard",
    "HomePage",
    "Orders",
    "Search",
    "Banner",
    "Subscription",
    "Payments"
  ],
  endpoints: () => ({}),
});
