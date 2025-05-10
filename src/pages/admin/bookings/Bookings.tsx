// import React from "react";
import { useAppSelector } from "@/redux";
import {
  useGetBookingsQuery,
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
import React from "react";

export default function Bookings() {
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin =
    user?.is_staff || user?.is_superuser || user?.user_type === "ADMIN";
  const {
    data: allBookings = [],
    isLoading: allLoading,
    isError: errorAll,
  } = useGetBookingsQuery();

  const [updateBooking] = useUpdateBookingMutation();
  const [toast, setToast] = React.useState<{
    open: boolean;
    msg: string;
    severity: "success" | "error";
  }>({ open: false, msg: "", severity: "success" });

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const res = await updateBooking({ booking: id, status }).unwrap();
      setToast({
        open: true,
        msg: res?.message || "Booking Updated Successfully",
        severity: "success",
      });
    } catch (err: any) {
      setToast({
        open: true,
        msg: err?.data?.message || "Update failed",
        severity: "error",
      });
    }
  };

  if (allLoading) {
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

  if (errorAll) {
    return (
      <Box p={4} color="error.main">
        Error loading bookings.
      </Box>
    );
  }

  if (allBookings.length === 0) {
    return (
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
        <Typography variant="h1" color="text.disabled">
          🛒
        </Typography>
        <Typography variant="h6" gutterBottom>
          No bookings found
        </Typography>
        <Typography color="text.secondary">
          There are no bookings to display right now.
        </Typography>
      </Box>
    );
  }

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
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allBookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.id}</TableCell>
                {isAdmin && <TableCell>{b.vendor_name}</TableCell>}
                <TableCell>{b.user_name}</TableCell>
                <TableCell>{b.service_name}</TableCell>
                <TableCell>{new Date(b.date).toLocaleDateString()}</TableCell>
                <TableCell>{b.time}</TableCell>
                <TableCell>
                  <Select
                    value={b.status}
                    onChange={(e) =>
                      handleStatusChange(b.id, e.target.value as string)
                    }
                    size="small"
                  >
                    {["Pending", "Confirmed", "Cancelled", "Completed"].map(
                      (s) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
