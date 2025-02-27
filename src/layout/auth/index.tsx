import { Outlet } from "react-location";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function AuthLayout() {
  return (
    <div className="font-poppins flex flex-col min-h-screen">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
