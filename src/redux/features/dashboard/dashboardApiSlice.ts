import { api } from "@/app/api/auth";
import { TablesProps } from "@/pages/admin/components/table/Table";

interface DashboardData {
  products: number;
  balance: number;
  users: number;
  orders: number;
  latest_transactions: TablesProps[];
  sales_today: number;
}

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
