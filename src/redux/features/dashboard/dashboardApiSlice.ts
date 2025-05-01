import { api } from "@/app/api/auth";
import { DashboardData } from "@/redux/type";

export const dashboardApi = api.injectEndpoints({
    endpoints: (builder) => ({
      getDashboard: builder.query<DashboardData, void>({
        query: () => `dashboard/`,
        providesTags: [{ type: "Dashboard", id: "STATUS" }],
      }),
    }),
    overrideExisting: false,
  });
  
  export const { useGetDashboardQuery } = dashboardApi;