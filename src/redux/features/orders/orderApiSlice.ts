import { api } from "@/app/api/auth";
import type { Order } from "@/redux/type";

export interface CashoutRequest {
  amount: number;
  phone: string;
  network: string;
}

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

interface TransType {
  status: string;
}

export interface PaymentResponse {
  message: string;
  status: string;
  transaction: null | TransType;
}

export interface PaymentRequest {
  subscription?: number;
  order?: number;
  booking?: number;
  network: string;
  phone: string;
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
    mobilePayment: builder.mutation<PaymentResponse, PaymentRequest>({
      query: (body) => ({
        url: `makepayment/`,
        method: "POST",
        body,
      }),
    }),
    cashout: builder.mutation<
      { status: string; transaction: TransType },
      CashoutRequest
    >({
      query: (body) => ({
        url: `cashout/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Dashboard", id: "STATUS" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrdersQuery,
  usePlaceOrderMutation,
  useMobilePaymentMutation,
  useCashoutMutation,
} = ordersApi;
