import { api } from "@/app/api/auth";
import { HomePageData, Product } from "@/redux/type";

export const homeApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getHomePageData: builder.query<HomePageData, void>({
      query: () => ({
        url: "homepage/",
      }),
      providesTags: [{ type: "HomePage", id: "LIST" }],
    }),
    searchProducts: builder.query<Product[], string>({
      query: (searchTerm) => ({
        url: `searchproducts/?query=${encodeURIComponent(searchTerm)}`,
      }),
      providesTags: [{ type: "Search", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetHomePageDataQuery, useSearchProductsQuery } = homeApiSlice;
