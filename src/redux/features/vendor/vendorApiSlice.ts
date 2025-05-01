import { api } from "@/app/api/auth";
import type { User, Vendor, VendorForm } from "@/redux/type";

interface VendorDTO {
  id: number;
  user: number;
  vendor_id: string;
  vendor_name: string;
  vendor_email: string;
  vendor_address: string;
  vendor_phone: string;
}

export interface VendorProfile {
  vendor_id: string;
  vendor_name: string;
  vendor_phone: string;
  vendor_email: string;
  vendor_address: string;
  user: number | null;
}

export interface UserProfileResponse {
  user: User;
  vendor: VendorProfile;
}

export const vendorsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getVendors: builder.query<Vendor[], void>({
      query: () => `vendors/`,
      transformResponse: (response: VendorDTO[]) =>
        response.map((v) => ({
          id: v.id,
          user: v.user,
          vendor_id: v.vendor_id,
          vendor_name: v.vendor_name,
          vendor_email: v.vendor_email,
          vendor_address: v.vendor_address,
          vendor_phone: v.vendor_phone,
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
        vendor_id: response.vendor_id,
        vendor_name: response.vendor_name,
        vendor_email: response.vendor_email,
        vendor_address: response.vendor_address,
        vendor_phone: response.vendor_phone,
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
        vendor_id: response.vendor_id,
        vendor_name: response.vendor_name,
        vendor_email: response.vendor_email,
        vendor_address: response.vendor_address,
        vendor_phone: response.vendor_phone,
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
    getVendorProfile: builder.query<UserProfileResponse, void>({
      query: () => ({ url: "vendorprofile/", method: "GET" }),
      transformResponse: (response: UserProfileResponse) => response,
      providesTags: (result) =>
        result
          ? [{ type: "Vendor" as const, id: result.vendor.vendor_id }]
          : [],
    }),
    updateVendorProfile: builder.mutation<
      UserProfileResponse,
      Partial<VendorProfile>
    >({
      query: (patch) => ({ url: "profile/", method: "PUT", body: patch }),
      invalidatesTags: [{ type: "Vendor", id: "PROFILE" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetVendorsQuery,
  useAddVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
  useGetVendorProfileQuery,
  useUpdateVendorProfileMutation,
} = vendorsApi;
