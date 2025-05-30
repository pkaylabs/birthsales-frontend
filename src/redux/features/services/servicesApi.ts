import { api } from "@/app/api/auth";
import type { Service } from "@/redux/type";

export interface ServiceDto {
  id?: number | string;
  name: string;
  description: string;
  price: number;
  image?: string;
  // category: string;
  vendor_id: string; // vendor ID
  bookings?: number;
}

interface BookServiceRequest {
  service: number;
  date: string;
  time: string;
  location: string;
}

interface BookServiceResponse {
  created_at: string;
  date: string;
  id: number;
  service: number;
  service_name: string;
  status: string;
  time: string;
  updated_at: string;
  user: number;
  user_name: string;
  vendor_name: string;
}

export const serviceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query<Service[], void>({
      query: () => "services/",
      providesTags: (result = []) =>
        result
          .map(({ id }) => ({ type: "Service" as const, id }))
          .concat([{ type: "Service", id: "LIST" }]),
    }),
    getCustomerServices: builder.query<Service[], void>({
      query: () => "customerservices/",
      providesTags: (result = []) =>
        result
          .map(({ id }) => ({ type: "Service" as const, id }))
          .concat([{ type: "Service", id: "LIST" }]),
    }),
    getCustomerService: builder.query<Service, number>({
      query: (id) => `customerservices/?query=${id}`,
      // providesTags: (result = []) =>
      //   result
      //     .map(({ id }) => ({ type: "Services" as const, id }))
      //     .concat([{ type: "Services", id: "LIST" }]),
    }),
    getService: builder.query<Service, number>({
      query: (id) => `services/${id}/`,
      providesTags: (result, error, id) => [{ type: "Service", id }],
    }),
    addService: builder.mutation<Service, ServiceDto>({
      query: (service) => ({ url: "services/", method: "POST", body: service }),
      invalidatesTags: [{ type: "Service", id: "LIST" }],
    }),
    publishService: builder.mutation<
      { message: string; service: Service },
      number
    >({
      query: (id) => ({
        url: `services/`,
        method: "PUT",
        body: { service_id: Number(id) },
      }),
      invalidatesTags: (result, error, id) => [{ type: "Service", id }],
    }),
    deleteService: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `services/`,
        body: { service: Number(id) },
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Service", id }],
    }),
    bookService: builder.mutation<
      { message: string; data: BookServiceResponse },
      BookServiceRequest
    >({
      query: (body) => ({
        url: `bookings/`,
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetServicesQuery,
  useGetServiceQuery,
  useAddServiceMutation,
  useDeleteServiceMutation,
  useBookServiceMutation,
  useGetCustomerServicesQuery,
  useGetCustomerServiceQuery,
  usePublishServiceMutation
} = serviceApi;
