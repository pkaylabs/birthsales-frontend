import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";

import { useGetPaymentsQuery } from "@/redux/features/payments/paymentsApi";
import type { PaymentRecord } from "@/redux/features/payments/paymentsApi";
import { usePaystackCheckStatusMutation } from "@/redux/features/orders/orderApiSlice";

function formatDate(iso: unknown): string {
  const value = typeof iso === "string" ? iso : String(iso ?? "");
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function extractErrorMessage(err: unknown, fallback: string): string {
  if (!err) return fallback;
  if (typeof err === "string") return err;
  if (typeof err === "object" && err !== null) {
    const maybe = err as { data?: unknown; error?: unknown; message?: unknown };

    if (typeof maybe.message === "string" && maybe.message.trim()) return maybe.message;
    if (typeof maybe.error === "string" && maybe.error.trim()) return maybe.error;

    if (typeof maybe.data === "string" && maybe.data.trim()) return maybe.data;
    if (typeof maybe.data === "object" && maybe.data !== null) {
      const dataObj = maybe.data as { message?: unknown; detail?: unknown };
      if (typeof dataObj.message === "string" && dataObj.message.trim()) return dataObj.message;
      if (typeof dataObj.detail === "string" && dataObj.detail.trim()) return dataObj.detail;
    }
  }
  return fallback;
}

function isPendingStatus(status: unknown): boolean {
  const s = String(status ?? "");
  return /pending/i.test(s);
}

function isPaystack(method: unknown): boolean {
  const m = String(method ?? "");
  return /paystack/i.test(m);
}

function normalize(value: unknown): string {
  return String(value ?? "").toLowerCase();
}

function formatMoney(value: unknown): string {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return "-";
  return `GHC${num}`;
}

function formatBoolean(value: unknown): string {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "-";
}

function safeText(value: unknown): string {
  const v = value == null ? "" : String(value);
  return v.trim() ? v : "-";
}

export default function PaymentsPage() {
  const { data, isLoading, isError, refetch } = useGetPaymentsQuery();
  const payments = useMemo(
    () => (Array.isArray(data) ? data : []),
    [data]
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [methodFilter, setMethodFilter] = useState<string>("ALL");

  const availableStatuses = useMemo(() => {
    const set = new Set<string>();
    for (const p of payments) {
      const s = String(p.status ?? "").trim();
      if (s) set.add(s);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [payments]);

  const availableMethods = useMemo(() => {
    const set = new Set<string>();
    for (const p of payments) {
      const m = String(p.payment_method ?? "").trim();
      if (m) set.add(m);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [payments]);

  const filteredPayments = useMemo(() => {
    const term = normalize(searchTerm).trim();
    return payments.filter((p) => {
      if (statusFilter !== "ALL" && String(p.status) !== statusFilter) return false;
      if (methodFilter !== "ALL" && String(p.payment_method) !== methodFilter) return false;

      if (!term) return true;

      const haystack = [
        p.payment_id,
        p.customer_name,
        p.vendor_name,
        p.what_was_paid_for,
        p.reason,
        p.status,
        p.payment_method,
      ]
        .map(normalize)
        .join(" ");

      return haystack.includes(term);
    });
  }, [payments, searchTerm, statusFilter, methodFilter]);

  const [selected, setSelected] = useState<PaymentRecord | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const [checkPaystackStatus, { isLoading: statusLoading }] =
    usePaystackCheckStatusMutation();
  const [checkingRef, setCheckingRef] = useState<string | null>(null);

  const openView = (p: PaymentRecord) => {
    setSelected(p);
    setViewOpen(true);
  };

  const closeView = () => {
    setViewOpen(false);
    setSelected(null);
  };

  const handleCheckStatus = async (payment: PaymentRecord) => {
    const reference = String(payment.payment_id ?? "").trim();
    if (!reference) {
      toast.error("Missing payment reference");
      return;
    }

    try {
      setCheckingRef(reference);
      const res = await checkPaystackStatus({ reference }).unwrap();

      if (String(res.status).toLowerCase() === "success") {
        toast.success(res.message || "Payment confirmed");
      } else {
        toast(res.message || `Payment status: ${res.status || "unknown"}`);
      }
    } catch (err) {
      toast.error(extractErrorMessage(err, "Failed to check payment status"));
    } finally {
      setCheckingRef(null);
    }
  };

  if (isLoading) {
    return (
      <Box className="p-6">
        <Typography variant="h6" sx={{ mb: 2 }}>
          Payments
        </Typography>
        <Box className="flex items-center gap-3">
          <CircularProgress size={20} />
          <Typography>Loading payments...</Typography>
        </Box>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className="p-6">
        <Typography variant="h6" sx={{ mb: 2 }}>
          Payments
        </Typography>
        <Typography color="error" sx={{ mb: 2 }}>
          Failed to load payments.
        </Typography>
        <Button variant="contained" onClick={() => refetch()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box className="p-6">
      <Box className="flex items-center justify-between mb-4">
        <Typography variant="h6">Payments</Typography>
      </Box>

      <Box className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <TextField
          label="Search"
          placeholder="Search by customer, vendor, payment id..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          fullWidth
        />

        <FormControl size="small" fullWidth>
          <InputLabel id="payments-status-label">Status</InputLabel>
          <Select
            labelId="payments-status-label"
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(String(e.target.value))}
          >
            <MenuItem value="ALL">All</MenuItem>
            {availableStatuses.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" fullWidth>
          <InputLabel id="payments-method-label">Method</InputLabel>
          <Select
            labelId="payments-method-label"
            label="Method"
            value={methodFilter}
            onChange={(e) => setMethodFilter(String(e.target.value))}
          >
            <MenuItem value="ALL">All</MenuItem>
            {availableMethods.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="payments table">
          <TableHead>
            <TableRow>
              <TableCell>Payment ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <Typography>No payments found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((p) => {
                const pending = isPendingStatus(p.status);
                const canCheck = pending && isPaystack(p.payment_method);
                const isThisChecking = statusLoading && checkingRef === String(p.payment_id);

                return (
                  <TableRow key={p.id} hover>
                    <TableCell>{p.payment_id}</TableCell>
                    <TableCell>
                      {p.customer_name || p.user_detail?.name || p.user_detail?.email || "-"}
                    </TableCell>
                    <TableCell>{p.vendor_name || "-"}</TableCell>
                    <TableCell>{formatMoney(p.total_amount ?? p.amount)}</TableCell>
                    <TableCell>{String(p.payment_method ?? "-")}</TableCell>
                    <TableCell>{String(p.status ?? "-")}</TableCell>
                    <TableCell>{formatDate(p.created_at)}</TableCell>
                    <TableCell align="right">
                      <Box className="flex justify-end gap-2">
                        {canCheck && (
                          <Button
                            size="small"
                            variant="contained"
                            disabled={statusLoading}
                            onClick={() => handleCheckStatus(p)}
                          >
                            {isThisChecking ? "Checking..." : "Check status"}
                          </Button>
                        )}
                        <Button size="small" variant="outlined" onClick={() => openView(p)}>
                          View
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={viewOpen} onClose={closeView} fullWidth maxWidth="md">
        <DialogTitle>
          Payment Details{selected?.payment_id ? ` — ${selected.payment_id}` : ""}
        </DialogTitle>
        <DialogContent dividers>
          {!selected ? (
            <Typography>No payment selected.</Typography>
          ) : (
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Customer
                </Typography>
                <Typography variant="body2" className="break-words">
                  {safeText(selected.customer_name)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Vendor
                </Typography>
                <Typography variant="body2" className="break-words">
                  {safeText(selected.vendor_name)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Amount
                </Typography>
                <Typography variant="body2" className="break-words">
                  {formatMoney(selected.total_amount ?? selected.amount)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  What was paid for
                </Typography>
                <Typography variant="body2" className="break-words">
                  {safeText(selected.what_was_paid_for)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Reason
                </Typography>
                <Typography variant="body2" className="break-words">
                  {safeText(selected.reason)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Payment method
                </Typography>
                <Typography variant="body2" className="break-words">
                  {safeText(selected.payment_method)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Payment type
                </Typography>
                <Typography variant="body2" className="break-words">
                  {safeText(selected.payment_type)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
                <Typography variant="body2" className="break-words">
                  {safeText(selected.status)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Status code
                </Typography>
                <Typography variant="body2" className="break-words">
                  {safeText(selected.status_code)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Booking
                </Typography>
                <Typography variant="body2" className="break-words">
                  {safeText(selected.booking)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Order
                </Typography>
                <Typography variant="body2" className="break-words">
                  {safeText(selected.order)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Subscription
                </Typography>
                <Typography variant="body2" className="break-words">
                  {safeText(selected.subscription)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Vendor
                </Typography>
                <Typography variant="body2" className="break-words">
                  {safeText(selected.vendor_name || selected.vendor)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Vendor credited/debited
                </Typography>
                <Typography variant="body2" className="break-words">
                  {formatBoolean(selected.vendor_credited_debited ?? selected.credited_debited_vendor)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Subscription effects applied
                </Typography>
                <Typography variant="body2" className="break-words">
                  {formatBoolean(selected.subscription_effects_applied)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Created at
                </Typography>
                <Typography variant="body2" className="break-words">
                  {formatDate(selected.created_at)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Updated at
                </Typography>
                <Typography variant="body2" className="break-words">
                  {selected.updated_at ? formatDate(selected.updated_at) : "-"}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {selected && isPendingStatus(selected.status) && isPaystack(selected.payment_method) && (
            <Button
              variant="contained"
              onClick={() => handleCheckStatus(selected)}
              disabled={statusLoading}
            >
              {statusLoading && checkingRef === String(selected.payment_id)
                ? "Checking..."
                : "Check status"}
            </Button>
          )}
          <Button onClick={closeView}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
