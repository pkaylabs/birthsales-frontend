import { api } from "@/app/api/auth";
import { ProfileForm } from "@/pages/admin/settings/Setting";
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

export interface UserProfileResponse {
  user: User;
  vendor: {
    vendor_id: string;
    vendor_name: string;
    vendor_phone: string;
    vendor_email: string;
    vendor_address: string;
    user: number | null;
  };
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
    updateUserProfile: builder.mutation<User, ProfileForm>({
      query: (body) => ({
        url: "userprofile/",
        method: "PUT",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery, useAddUserMutation, useUpdateUserProfileMutation } = usersApi;
