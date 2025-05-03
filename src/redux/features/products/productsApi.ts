import { api } from "@/app/api/auth";
import { Product } from "@/redux/type";

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => `products/`,
      providesTags: (result = []) =>
        result
          .map(({ id }) => ({ type: "Products" as const, id }))
          .concat([{ type: "Products", id: "LIST" }]),
    }),
    addProduct: builder.mutation<Product, FormData>({
      query: (formData) => ({
        url: `products/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    deleteProduct: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `products/`,
        body: { product_id: Number(id) },
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    updateProduct: builder.mutation<Product,  FormData>({
      query: (form) => ({
        url: `products/`,
        method: "PUT",
        body: form,
      }),
      invalidatesTags: ['Products'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} = productsApi;
