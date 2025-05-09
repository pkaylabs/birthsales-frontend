import { ADMIN_ORDERS, ADMIN_PRODUCT, USERS } from "@/constants";
import Chart from "../components/chart/Chart";
import FeaturedChart from "../components/featuredChart/FeaturedChart";
import Tables from "../components/table/Table";
import Widget from "../components/widgets/Widget";
import { useGetDashboardQuery } from "@/redux/features/dashboard/dashboardApiSlice";
import { Box, Button, Skeleton } from "@mui/material";
import CashoutModal from "../components/CashoutModal";
import { useState } from "react";

const AdminHomePage = () => {
  const { data, isLoading, isError } = useGetDashboardQuery();
   const [cashoutOpen, setCashoutOpen] = useState(false);

  if (isLoading) {
    return (
      <Box className="p-8 space-y-6">
        {/* Widgets skeleton */}
        <Box className="flex gap-5">
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              width={200}
              height={120}
              animation="wave"
            />
          ))}
        </Box>

        {/* Charts skeleton */}
        <Box className="flex gap-5 py-2">
          <Skeleton
            variant="rectangular"
            width="100%"
            height={300}
            animation="wave"
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={300}
            animation="wave"
          />
        </Box>

        {/* Table header skeleton */}
        <Box className="shadow-lg p-5 m-5">
          <Skeleton variant="text" width={200} height={32} animation="wave" />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={200}
            animation="wave"
            sx={{ mt: 2 }}
          />
        </Box>
      </Box>
    );
  }

  if (isError || !data) {
    return <Box className="p-8 text-red-500">Error loading dashboard.</Box>;
  }

  return (
    <div className="">
      {/* widgets */}
      <div className="flex gap-5">
        <Widget type="users" count={data.users} path={USERS} />
        <Widget type="products" count={data.products} path={ADMIN_PRODUCT} />
        <Widget type="orders" count={data.orders} path={ADMIN_ORDERS} />
        <Widget type="balance" amount={data.balance} path="" />
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setCashoutOpen(true)}
        >
          Cash Out
        </Button>
        <CashoutModal
          open={cashoutOpen}
          onClose={() => setCashoutOpen(false)}
        />
      </div>
      {/* Charts */}
      <div className="flex gap-5 py-2 ">
        <FeaturedChart salesToday={data.sales_today} />
        <Chart aspect={2 / 1} title="Last 6 months (Revenue)" />
      </div>
      {/* list of transactions */}
      <div className="shadow-lg p-5 m-5">
        <div className="font-medium mb-4 text-gray-400">
          Latest Transactions
        </div>
        <Tables
          rows={data.latest_transactions.map((transaction) => ({
            payment_id: transaction.id.toString(),
            customer_name: transaction.customer,
            created_at: transaction.date,
            what_was_paid_for: transaction.product,
            amount: transaction.amount,
            payment_method: transaction.method,
            status: transaction.status,
          }))}
        />
      </div>
    </div>
  );
};

export default AdminHomePage;
