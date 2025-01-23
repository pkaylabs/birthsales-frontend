import { Outlet, Route, SearchPredicate } from "react-location";
import { LocationGenerics } from "./location";

import Home from "@/pages/client/home";
import Contact from "@/pages/client/contact";
import SignUp from "@/pages/auth/signUp";
import Login from "@/pages/auth/login/Login";
import WishList from "@/pages/client/wishList";
import ProductDetails from "@/pages/client/product/details";
import { CONTACT, HOME, LOGIN, PRODUCT_DETAILS, SIGN_UP, WISH_LIST } from "@/constants";


export type RouteProps = Omit<Route, "children"> & {
  navigation?: boolean;
  sidebar?: { label: string; icon: any };
  children?: RouteProps[];
  search?: SearchPredicate<LocationGenerics>;
};

const routes: RouteProps[] = [
  {
    path: HOME,
    element: <Home />,
    meta: {
      layout: "App",
    },
  },
  {
    path: CONTACT,
    element: <Contact />,
    meta: {
      layout: "App",
    },
  },
  {
    path: PRODUCT_DETAILS,
    element: <ProductDetails />,
    meta: {
      layout: "App",
    },
  },
  {
    path: SIGN_UP,
    element: <SignUp />,
    meta: {
      layout: "Auth",
    },
  },
  {
    path: LOGIN,
    element: <Login />,
    meta: {
      layout: "Auth",
    },
  },
  {
    path: WISH_LIST,
    element: <WishList />,
    meta: {
      layout: "App",
    },
  },
];

export default routes;
