import { api } from "@/app/api/auth";
import type { Product } from "@/redux/type";

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({ query: () => "products" }),
    addProduct: builder.mutation<Product, Partial<Product>>({
      query: (product) => ({ url: "products", method: "POST", body: product }),
    }),
  }),
});

export const { useGetProductsQuery, useAddProductMutation } = productsApi;
