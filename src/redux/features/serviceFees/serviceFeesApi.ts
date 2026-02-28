import { api } from "@/app/api/auth";
import type { ServiceFee } from "@/redux/type";

export type ServiceFeeType = "PERCENTAGE" | "FLAT";

export interface ServiceFeeCreateRequest {
  fee_type: ServiceFeeType;
  value: string;
  is_active: boolean;
}

export interface ServiceFeeUpdateRequest extends ServiceFeeCreateRequest {
  id: number;
}

export interface ServiceFeePatchRequest {
  id: number;
  fee_type?: ServiceFeeType;
  value?: string;
  is_active?: boolean;
}

export const serviceFeesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getServiceFees: builder.query<ServiceFee[], void>({
      query: () => `servicefees/`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "ServiceFees" as const, id })),
              { type: "ServiceFees" as const, id: "LIST" },
            ]
          : [{ type: "ServiceFees" as const, id: "LIST" }],
    }),

    addServiceFee: builder.mutation<ServiceFee, ServiceFeeCreateRequest>({
      query: (body) => ({
        url: `servicefees/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ServiceFees", id: "LIST" }],
    }),

    updateServiceFee: builder.mutation<ServiceFee, ServiceFeeUpdateRequest>({
      query: (body) => ({
        url: `servicefees/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ServiceFees", id },
        { type: "ServiceFees", id: "LIST" },
      ],
    }),

    patchServiceFee: builder.mutation<ServiceFee, ServiceFeePatchRequest>({
      query: (body) => ({
        url: `servicefees/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ServiceFees", id },
        { type: "ServiceFees", id: "LIST" },
      ],
    }),

    deleteServiceFee: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `servicefees/`,
        method: "DELETE",
        body: { id: Number(id) },
      }),
      invalidatesTags: (result, error, id) => [
        { type: "ServiceFees", id },
        { type: "ServiceFees", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetServiceFeesQuery,
  useAddServiceFeeMutation,
  useUpdateServiceFeeMutation,
  usePatchServiceFeeMutation,
  useDeleteServiceFeeMutation,
} = serviceFeesApi;
