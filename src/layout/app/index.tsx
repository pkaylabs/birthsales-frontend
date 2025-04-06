
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Outlet } from "react-location";

export default function AppLayout() {
  return (
    <div className="font-poppins flex flex-col min-h-screen">
      <Header />
      <div className="py-[3rem]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
