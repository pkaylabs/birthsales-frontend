import { ChevronUpIcon } from "@heroicons/react/24/outline";
import {
  ShoppingBagIcon,
  UserGroupIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-location";

interface WidgetProp {
  type: string;
  path: string;
}

const Widget = ({ type, path }: WidgetProp) => {
  const navigate = useNavigate();
  const amount = 100;
  const diff = 20;

  let data;
  switch (type) {
    case "users":
      data = {
        title: "USERS",
        isMoney: false,
        link: "See all users",
        icon: (
          <UserGroupIcon className="w-8 bg-rose-100 p-1 rounded-md self-end" />
        ),
      };
      break;
    case "products":
      data = {
        title: "PRODUCTS",
        isMoney: false,
        link: "See all products",
        icon: (
          <ShoppingBagIcon className="w-8 bg-rose-100 p-1 rounded-md self-end" />
        ),
      };
      break;
    case "orders":
      data = {
        title: "ORDERS",
        isMoney: false,
        link: "See all orders",
        icon: (
          <ShoppingBagIcon className="w-8 bg-rose-100 p-1 rounded-md self-end" />
        ),
      };
      break;
    case "balance":
      data = {
        title: "BALANCE",
        isMoney: true,
        link: "view details",
        icon: (
          <WalletIcon className="w-8 bg-rose-100 p-1 rounded-md self-end" />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className=" flex flex-1 p-2 justify-between shadow-lg rounded-lg h-[120px]">
      {/* left */}
      <div className="flex flex-col justify-between">
        <span className="font-bold text-sm text-gray-400">{data?.title}</span>
        <span className="text-3xl font-light">
          {data?.isMoney && "$"} {amount}
        </span>
        <span className="text-xs border-b border-gray-400 w-max cursor-pointer" onClick={() => navigate({to: path})}>
          {data?.link}
        </span>
      </div>
      {/* right */}
      <div className="flex flex-col justify-between items-center">
        <div className="flex justify-between items-center gap-1 text-sm text-green-300">
          <ChevronUpIcon className="w-5" />
          {diff} %
        </div>

        {data?.icon}
      </div>
    </div>
  );
};

export default Widget;