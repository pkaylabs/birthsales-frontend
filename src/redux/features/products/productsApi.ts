import { api } from "@/app/api/auth";
import { Product } from "@/redux/type";

export interface ProductImage {
  id?: number | string;
  image_id?: number | string;
  pk?: number | string;
  image?: string;
  url?: string;
}

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Authenticated vendor/admin route
    getProducts: builder.query<Product[], void>({
      query: () => `products/`,
      providesTags: (result = []) =>
        result
          .map(({ id }) => ({ type: "Products" as const, id }))
          .concat([{ type: "Products", id: "LIST" }]),
    }),

    // Public/customer route (same response shape as /products/)
    getCustomerProducts: builder.query<Product[], void>({
      query: () => `customerproducts/`,
      providesTags: (result = []) =>
        result
          .map(({ id }) => ({ type: "Products" as const, id }))
          .concat([{ type: "Products", id: "LIST" }]),
    }),
    getProduct: builder.query<Product,  number >({
      query: (id) => `customerproducts/?query=${id}`,
      // providesTags: (result = []) =>
      //   result
      //     .map(({ id }) => ({ type: "Products" as const, id }))
      //     .concat([{ type: "Products", id: "LIST" }]),
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

    updateProduct: builder.mutation<Product, FormData>({
      query: (form) => ({
        url: `products/`,
        method: "PUT",
        body: form,
      }),
      invalidatesTags: ["Products"],
    }),

    addProductImages: builder.mutation<
      unknown,
      { productId: string | number; images: File[] }
    >({
      query: ({ productId, images }) => {
        const fd = new FormData();
        fd.append("product_id", String(productId));
        images.forEach((file) => {
          fd.append("images", file);
        });

        return {
          url: `products/${productId}/images/`,
          method: "POST",
          body: fd,
        };
      },
      invalidatesTags: ["Products"],
    }),

    getProductImages: builder.query<ProductImage[], string | number>({
      query: (productId) => `products/${productId}/images/`,
      transformResponse: (response: unknown): ProductImage[] => {
        if (Array.isArray(response)) return response as ProductImage[];
        if (response && typeof response === "object") {
          const obj = response as Record<string, unknown>;
          const images = obj["images"];
          if (Array.isArray(images)) return images as ProductImage[];
          const results = obj["results"];
          if (Array.isArray(results)) return results as ProductImage[];
        }
        return [];
      },
      providesTags: ["Products"],
    }),

    deleteProductImage: builder.mutation<
      unknown,
      { productId: string | number; imageId: string | number }
    >({
      query: ({ productId, imageId }) => ({
        url: `products/${productId}/images/${imageId}/`,
        method: "DELETE",
        body: {
          product_id: Number(productId),
          image_id: Number(imageId),
        },
      }),
      invalidatesTags: ["Products"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetCustomerProductsQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useGetProductQuery,
  useAddProductImagesMutation,
  useGetProductImagesQuery,
  useDeleteProductImageMutation,
} = productsApi;
