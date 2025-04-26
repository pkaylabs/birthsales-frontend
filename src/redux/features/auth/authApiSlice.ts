import { api } from "@/app/api/auth";

import type { User } from "@/redux/type";

interface AuthResponse {
  token: string;
  user: User;
}
export interface AuthCredentials {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  address?: string;
  user_type: "VENDOR" | "ADMIN" | "DELIVERY";
}

export const authApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      AuthResponse,
      Omit<AuthCredentials, "name" | "phone" | "address" | "user_type">
    >({
      query: (credentials) => ({
        url: "login/",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (res: AuthResponse) => ({
        user: res.user,
        token: res.token,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch({ type: "auth/setCredentials", payload: data });
      },
    }),
    register: builder.mutation<AuthResponse, AuthCredentials>({
      query: (userData) => ({
        url: "register/",
        method: "POST",
        body: userData,
      }),
      transformResponse: (res: AuthResponse) => ({
        user: res.user,
        token: res.token,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch({ type: "auth/setCredentials", payload: data });
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApiSlice;
