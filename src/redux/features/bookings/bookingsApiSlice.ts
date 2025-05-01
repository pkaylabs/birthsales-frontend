import { api } from "@/app/api/auth";
import { Booking } from "@/redux/type";

interface BookingDTO {
    id: number;
    user: number;
    service: number;
    date: string;
    status: string;
    vendor: number;
  }

  export const bookingsApi = api.injectEndpoints({
    endpoints: (builder) => ({
      getBookings: builder.query<Booking[], void>({
        query: () => `bookings/`,
        transformResponse: (response: BookingDTO[]) =>
          response.map(({ id, user, service, date, status, vendor }) => ({
            id,
            user,
            service,
            date,
            status,
            vendor,
          })),
        providesTags: (result) =>
          result
            ? [
                ...result.map((b) => ({ type: 'Booking' as const, id: b.id })),
                { type: 'Booking' as const, id: 'LIST' },
              ]
            : [{ type: 'Booking' as const, id: 'LIST' }],
      }),
      getVendorBookings: builder.query<Booking[], number>({
        query: (vendorId) => `bookings/?vendor=${vendorId}`,
        transformResponse: (response: BookingDTO[]) =>
          response.map(({ id, user, service, date, status, vendor }) => ({
            id,
            user,
            service,
            date,
            status,
            vendor,
          })),
        providesTags: (result) =>
          result
            ? [
                ...result.map((b) => ({ type: 'Booking' as const, id: b.id })),
              ]
            : [],
      }),
      updateBooking: builder.mutation<Booking, Partial<Booking> & Pick<Booking, 'id'>>({
        query: ({ id, ...patch }) => ({ url: `bookings/${id}/`, method: 'PUT', body: patch }),
        invalidatesTags: (result, error, { id }) => [
          { type: 'Booking', id },
          { type: 'Booking', id: 'LIST' },
        ],
      }),
    }),
    overrideExisting: false,
  });
  
  export const {
    useGetBookingsQuery,
    useGetVendorBookingsQuery,
    useUpdateBookingMutation,
  } = bookingsApi;