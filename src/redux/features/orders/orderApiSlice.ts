import { api } from "@/app/api/auth";
import type { Order } from "@/redux/type";

export interface NewOrderItem {
  product: number;
  quantity: number;
}
export interface PlaceOrderRequest {
  items: NewOrderItem[];
}

export interface OrderResponse {
  message: string;
  data: Order;
}

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => ({
        url: `orders/`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Orders" as const, id })),
              { type: "Orders", id: "LIST" },
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),
    placeOrder: builder.mutation<OrderResponse, PlaceOrderRequest>({
      query: (body) => ({
        url: `placeorder/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetOrdersQuery, usePlaceOrderMutation } =
  ordersApi;
