import { api } from "@/app/api/auth";

import type { Plan } from "@/redux/type";

interface SubscriptionPackageDTO {
  id: number;
  package_name: string;
  package_description: string;
  package_price: string;
}

export const plansApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query<Plan[], void>({
      query: () => `subscriptionpackage/`,
      transformResponse: (response: SubscriptionPackageDTO[]) =>
        response.map((item) => ({
          id: item.id.toString(),
          name: item.package_name,
          price: item.package_price,
          // default since backend has no interval
          interval: "month",
          description: item.package_description,
        })),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Plan" as const, id })),
              { type: "Plan" as const, id: "LIST" },
            ]
          : [{ type: "Plan" as const, id: "LIST" }],
    }),

    addPlan: builder.mutation<Plan, Omit<Plan, "id">>({
      query: (newPlan) => ({
        url: `subscriptionpackage/`,
        method: "POST",
        body: {
          package_name: newPlan.name,
          package_description: newPlan.description,
          package_price: Number(newPlan.price),
        },
      }),
      transformResponse: (response: SubscriptionPackageDTO) => ({
        id: response.id.toString(),
        name: response.package_name,
        price: response.package_price.toString(),
        interval: "month",
        description: response.package_description,
      }),
      invalidatesTags: [{ type: "Plan", id: "LIST" }],
    }),

    updatePlan: builder.mutation<Plan, Partial<Plan> & Pick<Plan, "id">>({
      query: ({ id, name, price, description }) => ({
        url: `subscriptionpackage/${id}/`,
        method: "PUT",
        body: {
          package_name: name,
          package_description: description,
          package_price: Number(price),
        },
      }),
      transformResponse: (response: SubscriptionPackageDTO) => ({
        id: response.id.toString(),
        name: response.package_name,
        price: response.package_price.toString(),
        interval: "month",
        description: response.package_description,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Plan", id },
        { type: "Plan", id: "LIST" },
      ],
    }),

    deletePlan: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `subscriptionpackage/`,
        method: "DELETE",
        body: {
          package: Number(id),
        },
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Plan", id },
        { type: "Plan", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPlansQuery,
  useAddPlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = plansApi;
