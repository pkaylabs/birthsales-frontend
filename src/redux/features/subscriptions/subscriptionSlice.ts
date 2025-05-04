import { api } from "@/app/api/auth";

import type { Subscriptions } from "@/redux/type";

export const subscriptionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptions: builder.query<Subscriptions[], void>({
      query: () => `subscriptions/`,
    //   transformResponse: (response: Subscriptions[]) =>
    //     response.map((item) => ({
    //       id: item.id,
    //       vendorName: item.vendor_name,
    //       packageName: item.package_name,
    //       status: item.expired ? "expired" : "active",
    //       paymentStatus: item.payment_status,
    //       vendor: item.vendor,
    //       package: item.package,
    //     })),
    }),
    // overrideExisting: false,
  }),
});

export const { useGetSubscriptionsQuery } = subscriptionsApi;
