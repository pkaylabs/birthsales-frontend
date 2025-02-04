import Chart from "../components/chart/Chart";
import FeaturedChart from "../components/featuredChart/FeaturedChart";
import Tables from "../components/table/Table";
import Widget from "../components/widgets/Widget";

const AdminHomePage = () => {
  return (
    <div className="">
      {/* widgets */}
      <div className="flex gap-5">
        <Widget type="users" />
        <Widget type="products" />
        <Widget type="orders" />
        <Widget type="balance" />
      </div>
      {/* Charts */}
      <div className="flex gap-5 py-2 ">
        <FeaturedChart />
        <Chart />
      </div>
      {/* list of transactions */}
      <div className="shadow-lg p-5 m-5">
        <div className="font-medium mb-4 text-gray-400">Latest Transactions</div>
        <Tables />
      </div>
    </div>
  );
};

export default AdminHomePage;
