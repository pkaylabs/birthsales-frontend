import { api } from "@/app/api/auth";
import type { Business } from "@/redux/type";

interface CreateBusinessDto {

  vendor_name: string;
  vendor_email: string;
  vendor_address: string;
  vendor_phone: string;
}
interface SubscribeDto {
  package: string;
}

export const businessApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createBusiness: builder.mutation<Business, CreateBusinessDto>({
      query: (biz) => ({ url: "vendorprofile/", method: "POST", body: biz }),
    }),
    subscribePlan: builder.mutation<{ message: string }, SubscribeDto>({
      query: (sub) => ({ url: "subscriptions/", method: "POST", body: sub }),
    }),
  }),
});

export const { useCreateBusinessMutation, useSubscribePlanMutation } =
  businessApi;
