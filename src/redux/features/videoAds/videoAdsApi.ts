import { api } from "@/app/api/auth";
import type { VideoAd } from "@/redux/type";

export interface VideoAdCreateRequest {
  title: string;
  is_active: boolean;
  video: File;
}

export interface VideoAdUpdateRequest {
  id: number;
  title: string;
  is_active: boolean;
}

export const videoAdsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getVideoAds: builder.query<VideoAd[], void>({
      query: () => `videoads/`,
      transformResponse: (response: unknown) => {
        if (Array.isArray(response)) return response as VideoAd[];
        if (
          response &&
          typeof response === "object" &&
          "results" in response &&
          Array.isArray((response as any).results)
        ) {
          return (response as any).results as VideoAd[];
        }
        return [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "VideoAds" as const, id })),
              { type: "VideoAds" as const, id: "LIST" },
            ]
          : [{ type: "VideoAds" as const, id: "LIST" }],
    }),

    addVideoAd: builder.mutation<VideoAd, VideoAdCreateRequest>({
      query: (body) => {
        const formData = new FormData();
        formData.append("title", body.title);
        formData.append("is_active", String(body.is_active));
        formData.append("video", body.video);

        return {
          url: `videoads/`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "VideoAds", id: "LIST" }],
    }),

    updateVideoAd: builder.mutation<VideoAd, VideoAdUpdateRequest>({
      query: (body) => ({
        url: `videoads/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "VideoAds", id },
        { type: "VideoAds", id: "LIST" },
      ],
    }),

    deleteVideoAd: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `videoads/`,
        method: "DELETE",
        body: { id: Number(id) },
      }),
      invalidatesTags: (result, error, id) => [
        { type: "VideoAds", id },
        { type: "VideoAds", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetVideoAdsQuery,
  useAddVideoAdMutation,
  useUpdateVideoAdMutation,
  useDeleteVideoAdMutation,
} = videoAdsApi;
