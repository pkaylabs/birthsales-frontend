import { Outlet, Route, SearchPredicate } from "react-location";
import { LocationGenerics } from "./location";
import Home from "@/pages/home";
import SignUp from "@/pages/signUp";
import Login from "@/pages/login/Login";


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
  {
    path: "/sign-up",
    element: <SignUp />,
    meta: {
      layout: "App",
    },
  },
  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "App",
    },
  },
];

export default routes;
