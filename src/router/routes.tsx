import { Outlet, Route, SearchPredicate } from "react-location";
import { LocationGenerics } from "./location";
import Home from "@/pages/client/home";
import Contact from "@/pages/client/contact";
import SignUp from "@/pages/auth/signUp";
import Login from "@/pages/auth/login/Login";
import ProductDetails from "@/pages/client/product/details";

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
    path: "/contact",
    element: <Contact />,
    meta: {
      layout: "App",
    },
  },
  {
    path: "/product-details",
    element: <ProductDetails />,
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
