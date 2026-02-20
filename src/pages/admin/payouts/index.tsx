import React, { ChangeEvent, useMemo, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useGetVendorsQuery } from "@/redux/features/vendor/vendorApiSlice";
import {
  useApprovePayoutMutation,
  useBulkApprovePayoutsMutation,
  useGetPayoutsQuery,
} from "@/redux/features/payouts/payoutsApi";
import type { Payout, Vendor } from "@/redux/type";

function formatDate(iso: unknown): string {
  const value = typeof iso === "string" ? iso : String(iso ?? "");
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function getApiErrorMessage(err: unknown): string {
  if (!err) return "Request failed";
  if (typeof err === "string") return err;
  if (typeof err === "object" && err !== null) {
    const maybe = err as { data?: unknown; error?: unknown; message?: unknown };
    if (typeof maybe.message === "string" && maybe.message.trim()) return maybe.message;

    if (typeof maybe.data === "string" && maybe.data.trim()) return maybe.data;

    if (typeof maybe.data === "object" && maybe.data !== null) {
      const dataObj = maybe.data as { message?: unknown; detail?: unknown };
      if (typeof dataObj.message === "string" && dataObj.message.trim()) return dataObj.message;
      if (typeof dataObj.detail === "string" && dataObj.detail.trim()) return dataObj.detail;
    }

    if (typeof maybe.error === "string" && maybe.error.trim()) return maybe.error;
  }
  return "Request failed";
}

export default function PayoutsPage() {
  const {
    data: payoutsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetPayoutsQuery();

  const payouts = useMemo(() => (Array.isArray(payoutsData) ? payoutsData : []), [payoutsData]);

  const { data: vendorsData, isLoading: vendorsLoading } = useGetVendorsQuery();
  const vendors = useMemo(
    () => (Array.isArray(vendorsData) ? vendorsData : []),
    [vendorsData]
  );

  const [approvePayout, { isLoading: approvingSingle }] = useApprovePayoutMutation();
  const [bulkApprove, { isLoading: approvingBulk }] = useBulkApprovePayoutsMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">("success");

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);

  const [bulkOpen, setBulkOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return payouts;
    return payouts.filter((p) => {
      const vendorName = String(p.vendor_name ?? "").toLowerCase();
      return vendorName.includes(term) || String(p.id).includes(term) || String(p.payout_status ?? "").toLowerCase().includes(term);
    });
  }, [payouts, searchTerm]);

  const paginated = useMemo(() => {
    return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const openDetails = (p: Payout) => {
    setSelectedPayout(p);
    setDetailsOpen(true);
  };

  const handleApproveSingle = async (payoutId: number) => {
    try {
      await approvePayout({ payout_id: payoutId, action: "approve" }).unwrap();
      setToastSeverity("success");
      setToastMessage("Payout approved");
      refetch();
    } catch (err) {
      setToastSeverity("error");
      setToastMessage(getApiErrorMessage(err));
    } finally {
      setToastOpen(true);
    }
  };

  const handleBulkApprove = async () => {
    if (!selectedVendor?.vendor_id) {
      setToastSeverity("error");
      setToastMessage("Please select a vendor");
      setToastOpen(true);
      return;
    }

    try {
      await bulkApprove({ vendor_id: selectedVendor.vendor_id }).unwrap();
      setToastSeverity("success");
      setToastMessage("Bulk approval submitted");
      setBulkOpen(false);
      setSelectedVendor(null);
      refetch();
    } catch (err) {
      setToastSeverity("error");
      setToastMessage(getApiErrorMessage(err));
    } finally {
      setToastOpen(true);
    }
  };

  const canApprove = (p: Payout) => {
    const status = String(p.payout_status ?? "").toUpperCase();
    return status === "PENDING";
  };

  if (isLoading) {
    return (
      <Box p={6}>
        <Typography variant="h6">Loading payouts…</Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Payouts</Typography>
        <Button variant="contained" onClick={() => setBulkOpen(true)}>
          Bulk Approval
        </Button>
      </Box>

      <Box mb={2} display="flex" gap={2} alignItems="center">
        <TextField
          size="small"
          placeholder="Search payouts…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 320 }}
        />
        <Button variant="outlined" onClick={() => refetch()} disabled={isFetching}>
          Refresh
        </Button>
      </Box>

      {isFetching && <LinearProgress sx={{ mb: 2 }} />}

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {getApiErrorMessage(error)}
        </Alert>
      )}

      {filtered.length === 0 ? (
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
          <Typography variant="h6" gutterBottom>
            No Payouts Found
          </Typography>
          <Typography color="text.secondary">
            There are no payouts to display right now.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Payout Status</TableCell>
                <TableCell>Settled</TableCell>
                <TableCell>Date Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.vendor_name}</TableCell>
                  <TableCell>{p.amount}</TableCell>
                  <TableCell>{p.payment_status}</TableCell>
                  <TableCell>{p.payout_status}</TableCell>
                  <TableCell>{p.is_settled ? "Yes" : "No"}</TableCell>
                  <TableCell>{formatDate(p.created_at)}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => openDetails(p)}>
                      View
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={!canApprove(p) || approvingSingle}
                      onClick={() => handleApproveSingle(p.id)}
                      sx={{ ml: 1 }}
                    >
                      Approve
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Details modal */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Payout Details</DialogTitle>
        <DialogContent>
          {selectedPayout ? (
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <Box display="flex" justifyContent="space-between" gap={2} flexWrap="wrap">
                <Typography variant="body2">
                  <strong>ID:</strong> {selectedPayout.id}
                </Typography>
                <Typography variant="body2">
                  <strong>Vendor:</strong> {selectedPayout.vendor_name}
                </Typography>
                <Typography variant="body2">
                  <strong>Amount:</strong> {selectedPayout.amount}
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong> {selectedPayout.payout_status}
                </Typography>
              </Box>

              <Typography variant="h6">Items</Typography>
              {selectedPayout.items?.length ? (
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Qty</TableCell>
                        <TableCell>Unit Price</TableCell>
                        <TableCell>Line Total</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedPayout.items.map((it) => (
                        <TableRow key={it.id}>
                          <TableCell>{it.product_name}</TableCell>
                          <TableCell>{it.quantity}</TableCell>
                          <TableCell>{it.unit_price}</TableCell>
                          <TableCell>{it.line_total}</TableCell>
                          <TableCell>{formatDate(it.created_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="text.secondary">No items.</Typography>
              )}
            </Box>
          ) : (
            <Typography color="text.secondary">No payout selected.</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Bulk approval modal */}
      <Dialog open={bulkOpen} onClose={() => setBulkOpen(false)} fullWidth>
        <DialogTitle>Bulk Approval</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <Autocomplete
              options={vendors}
              loading={vendorsLoading}
              value={selectedVendor}
              onChange={(_, value) => setSelectedVendor(value)}
              getOptionLabel={(option) => `${option.vendor_name} (${option.vendor_id})`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Vendor"
                  placeholder="Search vendor…"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {vendorsLoading ? <CircularProgress color="inherit" size={18} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            <Typography variant="body2" color="text.secondary">
              This will approve all eligible payouts for the selected vendor.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setBulkOpen(false)} disabled={approvingBulk}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleBulkApprove}
            disabled={approvingBulk || !selectedVendor}
          >
            {approvingBulk ? "Approving…" : "Approve"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} sx={{ width: "100%" }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
