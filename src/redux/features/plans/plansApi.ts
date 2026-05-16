import { api } from "@/app/api/auth";

import type { Plan } from "@/redux/type";

interface SubscriptionPackageDTO {
  id: number;
  package_name: string;
  package_description: string;
  package_price: string;
  can_create_product: boolean;
  can_create_service: boolean;
  max_products?: number | null;
  max_services?: number | null;
}

const clampPositiveInt = (value: unknown, fallback: number) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.trunc(n));
};

const dtoToPlan = (dto: SubscriptionPackageDTO): Plan => ({
  id: dto.id.toString(),
  name: dto.package_name,
  price: dto.package_price.toString(),
  // default since backend has no interval
  interval: "month",
  description: dto.package_description,
  can_create_product: dto.can_create_product,
  can_create_service: dto.can_create_service,
  max_products:
    typeof dto.max_products === "number" && Number.isFinite(dto.max_products)
      ? Math.max(1, Math.trunc(dto.max_products))
      : 5,
  max_services:
    typeof dto.max_services === "number" && Number.isFinite(dto.max_services)
      ? Math.max(1, Math.trunc(dto.max_services))
      : 5,
});

export const plansApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query<Plan[], void>({
      query: () => `subscriptionpackage/`,
      transformResponse: (response: SubscriptionPackageDTO[]) => response.map(dtoToPlan),
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
          can_create_product: newPlan.can_create_product,
          can_create_service: newPlan.can_create_service,
          max_products: clampPositiveInt(newPlan.max_products ?? 5, 5),
          max_services: clampPositiveInt(newPlan.max_services ?? 5, 5),
        },
      }),
      transformResponse: (response: SubscriptionPackageDTO) => dtoToPlan(response),
      invalidatesTags: [{ type: "Plan", id: "LIST" }],
    }),

    updatePlan: builder.mutation<Plan, Plan>({
      query: (plan) => ({
        url: `subscriptionpackage/`,
        method: "PUT",
        responseHandler: (response) => response.text(),
        body: {
          package: Number(plan.id),
          package_name: plan.name,
          package_description: plan.description,
          package_price: Number(plan.price),
          can_create_product: plan.can_create_product,
          can_create_service: plan.can_create_service,
          max_products: clampPositiveInt(plan.max_products ?? 5, 5),
          max_services: clampPositiveInt(plan.max_services ?? 5, 5),
        },
      }),
      transformResponse: (response: unknown, meta, arg) => {
        let parsed: unknown = response;

        if (typeof response === "string") {
          try {
            parsed = JSON.parse(response);
          } catch {
            parsed = null;
          }
        }

        if (
          parsed &&
          typeof parsed === "object" &&
          "id" in parsed &&
          typeof (parsed as any).id === "number"
        ) {
          return dtoToPlan(parsed as SubscriptionPackageDTO);
        }

        // Some backends return a simple success message on PUT (still HTTP 200).
        // In that case, treat it as success and rely on invalidation/refetch.
        return {
          ...arg,
          interval: arg.interval || "month",
          max_products: clampPositiveInt(arg.max_products ?? 5, 5),
          max_services: clampPositiveInt(arg.max_services ?? 5, 5),
        };
      },
      invalidatesTags: (result, error, arg) => [
        { type: "Plan", id: arg.id },
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
