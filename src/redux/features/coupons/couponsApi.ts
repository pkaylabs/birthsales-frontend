import { api } from "@/app/api/auth";

export type PublishingCreditType = "PRODUCT" | "SERVICE" | "BOTH";
export type DiscountType = "PERCENTAGE" | "FIXED";

export interface PublishingCreditCoupon {
  id: number;
  code: string;
  credit_type: PublishingCreditType;
  product_credits: number;
  service_credits: number;
  max_redemptions: number;
  times_redeemed: number;
  expires_at?: string | null;
  is_active: boolean;
  redeemable: boolean;
  expired: boolean;
}

export interface CustomerCoupon {
  id: number;
  code: string;
  vendor: number;
  vendor_name: string;
  discount_type: DiscountType;
  discount_value: string;
  minimum_order_amount: string;
  max_redemptions: number;
  per_customer_limit: number;
  times_redeemed: number;
  expires_at?: string | null;
  is_active: boolean;
  redeemable: boolean;
  expired: boolean;
}

export interface CouponResponse<T> {
  message: string;
  coupon: T;
}

export interface RedeemPublishingCreditResponse {
  message: string;
  redemption: {
    id: number;
    coupon_code: string;
    vendor_name: string;
    product_credits: number;
    service_credits: number;
    redeemed_at: string;
  };
}

export interface ValidateCustomerCouponRequest {
  code: string;
  items: Array<{ product: number; quantity: number }>;
}

export interface ValidateCustomerCouponResponse {
  message: string;
  coupon: CustomerCoupon;
  eligible_subtotal: string;
  discount_amount: string;
}

export const couponsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPublishingCreditCoupons: builder.query<PublishingCreditCoupon[], void>({
      query: () => "publishingcreditcoupons/",
      providesTags: [{ type: "Coupons", id: "PUBLISHING" }],
    }),
    createPublishingCreditCoupon: builder.mutation<
      CouponResponse<PublishingCreditCoupon>,
      Partial<PublishingCreditCoupon>
    >({
      query: (body) => ({
        url: "publishingcreditcoupons/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Coupons", id: "PUBLISHING" }],
    }),
    updatePublishingCreditCoupon: builder.mutation<
      CouponResponse<PublishingCreditCoupon>,
      Partial<PublishingCreditCoupon> & { coupon_id: number }
    >({
      query: (body) => ({
        url: "publishingcreditcoupons/",
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Coupons", id: "PUBLISHING" }],
    }),
    deletePublishingCreditCoupon: builder.mutation<{ message: string }, number>({
      query: (coupon_id) => ({
        url: "publishingcreditcoupons/",
        method: "DELETE",
        body: { coupon_id },
      }),
      invalidatesTags: [{ type: "Coupons", id: "PUBLISHING" }],
    }),
    redeemPublishingCreditCoupon: builder.mutation<
      RedeemPublishingCreditResponse,
      { code: string }
    >({
      query: (body) => ({
        url: "redeempublishingcreditcoupon/",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Coupons", id: "PUBLISHING" },
        { type: "Products", id: "LIST" },
        "Service",
      ],
    }),
    getCustomerCoupons: builder.query<CustomerCoupon[], void>({
      query: () => "customercoupons/",
      providesTags: [{ type: "Coupons", id: "CUSTOMER" }],
    }),
    createCustomerCoupon: builder.mutation<
      CouponResponse<CustomerCoupon>,
      Partial<CustomerCoupon>
    >({
      query: (body) => ({
        url: "customercoupons/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Coupons", id: "CUSTOMER" }],
    }),
    updateCustomerCoupon: builder.mutation<
      CouponResponse<CustomerCoupon>,
      Partial<CustomerCoupon> & { coupon_id: number }
    >({
      query: (body) => ({
        url: "customercoupons/",
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Coupons", id: "CUSTOMER" }],
    }),
    deleteCustomerCoupon: builder.mutation<{ message: string }, number>({
      query: (coupon_id) => ({
        url: "customercoupons/",
        method: "DELETE",
        body: { coupon_id },
      }),
      invalidatesTags: [{ type: "Coupons", id: "CUSTOMER" }],
    }),
    validateCustomerCoupon: builder.mutation<
      ValidateCustomerCouponResponse,
      ValidateCustomerCouponRequest
    >({
      query: (body) => ({
        url: "validatecustomercoupon/",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPublishingCreditCouponsQuery,
  useCreatePublishingCreditCouponMutation,
  useUpdatePublishingCreditCouponMutation,
  useDeletePublishingCreditCouponMutation,
  useRedeemPublishingCreditCouponMutation,
  useGetCustomerCouponsQuery,
  useCreateCustomerCouponMutation,
  useUpdateCustomerCouponMutation,
  useDeleteCustomerCouponMutation,
  useValidateCustomerCouponMutation,
} = couponsApi;
