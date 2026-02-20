import { api } from "@/app/api/auth";
import type { Location } from "@/redux/type";

export type LocationCategory = "HALL" | "DEPARTMENT";

export interface LocationCreateRequest {
  name: string;
  category: LocationCategory;
}

export interface LocationUpdateRequest extends LocationCreateRequest {
  location_id: number;
  id?: number;
}

export const locationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query<Location[], void>({
      query: () => `locations/`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Locations" as const, id })),
              { type: "Locations" as const, id: "LIST" },
            ]
          : [{ type: "Locations" as const, id: "LIST" }],
    }),

    addLocation: builder.mutation<Location, LocationCreateRequest>({
      query: (body) => ({
        url: `locations/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Locations", id: "LIST" }],
    }),

    updateLocation: builder.mutation<Location, LocationUpdateRequest>({
      query: (body) => ({
        url: `locations/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { location_id }) => [
        { type: "Locations", id: location_id },
        { type: "Locations", id: "LIST" },
      ],
    }),

    deleteLocation: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `locations/`,
        method: "DELETE",
        body: { location_id: Number(id) },
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Locations", id },
        { type: "Locations", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLocationsQuery,
  useAddLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
} = locationsApi;
