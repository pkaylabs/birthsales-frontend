import { ChangeEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux";
import { logout } from "@/redux/features/auth/authSlice";
import { Link, useNavigate } from "react-location";
import { toast } from "react-toastify";
import { useGetOrdersQuery } from "@/redux/features/orders/orderApiSlice";
import {
  Booking,
  useGetBookingsQuery,
} from "@/redux/features/bookings/bookingsApiSlice";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/redux/features/users/usersApi";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Order } from "@/redux/type";

type Tab = "profile" | "orders" | "bookings";

const Account: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

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
                    <div
                      key={o.id}
                      className="p-4 border rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <div className="flex flex-col sm:flex-col justify-between mb-2">
                          <span>Order #{o.id}</span>
                          <span className="font-medium">{o.status}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Total: GHC{o.total_price} • Placed:{" "}
                          {new Date(o.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="text-xs md:text-base border border-blue-300 text-black md:px-4 md:py-2 px-3 py-2  rounded-lg hover:bg-blue-500 hover:text-white transition"
                      >
                        Order Details
                      </button>
                    </div>
                  ))}
                  {orders.length === 0 && <p>You have no orders yet.</p>}
                </div>
              )}
            </div>
          )}

          {/* Order details */}

          <Dialog
            open={!!selectedOrder}
            onClose={() => setSelectedOrder(null)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              Order {selectedOrder?.id} — {selectedOrder?.status}
            </DialogTitle>
            <DialogContent dividers>
              {selectedOrder && (
                <Box>
                  <Typography variant="subtitle2">
                    Customer: {selectedOrder.customer_name}
                  </Typography>
                  <Typography variant="subtitle2">
                    Vendor: {selectedOrder.vendor_name}
                  </Typography>
                  <Typography variant="subtitle2">
                    Placed:{" "}
                    {new Date(selectedOrder.created_at).toLocaleString()}
                  </Typography>
                  <Typography variant="subtitle2">
                    Customer Phone: {selectedOrder.customer_phone}
                  </Typography>
                  <Typography variant="subtitle2">
                    Vendor Phone: {selectedOrder.vendor_phone}
                  </Typography>
                  <Typography variant="subtitle2">
                    Location: {selectedOrder.location}
                  </Typography>
                  <Typography variant="subtitle2">
                    Total: GHC{selectedOrder.total_price.toFixed(2)}
                  </Typography>
                  <Typography variant="subtitle2">
                    Payment: {selectedOrder.payment_status}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Items
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Qty</TableCell>
                        <TableCell>Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.items.map((it) => (
                        <TableRow key={it.id}>
                          <TableCell>{it.product_name}</TableCell>
                          <TableCell>{it.quantity}</TableCell>
                          <TableCell>{Math.round(it.price)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedOrder(null)}>Close</Button>
            </DialogActions>
          </Dialog>

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
                    <div
                      key={b.id}
                      className="p-4 border rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <div className="flex flex-col sm:flex-col justify-between mb-2">
                          <span>Booking #{b.id}</span>
                          <span className="font-medium">{b.status}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Service: {b.service_name} • Date: {b.date} @ {b.time}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="text-xs md:text-base border border-blue-300 text-black md:px-4 md:py-2 px-3 py-2  rounded-lg hover:bg-blue-500 hover:text-white transition"
                      >
                        Booking Details
                      </button>
                    </div>
                  ))}
                  {bookings.length === 0 && <p>You have no bookings yet.</p>}
                </div>
              )}
            </div>
          )}
          {/* Booking details */}
          <Dialog
            open={!!selectedBooking}
            onClose={() => setSelectedBooking(null)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              Booking {selectedBooking?.id} — {selectedBooking?.status}
            </DialogTitle>
            <DialogContent dividers>
              {selectedBooking && (
                <Box>
                  <Typography variant="subtitle2">
                    Customer: {selectedBooking.user_name}
                  </Typography>
                  <Typography variant="subtitle2">
                    Vendor: {selectedBooking.vendor_name}
                  </Typography>
                  <Typography variant="subtitle2">
                    Customer Phone: {selectedBooking.user_phone}
                  </Typography>
                  <Typography variant="subtitle2">
                    Vendor Phone: {selectedBooking.vendor_phone}
                  </Typography>
                  <Typography variant="subtitle2">
                    Location: {selectedBooking.location}
                  </Typography>
                  <Typography variant="subtitle2">
                    Date: {selectedBooking.date} @ {selectedBooking.time}
                  </Typography>

                  <Typography variant="subtitle2">
                    Payment: {selectedBooking.status}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedBooking(null)}>Close</Button>
            </DialogActions>
          </Dialog>
        </section>
      </div>
    </main>
  );
};

export default Account;

export const ProfileForm: React.FC = () => {
  const { data: profile, isLoading } = useGetUserProfileQuery();
  const [updateUser, { isLoading: saving }] = useUpdateUserProfileMutation();

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (profile) {
      setUserForm({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        address: String(profile.address),
      });
    }
  }, [profile]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUserForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    try {
      await updateUser(userForm).unwrap();
      toast.success("Profile Updated successfully");
    } catch (error: any) {
      toast.error(error.data.message || "Error Updating profile");
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <>
      <h2 className="text-xl font-semibold text-red-600 mb-4">
        Edit Your Profile
      </h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={userForm.name}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg p-2 bg-gray-100 focus:ring-red-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="someone@gmail.com"
              value={userForm.email}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg p-2 bg-gray-100 focus:ring-red-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              placeholder="123-456-789"
              value={userForm.phone}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg p-2 bg-gray-100 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              placeholder="Your address"
              value={userForm.address}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg p-2 bg-gray-100 focus:ring-red-500"
            />
          </div>
        </div>
        {/* <div className="space-y-4">
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
        </div> */}
        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </div>
    </>
  );
};
