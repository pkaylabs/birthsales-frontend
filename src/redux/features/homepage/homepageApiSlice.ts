import { api } from "@/app/api/auth";
import { HomePageData } from "@/redux/type";

export const homeApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getHomePageData: builder.query<HomePageData, void>({
      query: () => ({
        url: "homepage/",
      }),
      providesTags: [{ type: "HomePage", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetHomePageDataQuery } = homeApiSlice;
