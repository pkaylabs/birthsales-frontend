import { api } from "@/app/api/auth";
import type { User, UserForm } from "@/redux/type";

interface UserDTO {
  id: number;
  email: string;
  phone: string;
  name: string;
  address: string | null;
  avatar: string | null;
  user_type: "ADMIN" | "VENDOR" | "DELIVERY";
  is_active: boolean;
  created_at: string;
}

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => `users/`,
      transformResponse: (response: UserDTO[]) =>
        response.map((u) => ({
          id: u.id,
          email: u.email,
          phone: u.phone,
          name: u.name,
          address: u.address || "",
          avatar: u.avatar || "",
          user_type: u.user_type,
          isActive: u.is_active,
          dateAdded: u.created_at,
        })),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User" as const, id: "LIST" },
            ]
          : [{ type: "User" as const, id: "LIST" }],
    }),

    addUser: builder.mutation<User, UserForm>({
      query: (newUser) => ({
        url: `users/`,
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    updateUser: builder.mutation<User, UserForm & Pick<User, "id">>({
      query: ({ id, ...patch }) => ({
        url: `users/${id}/`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    deleteUser: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `users/`,
        method: "DELETE",
        body: { user_id: Number(id) },
      }),
      invalidatesTags: (result, error, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
