
// import Footer from "@/components/Footer";
// import Header from "@/components/Header";
// import { Outlet } from "react-location";

// export default function AppLayout() {
//   return (
//     <div className="font-poppins flex flex-col min-h-screen">
//       <Header />
//       <div className="py-[6rem]">
//         <Outlet />
//       </div>
//       <Footer />
//     </div>
//   );
// }

import React from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Outlet } from "react-location";

export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen font-poppins">
      <Header />
      <main className="flex-1 pt-16 md:pt-20 lg:pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
