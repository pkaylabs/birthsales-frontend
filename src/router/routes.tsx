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
  ADMIN_SUBSCRIPTIONS,
  CLIENT_CATEGORY_DETAILS,
  ADMIN_BANNERS,
  ADMIN_LOCATIONS,
  ADMIN_DELIVERY_FEES,
  ADMIN_VIDEO_ADS,
  ADMIN_PAYOUTS,
  SETTINGS,
  VERIFY_OTP,
} from "@/constants";
import { lazy, Suspense } from "react";
import { RequireAuth } from "./RequireAuth";

// Lazy-loaded page components
import RoleSelection from "@/pages/RoleSelection";
import Home from "@/pages/client/home";
import Contact from "@/pages/client/contact";
import About from "@/pages/client/about";
import SignUp from "@/pages/auth/signUp";
import VendorAccount from "@/pages/auth/vendor/VendorAccount";
import Login from "@/pages/auth/login/Login";
import BannersPage from "@/pages/admin/banners/BannersPage";
import Setting from "@/pages/admin/settings/Setting";
import VerifyOtp from "@/pages/auth/signUp/VerifyOtp";
import VideoAdsPage from "@/pages/admin/videoAds";
import PayoutsPage from "@/pages/admin/payouts";
const WishList = lazy(() => import("@/pages/client/wishList"));
const ProductDetails = lazy(() => import("@/pages/client/product/details"));
const AdminHomePage = lazy(() => import("@/pages/admin/home"));
const CartPage = lazy(() => import("@/pages/client/cart"));
const Account = lazy(() => import("@/pages/client/account"));
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
const Category = lazy(() => import("@/pages/admin/category"));
const ServicesPage = lazy(() => import("@/pages/admin/services"));
const SubscriptionPlansPage = lazy(
  () => import("@/pages/admin/plans/SubscriptionPlansPage")
);
const Subscriptions = lazy(
  () => import("@/pages/admin/subscriptions/Subscriptions")
);
const VendorsPage = lazy(() => import("@/pages/admin/vendor/VendorsPage"));
const Bookings = lazy(() => import("@/pages/admin/bookings/Bookings"));
const VendorProfile = lazy(
  () => import("@/pages/admin/vendorProfile/VendorProfile")
);
const LocationsPage = lazy(() => import("@/pages/admin/locations"));
const DeliveryFeesPage = lazy(() => import("@/pages/admin/deliveryFees"));

export type RouteProps = Omit<Route, "children"> & {
  navigation?: boolean;
  sidebar?: { label: string; icon: any };
  children?: RouteProps[];
  search?: SearchPredicate<LocationGenerics>;
};

const routes: RouteProps[] = [
  {
    path: SIGN_UP_ROLE,
    element: <RoleSelection />,
    meta: { layout: "Auth" },
  },
  {
    path: HOME,
    element: <Home />,
    meta: { layout: "App" },
  },
  {
    path: CLIENT_CATEGORY_DETAILS,
    element: <Home />,
    meta: { layout: "App" },
  },
  {
    path: CONTACT,
    element: <Contact />,
    meta: { layout: "App" },
  },
  {
    path: ABOUT,
    element: <About />,
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
    element: <SignUp />,
    meta: { layout: "Auth" },
  },
  {
    path: VERIFY_OTP,
    element: (
      <RequireAuth roles={["DELIVERY"]}>
        <Suspense fallback={<div>Loading...</div>}>
          <VerifyOtp />
        </Suspense>
      </RequireAuth>
    ),
    meta: { layout: "Auth" },
  },
  {
    path: VENDOR_SIGN_UP,
    element: <VendorAccount />,
    meta: { layout: "Auth" },
  },
  {
    path: LOGIN,
    element: <Login />,
    meta: { layout: "Auth" },
  },

  // CLIENT ONLY

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
      <RequireAuth roles={["DELIVERY", "ADMIN", "VENDOR"]}>
        <Suspense fallback={<div>Loading...</div>}>
          <Account />
        </Suspense>
      </RequireAuth>
    ),
    meta: { layout: "App" },
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
      <RequireAuth roles={["DELIVERY", "ADMIN", "VENDOR"]}>
        <Suspense fallback={<div>Loading...</div>}>
          <ConfirmOrder />
        </Suspense>
      </RequireAuth>
    ),
    meta: { layout: "App" },
  },

  // Vendor and Admiin

  {
    path: ADMIN_SERVICES,
    element: (
      <RequireAuth roles={["ADMIN", "VENDOR"]}>
        <Outlet />
      </RequireAuth>
    ),
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
    ],
  },

  // Admins only

  {
    path: ADMIN_HOME,
    element: (
      <RequireAuth roles={["ADMIN", "VENDOR"]}>
        <Suspense fallback={<div>Loading...</div>}>
          <AdminHomePage />
        </Suspense>
      </RequireAuth>
    ),
    meta: { layout: "Admin" },
  },
  {
    path: ADMIN_PRODUCT,
    element: (
      <RequireAuth roles={["ADMIN", "VENDOR"]}>
        <Suspense fallback={<div>Loading...</div>}>
          <ProductsPage />
        </Suspense>
      </RequireAuth>
    ),
    meta: { layout: "Admin" },
  },

  {
    path: ADMIN_ORDERS,
    element: (
      <RequireAuth roles={["ADMIN", "VENDOR"]}>
        <Outlet />
      </RequireAuth>
    ),
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
    element: (
      <RequireAuth roles={["ADMIN", "VENDOR"]}>
        <Outlet />
      </RequireAuth>
    ),
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
      <RequireAuth roles={["ADMIN", "VENDOR"]}>
        <Suspense fallback={<div>Loading...</div>}>
          <Carts />
        </Suspense>
      </RequireAuth>
    ),
    meta: { layout: "Admin" },
  },
  {
    path: PROFILE,
    element: (
      <RequireAuth roles={["ADMIN", "VENDOR"]}>
        <Suspense fallback={<div>Loading...</div>}>
          <VendorProfile />
        </Suspense>
      </RequireAuth>
    ),
    meta: { layout: "Admin" },
  },
  {
    path: ADMIN_ADS,
    element: (
      <RequireAuth roles={["ADMIN", "VENDOR"]}>
        <Suspense fallback={<div>Loading...</div>}>
          <Ads />
        </Suspense>
      </RequireAuth>
    ),
    meta: { layout: "Admin" },
  },
  {
    path: ADMIN_BANNERS,
    element: (
      <RequireAuth roles={["ADMIN", "VENDOR"]}>
        <Suspense fallback={<div>Loading...</div>}>
          <BannersPage />
        </Suspense>
      </RequireAuth>
    ),
    meta: { layout: "Admin" },
  },
  {
    path: ADMIN_PLANS,
    element: (
      <RequireAuth roles={["ADMIN", "VENDOR"]}>
        <Suspense fallback={<div>Loading...</div>}>
          <SubscriptionPlansPage />
        </Suspense>
      </RequireAuth>
    ),
    meta: { layout: "Admin" },
  },
  {
    path: ADMIN_SUBSCRIPTIONS,
    element: (
      <RequireAuth roles={["ADMIN", "VENDOR"]}>
        <Suspense fallback={<div>Loading...</div>}>
          <Subscriptions />
        </Suspense>
      </RequireAuth>
    ),
    meta: { layout: "Admin" },
  },
  {
    path: SETTINGS,
    element: (
      <RequireAuth roles={["ADMIN", "VENDOR"]}>
        <Suspense fallback={<div>Loading...</div>}>
          <Setting />
        </Suspense>
      </RequireAuth>
    ),
    meta: { layout: "Admin" },
  },
  {
    path: CATEGORIES,
    element: (
      <RequireAuth roles={["ADMIN", "VENDOR"]}>
        <Suspense fallback={<div>Loading...</div>}>
          <Category />
        </Suspense>
      </RequireAuth>
    ),
    meta: { layout: "Admin" },
  },
  {
    path: ADMIN_LOCATIONS,
    element: (
      <RequireAuth roles={["ADMIN"]}>
        <Suspense fallback={<div>Loading...</div>}>
          <LocationsPage />
        </Suspense>
      </RequireAuth>
    ),
    meta: { layout: "Admin" },
  },
  {
    path: ADMIN_DELIVERY_FEES,
    element: (
      <RequireAuth roles={["ADMIN"]}>
        <Suspense fallback={<div>Loading...</div>}>
          <DeliveryFeesPage />
        </Suspense>
      </RequireAuth>
    ),
    meta: { layout: "Admin" },
  },
  {
    path: ADMIN_VIDEO_ADS,
    element: (
      <RequireAuth roles={["ADMIN"]}>
        <Suspense fallback={<div>Loading...</div>}>
          <VideoAdsPage />
        </Suspense>
      </RequireAuth>
    ),
    meta: { layout: "Admin" },
  },
  {
    path: ADMIN_PAYOUTS,
    element: (
      <RequireAuth roles={["ADMIN"]}>
        <Suspense fallback={<div>Loading...</div>}>
          <PayoutsPage />
        </Suspense>
      </RequireAuth>
    ),
    meta: { layout: "Admin" },
  },
  {
    path: USERS,
    element: (
      <RequireAuth roles={["ADMIN", "VENDOR"]}>
        <Outlet />
      </RequireAuth>
    ),
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
    element: (
      <RequireAuth roles={["ADMIN"]}>
        <Outlet />
      </RequireAuth>
    ),
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
];

export default routes;
