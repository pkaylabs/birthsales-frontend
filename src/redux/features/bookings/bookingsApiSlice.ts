import { api } from "@/app/api/auth";

export interface Booking {
  id: number;
  service_name: string;
  user_name: string;
  vendor_name: string;
  vendor_phone: string;
  user_phone: string;
  location: string;
  date: string;
  time: string;
  created_at: string;
  updated_at: string;
  service: number;
  status: string; // e.g., 'PENDING', 'CONFIRMED', 'CANCELLED'
  user: number;
}

interface BookingRequest {
  booking: number;
  status: string;
}

interface BookingResponse {
  id: number;
  service_name: string;
  user_name: string;
  vendor_name: string;
  date: string;
  time: string;
  status: string;
  created_at: string;
  updated_at: string;
  service: number;
  user: number;
}

export const bookingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query<Booking[], void>({
      query: () => `bookings/`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((b) => ({ type: "Booking" as const, id: b.id })),
              { type: "Booking" as const, id: "LIST" },
            ]
          : [{ type: "Booking" as const, id: "LIST" }],
    }),
    updateBooking: builder.mutation<
      { message: string; data: BookingResponse },
      BookingRequest
    >({
      query: (body) => ({
        url: `bookings/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { booking }) => [
        { type: "Booking", id: booking },
        { type: "Booking", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { useGetBookingsQuery, useUpdateBookingMutation } = bookingsApi;
