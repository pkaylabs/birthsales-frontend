import { api } from "@/app/api/auth";
import type { DeliveryFee } from "@/redux/type";

export interface DeliveryFeeCreateRequest {
  location: number;
  price: string;
}

export interface DeliveryFeeUpdateRequest {
  id: number;
  price: string;
}

export const deliveryFeesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDeliveryFees: builder.query<DeliveryFee[], void>({
      query: () => `deliveryfees/`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "DeliveryFees" as const, id })),
              { type: "DeliveryFees" as const, id: "LIST" },
            ]
          : [{ type: "DeliveryFees" as const, id: "LIST" }],
    }),

    addDeliveryFee: builder.mutation<DeliveryFee, DeliveryFeeCreateRequest>({
      query: (body) => ({
        url: `deliveryfees/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "DeliveryFees", id: "LIST" }],
    }),

    updateDeliveryFee: builder.mutation<DeliveryFee, DeliveryFeeUpdateRequest>({
      query: (body) => ({
        url: `deliveryfees/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "DeliveryFees", id },
        { type: "DeliveryFees", id: "LIST" },
      ],
    }),

    deleteDeliveryFee: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `deliveryfees/`,
        method: "DELETE",
        body: { id: Number(id) },
      }),
      invalidatesTags: (result, error, id) => [
        { type: "DeliveryFees", id },
        { type: "DeliveryFees", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDeliveryFeesQuery,
  useAddDeliveryFeeMutation,
  useUpdateDeliveryFeeMutation,
  useDeleteDeliveryFeeMutation,
} = deliveryFeesApi;
