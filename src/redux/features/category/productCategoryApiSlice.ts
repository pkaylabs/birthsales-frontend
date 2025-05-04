import { api } from "@/app/api/auth";
import { Category, CategoryForm } from "@/redux/type";

interface CategoryDTO {
  id: number | string;
  name: string;
  description: string;
  image?: string;
}

export const productCategoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => `productcategory/`,
      providesTags: (result = []) =>
        result
          .map(({ id }) => ({ type: "Category" as const, id }))
          .concat([{ type: "Category", id: "LIST" }]),
    }),
    addCategory: builder.mutation<Category, CategoryForm>({
      query: (newCategory) => ({
        url: `productcategory/`,
        method: "POST",
        body: {
          name: newCategory.name,
          description: newCategory.description,
          image: newCategory?.imageFile,
        },
      }),
      transformResponse: (response: CategoryDTO) => ({
        id: response.id,
        name: response.name,
        description: response.description,
        image: response?.image ?? "",
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    deleteCategory: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `productcategory/`,
        body: { category_id: Number(id) },
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Category", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
} = productCategoryApi;
