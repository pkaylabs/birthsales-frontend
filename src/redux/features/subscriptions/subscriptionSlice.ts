import { api } from "@/app/api/auth";

import type { Subscriptions } from "@/redux/type";

interface Transaction {
  id: number;
  customer_name: string;
  what_was_paid_for: string;
  payment_id: string;
  amount: string;
  reason: string;
  payment_method: string;
  payment_type: string;
  status: string;
  vendor_credited_debited: boolean;
  order: null | number;
  booking: null | number;
  subscription: number;
  user: number;
  vendor: number;
}

export const subscriptionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptions: builder.query<Subscriptions[], void>({
      query: () => `subscriptions/`,
    }),
    renewSubscriptions: builder.mutation<
      {
        status: string;
        message: string;
        transaction: Transaction;
      },
      { subscription: number; network: string; phone: string }
    >({
      query: (body) => ({
        url: "renewsubscription/",
        method: "POST",
        body,
      }),
    }),
    // overrideExisting: false,
  }),
});

export const { useGetSubscriptionsQuery, useRenewSubscriptionsMutation } = subscriptionsApi;
