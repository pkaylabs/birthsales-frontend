// import { Outlet, Route, SearchPredicate } from "react-location";
// import { LocationGenerics } from "./location";

// import Home from "@/pages/client/home";
// import Contact from "@/pages/client/contact";
// import SignUp from "@/pages/auth/signUp";
// import Login from "@/pages/auth/login/Login";
// import WishList from "@/pages/client/wishList";
// import ProductDetails from "@/pages/client/product/details";

// import {
//   ADMIN_HOME,
//   CONTACT,
//   HOME,
//   LOGIN,
//   PRODUCT_DETAILS,
//   SIGN_UP,
//   WISH_LIST,
//   ACCOUNT,
//   CART_PAGE,
//   SERVICES,
//   ABOUT,
//   CHECKOUT,
//   CONFIRM_ORDER,
//   ADMIN_PRODUCT,
//   ADMIN_SERVICES,
//   ADMIN_ORDERS,
//   ADMIN_CARTS,
//   ADMIN_ADS,
//   USERS,
//   CATEGORIES,
//   VENDOR_SIGN_UP,
//   SIGN_UP_ROLE,
//   ADMIN_PLANS,
//   VENDORS,
//   BOOKINGS,
//   PROFILE,
// } from "@/constants";
// import AdminHomePage from "@/pages/admin/home";

// import CartPage from "@/pages/client/cart";
// import Account from "@/pages/client/account";
// import About from "@/pages/client/about";
// import Services from "@/pages/client/services";
// import ServiceDetails from "@/pages/client/services/ServiceDetails";
// import Checkout from "@/pages/client/checkout";
// import ConfirmOrder from "@/pages/client/confirmOrder";
// import Orders from "@/pages/admin/orders";
// import Carts from "@/pages/admin/carts";
// import Ads from "@/pages/admin/ads";
// import Users from "@/pages/admin/users";
// import UserDetails from "@/pages/admin/users/UserDetails";
// // import {
// //   userInputs,
// // } from "@/pages/admin/utils/formSource";
// import ProductAdminDetails from "@/pages/admin/products/ProductAdminDetails";
// import ProductsPage from "@/pages/admin/products";
// import Category from "@/pages/admin/category";
// import ServicesPage from "@/pages/admin/services";
// import AdminServiceDetails from "@/pages/admin/services/AdminServiceDetails";
// import VendorAccount from "@/pages/auth/vendor/VendorAccount";
// import RoleSelection from "@/pages/RoleSelection";
// import SubscriptionPlansPage from "@/pages/admin/plans/SubscriptionPlansPage";
// import VendorsPage from "@/pages/admin/vendor/VendorsPage";
// import Bookings from "@/pages/admin/bookings/Bookings";
// import VendorProfile from "@/pages/admin/vendorProfile/VendorProfile";

// export type RouteProps = Omit<Route, "children"> & {
//   navigation?: boolean;
//   sidebar?: { label: string; icon: any };
//   children?: RouteProps[];
//   search?: SearchPredicate<LocationGenerics>;
// };

// const routes: RouteProps[] = [
//   {
//     path: SIGN_UP_ROLE,
//     element: <RoleSelection />,
//     meta: {
//       layout: "Auth",
//     },
//   },
//   {
//     path: HOME,
//     element: <Home />,
//     meta: {
//       layout: "App",
//     },
//   },
//   {
//     path: ADMIN_HOME,
//     element: <AdminHomePage />,
//     meta: {
//       layout: "Admin",
//     },
//   },
//   {
//     path: ADMIN_PRODUCT,
//     element: <Outlet />,
//     meta: {
//       layout: "Admin",
//     },
//     children: [
//       {
//         path: "/",
//         element: <ProductsPage />,
//         meta: {
//           layout: "Admin",
//         },
//       },
//       {
//         path: "/:id",
//         element: <ProductAdminDetails />,
//         meta: {
//           layout: "Admin",
//         },
//       },
//     ],
//   },
//   {
//     path: ADMIN_SERVICES,
//     element: <Outlet />,
//     meta: {
//       layout: "Admin",
//     },
//     children: [
//       {
//         path: "/",
//         element: <ServicesPage />,
//         meta: {
//           layout: "Admin",
//         },
//       },
//       {
//         path: "/:id",
//         element: <AdminServiceDetails />,
//         meta: {
//           layout: "Admin",
//         },
//       },
//     ],
//   },
//   {
//     path: ADMIN_ORDERS,
//     element: <Outlet />,
//     meta: {
//       layout: "Admin",
//     },
//     children: [
//       {
//         path: "/",
//         element: <Orders />,
//         meta: {
//           layout: "Admin",
//         },
//       },
//     ],
//   },
//   {
//     path: BOOKINGS,
//     element: <Outlet />,
//     meta: {
//       layout: "Admin",
//     },
//     children: [
//       {
//         path: "/",
//         element: <Bookings />,
//         meta: {
//           layout: "Admin",
//         },
//       },
//     ],
//   },
//   {
//     path: ADMIN_CARTS,
//     element: <Carts />,
//     meta: {
//       layout: "Admin",
//     },
//   },
//   {
//     path: PROFILE,
//     element: <VendorProfile />,
//     meta: {
//       layout: "Admin",
//     },
//   },
//   {
//     path: ADMIN_ADS,
//     element: <Ads />,
//     meta: {
//       layout: "Admin",
//     },
//   },
//   {
//     path: ADMIN_PLANS,
//     element: <SubscriptionPlansPage />,
//     meta: {
//       layout: "Admin",
//     },
//   },
//   {
//     path: CATEGORIES,
//     element: <Category />,
//     meta: {
//       layout: "Admin",
//     },
//   },
//   {
//     path: USERS,
//     element: <Outlet />,
//     meta: {
//       layout: "Admin",
//     },
//     children: [
//       {
//         path: "/",
//         element: <Users />,
//         meta: {
//           layout: "Admin",
//         },
//       },
//       {
//         path: "/:id",
//         element: <UserDetails />,
//         meta: {
//           layout: "Admin",
//         },
//       },
//     ],
//   },
//   {
//     path: VENDORS,
//     element: <Outlet />,
//     meta: {
//       layout: "Admin",
//     },
//     children: [
//       {
//         path: "/",
//         element: <VendorsPage />,
//         meta: {
//           layout: "Admin",
//         },
//       },
//       // {
//       //   path: "/:id",
//       //   element: <UserDetails />,
//       //   meta: {
//       //     layout: "Admin",
//       //   },
//       // },
//     ],
//   },
//   {
//     path: CONTACT,
//     element: <Contact />,
//     meta: {
//       layout: "App",
//     },
//   },
//   {
//     path: PRODUCT_DETAILS,
//     element: <ProductDetails />,
//     meta: {
//       layout: "App",
//     },
//   },
//   {
//     path: SIGN_UP,
//     element: <SignUp />,
//     meta: {
//       layout: "Auth",
//     },
//   },
//   {
//     path: VENDOR_SIGN_UP,
//     element: <VendorAccount />,
//     meta: {
//       layout: "Auth",
//     },
//   },
//   {
//     path: LOGIN,
//     element: <Login />,
//     meta: {
//       layout: "Auth",
//     },
//   },
//   {
//     path: WISH_LIST,
//     element: <WishList />,
//     meta: {
//       layout: "App",
//     },
//   },
//   {
//     path: CART_PAGE,
//     element: <CartPage />,
//     meta: {
//       layout: "App",
//     },
//   },
//   {
//     path: ACCOUNT,
//     element: <Account />,
//     meta: {
//       layout: "App",
//     },
//   },
//   {
//     path: ABOUT,
//     element: <About />,
//     meta: {
//       layout: "App",
//     },
//   },
//   {
//     path: SERVICES,
//     element: <Outlet />,
//     meta: {
//       layout: "App",
//     },
//     children: [
//       {
//         path: "/",
//         element: <Services />,
//         meta: {
//           layout: "App",
//         },
//       },
//       {
//         path: "/:id",
//         element: <ServiceDetails />,
//         meta: {
//           layout: "App",
//         },
//       },
//     ],
//   },
//   {
//     path: CHECKOUT,
//     element: <Checkout />,
//     meta: {
//       layout: "App",
//     },
//   },
//   {
//     path: CONFIRM_ORDER,
//     element: <ConfirmOrder />,
//     meta: {
//       layout: "App",
//     },
//   },
// ];

// export default routes;

import React, { Outlet } from "react-location";
import { Route, SearchPredicate } from "react-location";
import { LocationGenerics } from "./location";

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
  CATEGORIES,
  VENDOR_SIGN_UP,
  SIGN_UP_ROLE,
  ADMIN_PLANS,
  VENDORS,
  BOOKINGS,
  PROFILE,
} from "@/constants";
import { lazy, Suspense } from "react";

// Lazy-loaded page components
const RoleSelection = lazy(() => import("@/pages/RoleSelection"));
const Home = lazy(() => import("@/pages/client/home"));
const Contact = lazy(() => import("@/pages/client/contact"));
const SignUp = lazy(() => import("@/pages/auth/signUp"));
const Login = lazy(() => import("@/pages/auth/login/Login"));
const WishList = lazy(() => import("@/pages/client/wishList"));
const ProductDetails = lazy(() => import("@/pages/client/product/details"));
const AdminHomePage = lazy(() => import("@/pages/admin/home"));
const CartPage = lazy(() => import("@/pages/client/cart"));
const Account = lazy(() => import("@/pages/client/account"));
const About = lazy(() => import("@/pages/client/about"));
const Services = lazy(() => import("@/pages/client/services"));
const ServiceDetails = lazy(
  () => import("@/pages/client/services/ServiceDetails")
);
const Checkout = lazy(() => import("@/pages/client/checkout"));
const ConfirmOrder = lazy(() => import("@/pages/client/confirmOrder"));
const Orders = lazy(() => import("@/pages/admin/orders"));
const Carts = lazy(() => import("@/pages/admin/carts"));
const Ads = lazy(() => import("@/pages/admin/ads"));
const Users = lazy(() => import("@/pages/admin/users"));
const UserDetails = lazy(() => import("@/pages/admin/users/UserDetails"));
const ProductsPage = lazy(() => import("@/pages/admin/products"));
const ProductAdminDetails = lazy(
  () => import("@/pages/admin/products/ProductAdminDetails")
);
const Category = lazy(() => import("@/pages/admin/category"));
const ServicesPage = lazy(() => import("@/pages/admin/services"));
const AdminServiceDetails = lazy(
  () => import("@/pages/admin/services/AdminServiceDetails")
);
const VendorAccount = lazy(() => import("@/pages/auth/vendor/VendorAccount"));
const SubscriptionPlansPage = lazy(
  () => import("@/pages/admin/plans/SubscriptionPlansPage")
);
const VendorsPage = lazy(() => import("@/pages/admin/vendor/VendorsPage"));
const Bookings = lazy(() => import("@/pages/admin/bookings/Bookings"));
const VendorProfile = lazy(
  () => import("@/pages/admin/vendorProfile/VendorProfile")
);

export type RouteProps = Omit<Route, "children"> & {
  navigation?: boolean;
  sidebar?: { label: string; icon: any };
  children?: RouteProps[];
  search?: SearchPredicate<LocationGenerics>;
};

const routes: RouteProps[] = [
  {
    path: SIGN_UP_ROLE,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <RoleSelection />
      </Suspense>
    ),
    meta: { layout: "Auth" },
  },
  {
    path: HOME,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Home />
      </Suspense>
    ),
    meta: { layout: "App" },
  },
  {
    path: ADMIN_HOME,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <AdminHomePage />
      </Suspense>
    ),
    meta: { layout: "Admin" },
  },
  {
    path: ADMIN_PRODUCT,
    element: <Outlet />,
    meta: { layout: "Admin" },
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ProductsPage />
          </Suspense>
        ),
        meta: { layout: "Admin" },
      },
      {
        path: "/:id",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ProductAdminDetails />
          </Suspense>
        ),
        meta: { layout: "Admin" },
      },
    ],
  },
  // ... similarly wrap all other route elements in Suspense
  {
    path: ADMIN_SERVICES,
    element: <Outlet />,
    meta: { layout: "Admin" },
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ServicesPage />
          </Suspense>
        ),
        meta: { layout: "Admin" },
      },
      {
        path: "/:id",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AdminServiceDetails />
          </Suspense>
        ),
        meta: { layout: "Admin" },
      },
    ],
  },
  {
    path: ADMIN_ORDERS,
    element: <Outlet />,
    meta: { layout: "Admin" },
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Orders />
          </Suspense>
        ),
        meta: { layout: "Admin" },
      },
    ],
  },
  {
    path: BOOKINGS,
    element: <Outlet />,
    meta: { layout: "Admin" },
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Bookings />
          </Suspense>
        ),
        meta: { layout: "Admin" },
      },
    ],
  },
  {
    path: ADMIN_CARTS,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Carts />
      </Suspense>
    ),
    meta: { layout: "Admin" },
  },
  {
    path: PROFILE,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <VendorProfile />
      </Suspense>
    ),
    meta: { layout: "Admin" },
  },
  {
    path: ADMIN_ADS,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Ads />
      </Suspense>
    ),
    meta: { layout: "Admin" },
  },
  {
    path: ADMIN_PLANS,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <SubscriptionPlansPage />
      </Suspense>
    ),
    meta: { layout: "Admin" },
  },
  {
    path: CATEGORIES,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Category />
      </Suspense>
    ),
    meta: { layout: "Admin" },
  },
  {
    path: USERS,
    element: <Outlet />,
    meta: { layout: "Admin" },
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Users />
          </Suspense>
        ),
        meta: { layout: "Admin" },
      },
      {
        path: "/:id",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <UserDetails />
          </Suspense>
        ),
        meta: { layout: "Admin" },
      },
    ],
  },
  {
    path: VENDORS,
    element: <Outlet />,
    meta: { layout: "Admin" },
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <VendorsPage />
          </Suspense>
        ),
        meta: { layout: "Admin" },
      },
    ],
  },
  {
    path: CONTACT,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Contact />
      </Suspense>
    ),
    meta: { layout: "App" },
  },
  {
    path: PRODUCT_DETAILS,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ProductDetails />
      </Suspense>
    ),
    meta: { layout: "App" },
  },
  {
    path: SIGN_UP,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <SignUp />
      </Suspense>
    ),
    meta: { layout: "Auth" },
  },
  {
    path: VENDOR_SIGN_UP,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <VendorAccount />
      </Suspense>
    ),
    meta: { layout: "Auth" },
  },
  {
    path: LOGIN,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    ),
    meta: { layout: "Auth" },
  },
  {
    path: WISH_LIST,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <WishList />
      </Suspense>
    ),
    meta: { layout: "App" },
  },
  {
    path: CART_PAGE,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <CartPage />
      </Suspense>
    ),
    meta: { layout: "App" },
  },
  {
    path: ACCOUNT,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Account />
      </Suspense>
    ),
    meta: { layout: "App" },
  },
  {
    path: ABOUT,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <About />
      </Suspense>
    ),
    meta: { layout: "App" },
  },
  {
    path: SERVICES,
    element: <Outlet />,
    meta: { layout: "App" },
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Services />
          </Suspense>
        ),
        meta: { layout: "App" },
      },
      {
        path: "/:id",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ServiceDetails />
          </Suspense>
        ),
        meta: { layout: "App" },
      },
    ],
  },
  {
    path: CHECKOUT,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Checkout />
      </Suspense>
    ),
    meta: { layout: "App" },
  },
  {
    path: CONFIRM_ORDER,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ConfirmOrder />
      </Suspense>
    ),
    meta: { layout: "App" },
  },
];

export default routes;
