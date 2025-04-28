import {api} from '@/app/api/auth';
import type { Service } from '@/redux/type';

export interface ServiceDto {
  name: string;
  description: string;
  price: number | string;
  image?: string;
  category: string;
  provider: number; // vendor user ID
}

export const serviceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query<Service[], void>({
      query: () => 'services/',
      providesTags: (result = []) =>
        result.map(({ id }) => ({ type: 'Service' as const, id }))
          .concat([{ type: 'Service', id: 'LIST' }]),
    }),
    getService: builder.query<Service, number>({
      query: (id) => `services/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Service', id }],
    }),
    addService: builder.mutation<Service, ServiceDto>({
      query: (service) => ({ url: 'services/', method: 'POST', body: service }),
      invalidatesTags: [{ type: 'Service', id: 'LIST' }],
    }),
    updateService: builder.mutation<Service, Partial<Service> & Pick<Service, 'id'>>({
      query: ({ id, ...patch }) => ({ url: `services/${id}/`, method: 'PATCH', body: patch }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Service', id }],
    }),
    deleteService: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({ url: `services/${id}/`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Service', id }],
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
} = serviceApi;