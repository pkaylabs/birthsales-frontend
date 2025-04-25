import { api } from "@/app/api/auth";

import type { Plan } from "@/redux/type";

export const plansApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query<Plan[], void>({ query: () => "subscriptionpackage/" }),
  }),
});

export const { useGetPlansQuery } = plansApi;
