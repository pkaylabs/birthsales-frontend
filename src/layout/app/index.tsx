import Header from "@/components/Header";
import { Outlet } from "react-location";

export default function AppLayout() {
  return (
    <div className="">
      <Header />
      <div className="py-[6rem]">
        <Outlet />
      </div>
    </div>
  );
}
