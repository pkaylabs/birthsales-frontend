import { api } from "@/app/api/auth";
import type { Payout } from "@/redux/type";

export type ApprovePayoutRequest = {
  payout_id: number;
  action: "approve";
};

export type BulkApprovePayoutsRequest = {
  vendor_id: string;
};

export const payoutsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPayouts: builder.query<Payout[], void>({
      query: () => `payouts/`,
      transformResponse: (response: unknown) => {
        if (Array.isArray(response)) return response as Payout[];
        if (
          response &&
          typeof response === "object" &&
          "results" in response &&
          Array.isArray((response as any).results)
        ) {
          return (response as any).results as Payout[];
        }
        return [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Payouts" as const, id })),
              { type: "Payouts" as const, id: "LIST" },
            ]
          : [{ type: "Payouts" as const, id: "LIST" }],
    }),

    approvePayout: builder.mutation<unknown, ApprovePayoutRequest>({
      query: (body) => ({
        url: `payouts/approve/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Payouts", id: "LIST" }],
    }),

    bulkApprovePayouts: builder.mutation<unknown, BulkApprovePayoutsRequest>({
      query: (body) => ({
        url: `payouts/approve-all/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Payouts", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPayoutsQuery,
  useApprovePayoutMutation,
  useBulkApprovePayoutsMutation,
} = payoutsApi;
