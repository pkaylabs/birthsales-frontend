import { api } from "@/app/api/auth";

export interface BannerRequest {
  title: string;
  link: string;
  is_active: boolean;
  image: File | null;
  imagePreview?: string;
}

export interface Banner {
  id: number;
  title: string;
  image: File | string;
  link: string;
  is_active: boolean;
  imagePreview?: string;
}

export const bannersApi = api.injectEndpoints({
  endpoints: (b) => ({
    getBanners: b.query<Banner[], void>({
      query: () => `banners/`,
      providesTags: (result = []) => [
        ...result.map((b) => ({ type: "Banner" as const, id: b.id })),
        { type: "Banner" as const, id: "LIST" },
      ],
    }),
    addBanner: b.mutation<{ message: string; banner: Banner }, FormData>({
      query: (formData) => ({
        url: `banners/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Banner", id: "LIST" }],
    }),
    updateBanner: b.mutation<{ message: string; banner: Banner }, FormData>({
      query: (formData) => ({
        url: `banners/`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: [{ type: "Banner", id: "LIST" }],
    }),
    deleteBanner: b.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `banners/`,
        method: "DELETE",
        body: { banner: id },
      }),
      invalidatesTags: [{ type: "Banner", id: "LIST" }],
    }),
  }),
});

export const {
  useGetBannersQuery,
  useAddBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannersApi;
