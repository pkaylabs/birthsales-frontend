import { ADMIN_ORDERS, ADMIN_PRODUCT, USERS } from "@/constants";
import Chart from "../components/chart/Chart";
import FeaturedChart from "../components/featuredChart/FeaturedChart";
import Tables from "../components/table/Table";
import Widget from "../components/widgets/Widget";

const AdminHomePage = () => {
  return (
    <div className="">
      {/* widgets */}
      <div className="flex gap-5">
        <Widget type="users" path={USERS} />
        <Widget type="products" path={ADMIN_PRODUCT} />
        <Widget type="orders" path={ADMIN_ORDERS} />
        <Widget type="balance" path="" />
      </div>
      {/* Charts */}
      <div className="flex gap-5 py-2 ">
        <FeaturedChart />
        <Chart aspect={2 / 1} title="Last 6 months (Revenue)" />
      </div>
      {/* list of transactions */}
      <div className="shadow-lg p-5 m-5">
        <div className="font-medium mb-4 text-gray-400">
          Latest Transactions
        </div>
        <Tables />
      </div>
    </div>
  );
};

export default AdminHomePage;
