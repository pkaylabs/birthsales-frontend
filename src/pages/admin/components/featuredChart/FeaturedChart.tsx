import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface FeaturedChartProps {
  salesToday: number;
}

const FeaturedChart = ({ salesToday }: FeaturedChartProps) => {
  return (
    <div className="flex flex-col flex-[2] shadow-lg p-3 ">
      {/* Top */}
      <div className="flex w-full justify-between items-center text-gray-400 ">
        <h1 className="text-base font-medium">Total Revenue</h1>
        <EllipsisVerticalIcon className="w-6" />
      </div>
      {/* Bottom */}
      <div className="p-5 mt-10 flex flex-col items-center justify-center gap-4">
        <div className="w-24 h-24">
          <CircularProgressbar value={70} text="70%" strokeWidth={4} />
        </div>
        <p className="font-medium text-gray-400">Total Sales made today</p>
        <p className="text-3xl">GHC {salesToday}</p>
      </div>
    </div>
  );
};

export default FeaturedChart;
