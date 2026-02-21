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
  location: string;
  customer_phone: string;
}

export interface OrderResponse {
  message: string;
  data: Order | Order[];
}

interface TransType {
  status: string;
}

export interface PaymentResponse {
  message: string;
  status: string;
  transaction: null | TransType;
}

export interface PaystackInitSuccessResponse {
  status: "initialized";
  authorization_url: string;
  reference: string;
  transaction: unknown;
  api_status: number;
}

export interface PaystackInitFailedResponse {
  status: "failed";
  message: string;
  api_status: number;
}

export type PaystackInitResponse =
  | PaystackInitSuccessResponse
  | PaystackInitFailedResponse;

export interface PaystackStatusRequest {
  reference: string;
}

export interface PaystackStatusResponse {
  status: string;
  message?: string;
  reference?: string;
  transaction?: unknown;
  api_status?: number;
}

export interface PaymentRequest {
  subscription?: number;
  order?: number;
  booking?: number;
  network: string;
  phone: string;
}

export type PaystackInitRequest =
  | { subscription: number; order?: never; booking?: never }
  | { order: number; subscription?: never; booking?: never }
  | { booking: number; subscription?: never; order?: never };

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

    paystackInitializePayment: builder.mutation<PaystackInitResponse, PaystackInitRequest>(
      {
        query: (body) => ({
          url: `makepayment/paystack/`,
          method: "POST",
          body,
        }),
      }
    ),

    paystackCheckStatus: builder.mutation<PaystackStatusResponse, PaystackStatusRequest>(
      {
        query: ({ reference }) => ({
          url: `paystack/status/?reference=${encodeURIComponent(reference)}`,
          method: "GET",
        }),
      }
    ),
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
  usePaystackInitializePaymentMutation,
  usePaystackCheckStatusMutation,
  useCashoutMutation,
} = ordersApi;
