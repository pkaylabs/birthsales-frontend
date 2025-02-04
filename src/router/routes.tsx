import { Outlet, Route, SearchPredicate } from "react-location";
import { LocationGenerics } from "./location";

import Home from "@/pages/client/home";
import Contact from "@/pages/client/contact";
import SignUp from "@/pages/auth/signUp";
import Login from "@/pages/auth/login/Login";
import WishList from "@/pages/client/wishList";
import ProductDetails from "@/pages/client/product/details";

import {
  ADMIN_HOME,
  CONTACT,
  HOME,
  LOGIN,
  PRODUCT_DETAILS,
  SIGN_UP,
  WISH_LIST,
  ACCOUNT,
  CART_PAGE,
  SERVICES,
  ABOUT,
  CHECKOUT,
  CONFIRM_ORDER,
  ADMIN_PRODUCT,
  ADMIN_SERVICES,
  ADMIN_ORDERS,
  ADMIN_CARTS,
  ADMIN_ADS,
  USERS,
} from "@/constants";
import AdminHomePage from "@/pages/admin/home";

import CartPage from "@/pages/client/cart";
import Account from "@/pages/client/account";
import About from "@/pages/client/about";
import Services from "@/pages/client/services";
import ServiceDetails from "@/pages/client/services/ServiceDetails";
import Checkout from "@/pages/client/checkout";
import ConfirmOrder from "@/pages/client/confirmOrder";
import Products from "@/pages/admin/products";
import AdminServices from "@/pages/admin/services";
import Orders from "@/pages/admin/orders";
import Carts from "@/pages/admin/carts";
import Ads from "@/pages/admin/ads";
import Users from "@/pages/admin/users";

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
    path: ADMIN_HOME,
    element: <AdminHomePage />,
    meta: {
      layout: "Admin",
    },
  },
  {
    path: ADMIN_PRODUCT,
    element: <Products />,
    meta: {
      layout: "Admin",
    },
  },
  {
    path: ADMIN_SERVICES,
    element: <AdminServices />,
    meta: {
      layout: "Admin",
    },
  },
  {
    path: ADMIN_ORDERS,
    element: <Orders />,
    meta: {
      layout: "Admin",
    },
  },
  {
    path: ADMIN_CARTS,
    element: <Carts />,
    meta: {
      layout: "Admin",
    },
  },
  {
    path: ADMIN_ADS,
    element: <Ads />,
    meta: {
      layout: "Admin",
    },
  },
  {
    path: USERS,
    element: <Users />,
    meta: {
      layout: "Admin",
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
  {
    path: CART_PAGE,
    element: <CartPage />,
    meta: {
      layout: "App",
    },
  },
  {
    path: ACCOUNT,
    element: <Account />,
    meta: {
      layout: "App",
    },
  },
  {
    path: ABOUT,
    element: <About />,
    meta: {
      layout: "App",
    },
  },
  {
    path: SERVICES,
    element: <Outlet />,
    meta: {
      layout: "App",
    },
    children: [
      {
        path: "/",
        element: <Services />,
        meta: {
          layout: "App",
        },
      },
      {
        path: "/:id",
        element: <ServiceDetails />,
        meta: {
          layout: "App",
        },
      },
    ],
  },
  {
    path: CHECKOUT,
    element: <Checkout />,
    meta: {
      layout: "App",
    },
  },
  {
    path: CONFIRM_ORDER,
    element: <ConfirmOrder />,
    meta: {
      layout: "App",
    },
  },
];

export default routes;
