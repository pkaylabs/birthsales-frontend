// import React from "react";
import { useAppSelector } from "@/redux";
import {
  Booking,
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import React, { useMemo, useState } from "react";

export default function Bookings() {
  const [currentPage, setCurrentPage] = useState(0);
  const PAGE_SIZE = 10; // Number of bookings per page
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

  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState<Booking | null>(null);

  const totalBookings = allBookings.length;
  const totalPages = Math.ceil(totalBookings / PAGE_SIZE);

  const startIndex = currentPage * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return allBookings;
    return allBookings.filter(
      (b) =>
        b.user_name.toLowerCase().includes(term) ||
        b.service_name.toLowerCase().includes(term) ||
        b.vendor_name?.toLowerCase().includes(term)
    );
  }, [allBookings, search]);

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

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Bookings
      </Typography>

      <Box mb={2}>
        <TextField
          fullWidth
          placeholder="Filter names, services, vendors..."
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>
      {filtered.length > 0 ? (
        <Typography variant="subtitle1" color="text.secondary" mb={2}>
          Found {filtered.length} booking{filtered.length > 1 ? "s" : ""}
        </Typography>
      ) : (
        <Typography variant="subtitle1" color="text.secondary" mb={2}>
          No bookings match your search criteria.
        </Typography>
      )}

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
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.slice(startIndex, endIndex).map((b) => (
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
                <TableCell>
                  <Button size="small" onClick={() => setSelected(b)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div
        className="pagination"
        style={{ marginTop: 16, textAlign: "center" }}
      >
        {Array.from({ length: totalPages }, (_, page) => (
          <Button
            key={page}
            variant={currentPage === page ? "contained" : "outlined"}
            onClick={() => setCurrentPage(page)}
            sx={{
              m: 0.5,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {page + 1}
          </Button>
        ))}
      </div>

      {/* Detail Dialog */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Booking {selected?.id} — {selected?.status}
        </DialogTitle>
        <DialogContent dividers>
          {selected && (
            <Box>
              <Typography variant="subtitle2">
                UserID: {selected.user}
              </Typography>
              <Typography variant="subtitle2">
                Placed: {new Date(selected.date).toLocaleString()}
              </Typography>
              <Typography variant="subtitle2">
                User: {selected.user_name}
              </Typography>
              <Typography variant="subtitle2">
                Service: {selected.service_name}
                {selected.vendor_name && ` by ${selected.vendor_name}`}
              </Typography>
              <Typography variant="subtitle2">Time: {selected.time}</Typography>
              <Typography variant="subtitle2">
                Status: {selected.status}
              </Typography>
              <Typography variant="subtitle2">
                Created At: {new Date(selected.created_at).toLocaleString()}
              </Typography>
              <Typography variant="subtitle2">
                Updated At: {new Date(selected.updated_at).toLocaleString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
        </DialogActions>
      </Dialog>

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
