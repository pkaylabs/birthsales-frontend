import { Outlet, Route, SearchPredicate } from "react-location";
import { LocationGenerics } from "./location";
import Home from "@/pages/home";


export type RouteProps = Omit<Route, "children"> & {
  navigation?: boolean;
  sidebar?: { label: string; icon: any };
  children?: RouteProps[];
  search?: SearchPredicate<LocationGenerics>;
};

const routes: RouteProps[] = [
  {
    path: "/",
    element: <Home />,
    meta: {
      layout: "App",
    },
  },
];

export default routes;
