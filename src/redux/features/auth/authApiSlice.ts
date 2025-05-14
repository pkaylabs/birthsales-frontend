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

interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_password: string;
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
    changePassword: builder.mutation<{ status: string }, ChangePasswordRequest>(
      {
        query: (body) => ({
          url: "changepassword/",
          method: "POST",
          body,
        }),
      }
    ),
    getOtp: builder.mutation<{ message: string }, { phone: string }>({
      query: ({ phone }) => ({
        url: `verifyotp/?phone=${phone}`,
        method: "GET",
      }),
    }),
    verifyOtp: builder.mutation<
      { message: string },
      { otp: string; phone: string }
    >({
      query: (body) => ({
        url: `verifyotp/`,
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<
      { message: string },
      { phone: string; new_password: string; confirm_password: string }
    >({
      query: (body) => ({
        url: `resetpassword/`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useChangePasswordMutation,
  useGetOtpMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} = authApiSlice;
