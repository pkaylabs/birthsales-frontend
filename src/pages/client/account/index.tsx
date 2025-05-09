import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux";
import { logout } from "@/redux/features/auth/authSlice";
import { useNavigate } from "react-location";
import { toast } from "react-toastify";

const Account: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

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
          <li><a href="/" className="hover:underline">Home</a></li>
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
          <div className="space-y-4 flex-1">
            <div>
              <h2 className="font-medium text-gray-900 mb-2">Manage My Account</h2>
              <ul className="space-y-1 text-gray-600">
                {["My Profile", "Address Book", "Payment Options"].map((label) => (
                  <li
                    key={label}
                    className="hover:text-red-600 cursor-pointer transition"
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-medium text-gray-900 mb-2">My Orders</h2>
              <ul className="space-y-1 text-gray-600">
                {["Returns", "Cancellations"].map((label) => (
                  <li
                    key={label}
                    className="hover:text-red-600 cursor-pointer transition"
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-medium text-gray-900 mb-2">Wishlist</h2>
              <p className="text-gray-600">Your favorite items</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-6 w-full bg-red text-white py-2 rounded-lg hover:bg-rose-700 transition"
          >
            Logout
          </button>
        </aside>

        {/* Main content */}
        <section className="md:col-span-3 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Edit Your Profile
          </h2>

          <form className="space-y-6">
            {/* Name fields */}
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

            {/* Email & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="something@gmail.com"
                  className="w-full border-gray-300 rounded-lg p-2 bg-gray-100 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Your Address"
                  className="w-full border-gray-300 rounded-lg p-2 bg-gray-100 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Password */}
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

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-red text-white rounded-lg hover:bg-rose-700 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Account;

