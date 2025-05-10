import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux";
import { logout } from "@/redux/features/auth/authSlice";
import { Link, useNavigate } from "react-location";
import { toast } from "react-toastify";
import { useGetOrdersQuery } from "@/redux/features/orders/orderApiSlice";

type Tab = "profile" | "orders" | "bookings";

const Account: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const { data: orders = [], isLoading: loadingOrders } = useGetOrdersQuery(
    undefined,
    {
      skip: activeTab !== "orders",
    }
  );
  const { data: bookings = [], isLoading: loadingBookings } =
    useGetBookingsQuery(undefined, {
      skip: activeTab !== "bookings",
    });

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logout successful");
    navigate({ to: "/login", replace: true });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="text-gray-500 text-sm mb-6">
        <ol className="flex space-x-2">
          <li>
            <Link to="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">My Account</li>
        </ol>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
        Welcome, <span className="text-red-600">{user?.name}</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-1 bg-white rounded-lg shadow p-6 flex flex-col">
          <nav className="flex-1 space-y-4">
            <button
              onClick={() => setActiveTab("profile")}
              className={`block w-full text-left px-2 py-1 rounded ${
                activeTab === "profile"
                  ? "bg-rose-100 text-rose-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Profile
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`block w-full text-left px-2 py-1 rounded ${
                activeTab === "orders"
                  ? "bg-rose-100 text-rose-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              My Orders
            </button>

            <button
              onClick={() => setActiveTab("bookings")}
              className={`block w-full text-left px-2 py-1 rounded ${
                activeTab === "bookings"
                  ? "bg-rose-100 text-rose-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              My Bookings
            </button>
          </nav>

          <button
            onClick={handleLogout}
            className="mt-6 w-full bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 transition"
          >
            Logout
          </button>
        </aside>

        {/* Main Content */}
        <section className="md:col-span-3 bg-white rounded-lg shadow p-6 space-y-6">
          {activeTab === "profile" && <ProfileForm />}

          {activeTab === "orders" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                My Orders
              </h2>
              {loadingOrders ? (
                <p>Loading orders…</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div key={o.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between">
                        <span>Order #{o.id}</span>
                        <span className="font-medium">{o.status}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Total: GHC{o.total_price} • Placed:{" "}
                        {new Date(o.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && <p>You have no orders yet.</p>}
                </div>
              )}
            </div>
          )}

          {activeTab === "bookings" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                My Bookings
              </h2>
              {loadingBookings ? (
                <p>Loading bookings…</p>
              ) : (
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <div key={b.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between">
                        <span>Booking #{b.id}</span>
                        <span className="font-medium">{b.status}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Service: {b.service_name} • Date: {b.date} @ {b.time}
                      </div>
                    </div>
                  ))}
                  {bookings.length === 0 && <p>You have no bookings yet.</p>}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Account;

import React from "react";
import { useGetBookingsQuery } from "@/redux/features/bookings/bookingsApiSlice";

export const ProfileForm: React.FC = () => (
  <>
    <h2 className="text-xl font-semibold text-red-600 mb-4">
      Edit Your Profile
    </h2>
    <form className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            placeholder="First Name"
            className="w-full border-gray-300 rounded-lg p-2 bg-gray-100 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            placeholder="Last Name"
            className="w-full border-gray-300 rounded-lg p-2 bg-gray-100 focus:ring-red-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="someone@example.com"
            className="w-full border-gray-300 rounded-lg p-2 bg-gray-100 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            placeholder="Your address"
            className="w-full border-gray-300 rounded-lg p-2 bg-gray-100 focus:ring-red-500"
          />
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full border-gray-300 rounded-lg p-2 bg-gray-100 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full border-gray-300 rounded-lg p-2 bg-gray-100 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full border-gray-300 rounded-lg p-2 bg-gray-100 focus:ring-red-500"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
        >
          Save Changes
        </button>
      </div>
    </form>
  </>
);
