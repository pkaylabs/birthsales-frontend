import { api } from "@/app/api/auth";
import { PlaceOrderResponse } from "@/redux/type";

export interface PlaceOrderRequest {
    items: { product: number; quantity: number }[];
    payment_method: "mobile_money";
    mobile_number: string;
  }

export const orderApi = api.injectEndpoints({
    endpoints: (builder) => ({
      placeOrder: builder.mutation<PlaceOrderResponse, PlaceOrderRequest>({
        query: (body) => ({
          url: `placeorder/`,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Orders"],
      }),
    }),
  });

  export const { usePlaceOrderMutation } = orderApi;