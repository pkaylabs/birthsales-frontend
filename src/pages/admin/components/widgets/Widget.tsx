import { ChevronUpIcon } from "@heroicons/react/24/outline";
import {
  ShoppingBagIcon,
  UserGroupIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { JSX } from "react";
import { useNavigate } from "react-location";

interface WidgetProp {
  type: "users" | "products" | "orders" | "balance";
  path: string;
  count?: number;
  amount?: number;
}

const Widget = ({ type, path, count = 0, amount = 0 }: WidgetProp) => {
  const navigate = useNavigate();
  const diff = 20;

  let data: {
    title: string;
    isMoney: boolean;
    link: string;
    icon: JSX.Element;
    value: number;
  };
  switch (type) {
    case "users":
      data = {
        title: "USERS",
        isMoney: false,
        link: "See all users",
        icon: (
          <UserGroupIcon className="w-8 bg-rose-100 p-1 rounded-md self-end" />
        ),
        value: count,
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
        value: count,
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
        value: count,
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
        value: amount,
      };
      break;
    default:
      throw new Error("Invalid widget type");
  }

  return (
    <div className=" flex flex-1 p-2 justify-between shadow-lg rounded-lg h-[120px]">
      {/* left */}
      <div className="flex flex-col justify-between">
        <span className="font-bold text-sm text-gray-400">{data?.title}</span>
        <span className="text-3xl font-light">
          {data?.isMoney && "GHC"} {data.value}
        </span>
        <span
          className="text-xs border-b border-gray-400 w-max cursor-pointer"
          onClick={() => navigate({ to: path })}
        >
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
