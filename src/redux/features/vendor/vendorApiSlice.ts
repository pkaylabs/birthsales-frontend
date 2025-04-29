import { api } from "@/app/api/auth";
import type { Vendor, VendorForm } from "@/redux/type";

interface VendorDTO {
  id: number;
  user: number;
  vendor_name: string;
  vendor_email: string;
  vendor_address: string;
  vendor_phone: string;
}

export const vendorsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getVendors: builder.query<Vendor[], void>({
      query: () => `vendors/`,
      transformResponse: (response: VendorDTO[]) =>
        response.map((v) => ({
          id: v.id,
          user: v.user,
          name: v.vendor_name,
          email: v.vendor_email,
          address: v.vendor_address,
          phone: v.vendor_phone,
        })),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Vendor" as const, id })),
              { type: "Vendor" as const, id: "LIST" },
            ]
          : [{ type: "Vendor" as const, id: "LIST" }],
    }),
    addVendor: builder.mutation<Vendor, VendorForm>({
      query: (newVendor) => ({
        url: `vendors/`,
        method: "POST",
        body: newVendor,
      }),
      transformResponse: (response: VendorDTO) => ({
        id: response.id,
        user: response.user,
        name: response.vendor_name,
        email: response.vendor_email,
        address: response.vendor_address,
        phone: response.vendor_phone,
      }),
      invalidatesTags: [{ type: "Vendor", id: "LIST" }],
    }),
    updateVendor: builder.mutation<Vendor, VendorForm & Pick<Vendor, "id">>({
      query: ({ id, ...patch }) => ({
        url: `vendors/${id}/`,
        method: "PUT",
        body: patch,
      }),
      transformResponse: (response: VendorDTO) => ({
        id: response.id,
        user: response.user,
        name: response.vendor_name,
        email: response.vendor_email,
        address: response.vendor_address,
        phone: response.vendor_phone,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Vendor", id },
        { type: "Vendor", id: "LIST" },
      ],
    }),
    deleteVendor: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `vendors/`,
        method: "DELETE",
        body: { vendor_id: Number(id) },
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Vendor", id },
        { type: "Vendor", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetVendorsQuery,
  useAddVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} = vendorsApi;
