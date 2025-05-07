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
  Select,
  MenuItem,
  Box,
  Snackbar,
  Alert,
  Typography,
  Skeleton,
} from "@mui/material";
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
  const isAdmin =
    user?.is_superuser || user?.is_staff || user?.user_type === "ADMIN";

  const {
    data: allBookings = [],
    isLoading: allLoading,
    isError: error1,
  } = useGetBookingsQuery();
  const {
    data: vendorBookings = [],
    isLoading: vendorLoading,
    isError: error2,
  } = useGetVendorBookingsQuery(user?.id || 0, { skip: !user });

  const bookings = isAdmin ? allBookings : vendorBookings;
  const isLoading = isAdmin ? allLoading : vendorLoading;
  const isError = isAdmin ? error1 : error2;

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

  if (isLoading) {
    return (
      <Box p={6}>
        <Box mb={2} display="flex" gap={2}>
          {[1, 2].map((i) => (
            <Skeleton variant="rectangular" width="100%" height={80} key={i} />
          ))}
        </Box>
        <Skeleton variant="rectangular" height={40} />
        <Box mt={2}>
          {[...Array(5)].map((_, idx) => (
            <Skeleton
              key={idx}
              variant="rectangular"
              height={40}
              sx={{ mb: 1 }}
            />
          ))}
        </Box>
      </Box>
    );
  }
  if (isError)
    return (
      <Box p={4} color="error.main">
        Error loading Bookings
      </Box>
    );

  return (
    <Box p={4}>
      {!bookings || bookings.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={8}
          m={4}
          borderRadius={2}
          boxShadow={3}
          bgcolor="background.paper"
        >
          <Box mb={2}>
            <Typography variant="h1" color="text.disabled">
              🛒
            </Typography>
          </Box>
          <Typography variant="h6" gutterBottom>
            No Bookings Found
          </Typography>
          <Typography color="text.secondary" mb={2}>
            There are no bookings to display right now.
          </Typography>
        </Box>
      ) : (
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
      )}
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
