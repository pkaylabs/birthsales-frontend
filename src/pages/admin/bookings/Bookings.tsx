import React from "react";
import { RootState } from "@/app/store";
import {
  useGetBookingsQuery,
  useGetVendorBookingsQuery,
  useUpdateBookingMutation,
} from "@/redux/features/bookings/bookingsApiSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
// import ShimmerTable from "../components/Shimmer";
// import { fromPairs } from "lodash";
import { useAppSelector } from "@/redux";

type Booking = {
  id: number;
  user: number;
  service: number;
  date: string;
  status: string;
  vendor: number;
};

export default function Bookings() {
  const user = useAppSelector((s: RootState) => s.auth.user);
  const isAdmin = user?.user_type === "ADMIN";

  const { data: allBookings = [], isLoading: allLoading } =
    useGetBookingsQuery();
  const { data: vendorBookings = [], isLoading: vendorLoading } =
    useGetVendorBookingsQuery(user?.id || 0, { skip: !user });

  const bookings = isAdmin ? allBookings : vendorBookings;
  const isLoading = isAdmin ? allLoading : vendorLoading;

  const [updateBooking] = useUpdateBookingMutation();
  const [toast, setToast] = React.useState<{
    open: boolean;
    msg: string;
    severity: "success" | "error";
  }>({ open: false, msg: "", severity: "success" });

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateBooking({ id, status }).unwrap();
      setToast({ open: true, msg: "Booking updated", severity: "success" });
    } catch {
      setToast({ open: true, msg: "Update failed", severity: "error" });
    }
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Box p={4}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              {isAdmin && <TableCell>Vendor</TableCell>}
              <TableCell>User</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((b: Booking) => (
              <TableRow key={b.id}>
                <TableCell>{b.id}</TableCell>
                {isAdmin && <TableCell>{b.vendor}</TableCell>}
                <TableCell>{b.user}</TableCell>
                <TableCell>{b.service}</TableCell>
                <TableCell>{new Date(b.date).toLocaleString()}</TableCell>
                <TableCell>
                  <Select
                    value={b.status}
                    onChange={(e) => handleStatusChange(b.id, e.target.value)}
                  >
                    {["PENDING", "CONFIRMED", "CANCELLED"].map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>{/* additional actions if needed */}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
