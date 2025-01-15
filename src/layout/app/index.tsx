
import Header from "@/components/Header";
import { Outlet } from "react-location";

export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="py-[6rem]">
        <Outlet />
      </div>
      {/* <Footer /> */}
    </div>
  );
}
