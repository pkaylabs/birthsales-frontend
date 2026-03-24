import { api } from "@/app/api/auth";

export interface RefundRecord {
  id: number;
  reference?: string;
  payment_id?: string;
  amount?: string | number;
  phone?: string;
  provider_code?: string;
  currency?: string;
  status?: string;
  status_code?: string;
  refunded_by_name?: string;
  refunded_date?: string;
  created_at?: string;

  // keep compatibility with backend changes
  [key: string]: unknown;
}

export interface CreateRefundRequest {
  payment_id: string;
  phone: string;
  provider_code: string;
  recipient_type: "mobile_money";
  currency: string;
  reason: string;
}

export const refundsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRefunds: builder.query<RefundRecord[], void>({
      query: () => ({
        url: "refunduser/",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((r) => ({ type: "Refunds" as const, id: r.id })),
              { type: "Refunds" as const, id: "LIST" },
            ]
          : [{ type: "Refunds" as const, id: "LIST" }],
    }),

    createRefund: builder.mutation<unknown, CreateRefundRequest>({
      query: (body) => ({
        url: "refunduser/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Refunds", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetRefundsQuery, useCreateRefundMutation } = refundsApi;
