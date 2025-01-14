import { Outlet } from "react-location";

export default function AppLayout() {
  return (
    <div className="">
      <p className="">App</p>
      <Outlet />
    </div>
  );
}
