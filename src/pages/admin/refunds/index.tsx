import React, { useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
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

import {
  useCreateRefundMutation,
  useGetRefundsQuery,
  type RefundRecord,
} from "@/redux/features/refunds/refundsApi";
import { useGetPaymentsQuery } from "@/redux/features/payments/paymentsApi";
import type { PaymentRecord } from "@/redux/features/payments/paymentsApi";
import { useGetTelcosQuery } from "@/redux/features/orders/orderApiSlice";

function normalize(value: unknown): string {
  return String(value ?? "").toLowerCase();
}

function safeText(value: unknown): string {
  const v = value == null ? "" : String(value);
  return v.trim() ? v : "-";
}

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

function formatMoney(amount: unknown, currency: unknown): string {
  const cur = String(currency ?? "").trim() || "";
  const num = typeof amount === "number" ? amount : Number(String(amount ?? "").trim());
  if (!Number.isFinite(num)) return cur ? `${cur} -` : "-";
  const prefix = cur ? `${cur} ` : "";
  return `${prefix}${num}`;
}

const DEFAULT_CURRENCY = "GHS";
const DEFAULT_REASON = "Refund";

export default function RefundsPage() {
  const { data, isLoading, isError, refetch } = useGetRefundsQuery();
  const refunds = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const {
    data: paymentsData,
    isLoading: paymentsLoading,
    isError: paymentsError,
    refetch: refetchPayments,
  } = useGetPaymentsQuery();
  const payments = useMemo(
    () => (Array.isArray(paymentsData) ? paymentsData : []),
    [paymentsData]
  );

  const { data: telcosData, isLoading: telcosLoading } = useGetTelcosQuery();
  const telcos = useMemo(() => (Array.isArray(telcosData) ? telcosData : []), [telcosData]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [providerFilter, setProviderFilter] = useState<string>("ALL");

  const availableStatuses = useMemo(() => {
    const set = new Set<string>();
    for (const r of refunds) {
      const s = String(r.status ?? "").trim();
      if (s) set.add(s);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [refunds]);

  const availableProviders = useMemo(() => {
    const set = new Set<string>();
    for (const r of refunds) {
      const p = String(r.provider_code ?? "").trim();
      if (p) set.add(p);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [refunds]);

  const filteredRefunds = useMemo(() => {
    const term = normalize(searchTerm).trim();
    return refunds.filter((r) => {
      if (statusFilter !== "ALL" && String(r.status) !== statusFilter) return false;
      if (providerFilter !== "ALL" && String(r.provider_code) !== providerFilter) return false;

      if (!term) return true;

      const haystack = [
        r.reference,
        r.payment_id,
        r.phone,
        r.provider_code,
        r.currency,
        r.status,
        r.status_code,
        r.refunded_by_name,
        r.refunded_date,
      ]
        .map(normalize)
        .join(" ");

      return haystack.includes(term);
    });
  }, [refunds, searchTerm, statusFilter, providerFilter]);

  const [selected, setSelected] = useState<RefundRecord | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const openView = (r: RefundRecord) => {
    setSelected(r);
    setViewOpen(true);
  };

  const closeView = () => {
    setViewOpen(false);
    setSelected(null);
  };

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [phone, setPhone] = useState("");
  const [providerCode, setProviderCode] = useState<string>("");
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [reason, setReason] = useState(DEFAULT_REASON);

  const [createRefund, { isLoading: creating }] = useCreateRefundMutation();

  const resetCreateForm = () => {
    setSelectedPayment(null);
    setPhone("");
    setProviderCode("");
    setCurrency(DEFAULT_CURRENCY);
    setReason(DEFAULT_REASON);
  };

  const openCreate = () => {
    setCreateOpen(true);
  };

  const closeCreate = () => {
    setCreateOpen(false);
    resetCreateForm();
  };

  const paymentOptions = useMemo(() => {
    return payments
      .filter((p) => String(p.payment_id ?? "").trim())
      .slice()
      .sort((a, b) => String(a.payment_id).localeCompare(String(b.payment_id)));
  }, [payments]);

  const providerOptions = useMemo(() => {
    // Prefer backend-provided telcos, fall back to common Ghana networks if empty
    const fromApi = telcos
      .filter((t) => String(t.code ?? "").trim())
      .map((t) => ({ code: String(t.code), name: String(t.name ?? t.code) }));

    if (fromApi.length) {
      const seen = new Set<string>();
      return fromApi.filter((x) => {
        const key = x.code.trim();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    return [
      { code: "MTN", name: "MTN" },
      { code: "VOD", name: "Vodafone" },
      { code: "ATL", name: "AirtelTigo" },
    ];
  }, [telcos]);

  const handleSubmitRefund = async () => {
    const payment_id = String(selectedPayment?.payment_id ?? "").trim();
    const phoneValue = String(phone ?? "").trim();
    const provider = String(providerCode ?? "").trim();
    const currencyValue = String(currency ?? "").trim();
    const reasonValue = String(reason ?? "").trim() || DEFAULT_REASON;

    if (!payment_id) {
      toast.error("Please select a payment");
      return;
    }

    if (!provider) {
      toast.error("Please select a provider");
      return;
    }

    if (!phoneValue) {
      toast.error("Please enter a phone number");
      return;
    }

    if (!currencyValue) {
      toast.error("Please select a currency");
      return;
    }

    try {
      await createRefund({
        payment_id,
        phone: phoneValue,
        provider_code: provider,
        recipient_type: "mobile_money",
        currency: currencyValue,
        reason: reasonValue,
      }).unwrap();

      toast.success("Refund initiated");
      setCreateOpen(false);
      resetCreateForm();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Failed to initiate refund"));
    }
  };

  if (isLoading) {
    return (
      <Box className="p-6">
        <Typography variant="h6" sx={{ mb: 2 }}>
          Refunds
        </Typography>
        <Box className="flex items-center gap-3">
          <CircularProgress size={20} />
          <Typography>Loading refunds...</Typography>
        </Box>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className="p-6">
        <Typography variant="h6" sx={{ mb: 2 }}>
          Refunds
        </Typography>
        <Typography color="error" sx={{ mb: 2 }}>
          Failed to load refunds.
        </Typography>
        <Button variant="contained" onClick={() => refetch()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box className="p-6">
      <Box className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <Typography variant="h6">Refunds</Typography>
        <Button variant="contained" onClick={openCreate}>
          New Refund
        </Button>
      </Box>

      <Box className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <TextField
          label="Search"
          placeholder="Search by reference, payment id, phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          fullWidth
        />

        <FormControl size="small" fullWidth>
          <InputLabel id="refunds-status-label">Status</InputLabel>
          <Select
            labelId="refunds-status-label"
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
          <InputLabel id="refunds-provider-label">Provider</InputLabel>
          <Select
            labelId="refunds-provider-label"
            label="Provider"
            value={providerFilter}
            onChange={(e) => setProviderFilter(String(e.target.value))}
          >
            <MenuItem value="ALL">All</MenuItem>
            {availableProviders.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="refunds table">
          <TableHead>
            <TableRow>
              <TableCell>Reference</TableCell>
              <TableCell>Payment ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Provider</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Refunded by</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRefunds.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <Typography>No refunds found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredRefunds.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>{safeText(r.reference)}</TableCell>
                  <TableCell>{safeText(r.payment_id)}</TableCell>
                  <TableCell>{formatMoney(r.amount, r.currency)}</TableCell>
                  <TableCell>{safeText(r.provider_code)}</TableCell>
                  <TableCell>{safeText(r.phone)}</TableCell>
                  <TableCell>{safeText(r.status)}</TableCell>
                  <TableCell>{safeText(r.refunded_by_name)}</TableCell>
                  <TableCell>{formatDate(r.created_at ?? r.refunded_date)}</TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="outlined" onClick={() => openView(r)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={viewOpen} onClose={closeView} fullWidth maxWidth="md">
        <DialogTitle>
          Refund Details{selected?.reference ? ` — ${selected.reference}` : ""}
        </DialogTitle>
        <DialogContent dividers>
          {!selected ? (
            <Typography>No refund selected.</Typography>
          ) : (
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Reference
                </Typography>
                <Typography variant="body2" className="break-words">
                  {safeText(selected.reference)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Payment ID
                </Typography>
                <Typography variant="body2" className="break-words">
                  {safeText(selected.payment_id)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Amount
                </Typography>
                <Typography variant="body2" className="break-words">
                  {formatMoney(selected.amount, selected.currency)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Currency
                </Typography>
                <Typography variant="body2" className="break-words">
                  {safeText(selected.currency)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Provider
                </Typography>
                <Typography variant="body2" className="break-words">
                  {safeText(selected.provider_code)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body2" className="break-words">
                  {safeText(selected.phone)}
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
                  Refunded by
                </Typography>
                <Typography variant="body2" className="break-words">
                  {safeText(selected.refunded_by_name)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Refunded date
                </Typography>
                <Typography variant="body2" className="break-words">
                  {selected.refunded_date ? formatDate(selected.refunded_date) : "-"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Created at
                </Typography>
                <Typography variant="body2" className="break-words">
                  {selected.created_at ? formatDate(selected.created_at) : "-"}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeView}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={createOpen} onClose={closeCreate} fullWidth maxWidth="sm">
        <DialogTitle>Initiate Refund</DialogTitle>
        <DialogContent dividers>
          <Box className="grid grid-cols-1 gap-4">
            <Autocomplete
              options={paymentOptions}
              value={selectedPayment}
              onChange={(_, value) => setSelectedPayment(value)}
              loading={paymentsLoading}
              getOptionLabel={(opt) => {
                const p = opt as PaymentRecord;
                const id = String(p.payment_id ?? "");
                const customer = String(p.customer_name ?? "").trim();
                const vendor = String(p.vendor_name ?? "").trim();
                const extra = [customer, vendor].filter(Boolean).join(" • ");
                return extra ? `${id} — ${extra}` : id;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Payment"
                  placeholder="Search and select a payment"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {paymentsLoading ? <CircularProgress color="inherit" size={18} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              isOptionEqualToValue={(a, b) => String(a.payment_id) === String(b.payment_id)}
              noOptionsText={
                paymentsError
                  ? "Failed to load payments. Click refresh."
                  : "No payments found"
              }
            />

            {paymentsError && (
              <Box className="flex items-center justify-between gap-3">
                <Typography color="error" variant="body2">
                  Could not load payments.
                </Typography>
                <Button size="small" variant="outlined" onClick={() => refetchPayments()}>
                  Refresh
                </Button>
              </Box>
            )}

            <TextField
              label="Phone"
              placeholder="233500000000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              size="small"
              fullWidth
            />

            <FormControl size="small" fullWidth>
              <InputLabel id="refund-provider-label">Provider</InputLabel>
              <Select
                labelId="refund-provider-label"
                label="Provider"
                value={providerCode}
                onChange={(e) => setProviderCode(String(e.target.value))}
              >
                {telcosLoading ? (
                  <MenuItem value="">
                    <em>Loading providers...</em>
                  </MenuItem>
                ) : (
                  <MenuItem value="">
                    <em>Select provider</em>
                  </MenuItem>
                )}
                {providerOptions.map((p) => (
                  <MenuItem key={p.code} value={p.code}>
                    {p.name} ({p.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel id="refund-currency-label">Currency</InputLabel>
              <Select
                labelId="refund-currency-label"
                label="Currency"
                value={currency}
                onChange={(e) => setCurrency(String(e.target.value))}
              >
                <MenuItem value="GHS">GHS</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Reason"
              placeholder="Refund"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              size="small"
              fullWidth
            />

            <TextField
              label="Recipient Type"
              value="mobile_money"
              size="small"
              fullWidth
              disabled
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCreate} disabled={creating}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmitRefund} disabled={creating}>
            {creating ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
