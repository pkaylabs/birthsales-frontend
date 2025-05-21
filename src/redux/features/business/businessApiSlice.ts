import { api } from "@/app/api/auth";
import type { Business } from "@/redux/type";

interface CreateBusinessDto {
  vendor_name: string;
  vendor_email: string;
  vendor_address: string;
  vendor_phone: string;
}

interface SubscriptionResponse {
  id: number;
  vendor_name: string;
  package_name: string;
  expired: boolean;
  payment_status: string | null;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  vendor: number;
  package: number;
}

interface SubscribeDto {
  package: string;
}

export const businessApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createBusiness: builder.mutation<Business, CreateBusinessDto>({
      query: (biz) => ({ url: "vendorprofile/", method: "PUT", body: biz }),
    }),
    subscribePlan: builder.mutation<SubscriptionResponse, SubscribeDto>({
      query: (sub) => ({ url: "subscriptions/", method: "POST", body: sub }),
    }),
  }),
});

export const { useCreateBusinessMutation, useSubscribePlanMutation } =
  businessApi;
