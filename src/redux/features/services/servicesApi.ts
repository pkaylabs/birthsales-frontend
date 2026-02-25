import { api } from "@/app/api/auth";
import type { Service } from "@/redux/type";

export interface ServiceImage {
  id?: number | string;
  image_id?: number | string;
  pk?: number | string;
  image?: string;
  url?: string;
}

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
    addService: builder.mutation<Service, FormData>({
      query: (formData) => ({
        url: "services/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Service", id: "LIST" }],
    }),

    updateService: builder.mutation<Service, FormData>({
      query: (formData) => ({
        url: "services/",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Service"],
    }),

    addServiceImages: builder.mutation<
      unknown,
      { serviceId: string | number; images: File[] }
    >({
      query: ({ serviceId, images }) => {
        const fd = new FormData();
        fd.append("service_id", String(serviceId));
        images.forEach((file) => {
          fd.append("images", file);
        });

        return {
          url: `services/${serviceId}/images/`,
          method: "POST",
          body: fd,
        };
      },
      invalidatesTags: ["Service"],
    }),

    getServiceImages: builder.query<ServiceImage[], string | number>({
      query: (serviceId) => `services/${serviceId}/images/`,
      transformResponse: (response: unknown): ServiceImage[] => {
        if (Array.isArray(response)) return response as ServiceImage[];
        if (response && typeof response === "object") {
          const obj = response as Record<string, unknown>;
          const images = obj["images"];
          if (Array.isArray(images)) return images as ServiceImage[];
          const results = obj["results"];
          if (Array.isArray(results)) return results as ServiceImage[];
        }
        return [];
      },
      providesTags: ["Service"],
    }),

    deleteServiceImage: builder.mutation<
      unknown,
      { serviceId: string | number; imageId: string | number }
    >({
      query: ({ serviceId, imageId }) => ({
        url: `services/${serviceId}/images/${imageId}/`,
        method: "DELETE",
        body: {
          service_id: Number(serviceId),
          image_id: Number(imageId),
        },
      }),
      invalidatesTags: ["Service"],
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
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useBookServiceMutation,
  useGetCustomerServicesQuery,
  useGetCustomerServiceQuery,
  usePublishServiceMutation,
  useAddServiceImagesMutation,
  useGetServiceImagesQuery,
  useDeleteServiceImageMutation,
} = serviceApi;
