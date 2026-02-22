import { api } from "@/app/api/auth";

export interface PaymentUserDetail {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  user_type?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export interface PaymentRecord {
  id: number;
  customer_name?: string;
  vendor_name?: string;
  what_was_paid_for?: string;
  reason?: string;
  payment_id: string;
  status: string;
  status_code?: string;
  payment_method: string;
  payment_type?: string;
  total_amount?: number;
  amount?: number | string;
  created_at: string;
  updated_at?: string;

  // Relations (nullable)
  user?: number;
  user_detail?: PaymentUserDetail;
  order?: number | null;
  booking?: number | null;
  subscription?: number | null;
  vendor?: number | null;

  // Flags
  vendor_credited_debited?: boolean;
  credited_debited_vendor?: boolean;
  subscription_effects_applied?: boolean;

  // Keep compatibility with backend changes
  [key: string]: unknown;
}

export const paymentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<PaymentRecord[], void>({
      query: () => ({
        url: "payments/",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((p) => ({ type: "Payments" as const, id: p.id })),
              { type: "Payments" as const, id: "LIST" },
            ]
          : [{ type: "Payments" as const, id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetPaymentsQuery } = paymentsApi;
