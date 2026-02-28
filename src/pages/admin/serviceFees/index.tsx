import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Skeleton,
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
import type { ServiceFee } from "@/redux/type";
import {
  ServiceFeeCreateRequest,
  ServiceFeeType,
  ServiceFeeUpdateRequest,
  useAddServiceFeeMutation,
  useDeleteServiceFeeMutation,
  useGetServiceFeesQuery,
  useUpdateServiceFeeMutation,
} from "@/redux/features/serviceFees/serviceFeesApi";

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString();
}

const SERVICE_FEE_TYPES: Array<{ value: ServiceFeeType; label: string }> = [
  { value: "PERCENTAGE", label: "Percentage" },
  { value: "FLAT", label: "Flat" },
];

function feeTypeLabel(type: string) {
  const normalized = String(type || "").toUpperCase();
  if (normalized === "PERCENTAGE") return "Percentage";
  if (normalized === "FLAT") return "Flat";
  return type;
}

export default function ServiceFeesPage() {
  const {
    data: serviceFees = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetServiceFeesQuery();

  const [addServiceFee, { isLoading: adding }] = useAddServiceFeeMutation();
  const [updateServiceFee, { isLoading: updating }] =
    useUpdateServiceFeeMutation();
  const [deleteServiceFee] = useDeleteServiceFeeMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | ServiceFeeType>("ALL");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success"
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceFee | null>(null);

  const [createForm, setCreateForm] = useState<ServiceFeeCreateRequest>({
    fee_type: "PERCENTAGE",
    value: "",
    is_active: true,
  });

  const [editFeeType, setEditFeeType] = useState<ServiceFeeType>("PERCENTAGE");
  const [editValue, setEditValue] = useState<string>("");
  const [editIsActive, setEditIsActive] = useState<boolean>(true);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const byType =
      typeFilter === "ALL"
        ? serviceFees
        : serviceFees.filter(
            (s) => String(s.fee_type).toUpperCase() === typeFilter
          );

    if (!term) return byType;

    return byType.filter(
      (s) =>
        String(s.fee_type).toLowerCase().includes(term) ||
        String(feeTypeLabel(String(s.fee_type))).toLowerCase().includes(term) ||
        String(s.value).toLowerCase().includes(term) ||
        (s.is_active ? "active" : "inactive").includes(term)
    );
  }, [serviceFees, searchTerm, typeFilter]);

  const paginated = useMemo(() => {
    return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const openAdd = () => {
    setEditing(null);
    setCreateForm({ fee_type: "PERCENTAGE", value: "", is_active: true });
    setEditFeeType("PERCENTAGE");
    setEditValue("");
    setEditIsActive(true);
    setDialogOpen(true);
  };

  const openEdit = (fee: ServiceFee) => {
    setEditing(fee);
    setEditFeeType((fee.fee_type as ServiceFeeType) ?? "PERCENTAGE");
    setEditValue(String(fee.value ?? ""));
    setEditIsActive(Boolean(fee.is_active));
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        const payload: ServiceFeeUpdateRequest = {
          id: editing.id,
          fee_type: editFeeType,
          value: String(editValue),
          is_active: Boolean(editIsActive),
        };
        await updateServiceFee(payload).unwrap();
        setToastMessage("Service fee updated successfully");
      } else {
        await addServiceFee({
          fee_type: createForm.fee_type,
          value: String(createForm.value),
          is_active: Boolean(createForm.is_active),
        }).unwrap();
        setToastMessage("Service fee created successfully");
      }

      setToastSeverity("success");
      setDialogOpen(false);
      setEditing(null);
      refetch();
    } catch (e: any) {
      setToastSeverity("error");
      setToastMessage(e?.data?.message || "Failed to save service fee");
    } finally {
      setToastOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteServiceFee(id).unwrap();
      setToastSeverity("success");
      setToastMessage("Service fee deleted");
      refetch();
    } catch (e: any) {
      setToastSeverity("error");
      setToastMessage(e?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
      setToastOpen(true);
    }
  };

  useEffect(() => {
    if (!isError || !error || !("data" in error)) return;
    const err = error as {
      status: number;
      data: { message?: string; [key: string]: any };
    };

    const message =
      err?.data?.message ||
      (typeof err.data === "string"
        ? err.data
        : "Failed to fetch service fees");

    setToastSeverity("error");
    setToastMessage(message);
    setToastOpen(true);
  }, [isError, error]);

  if (isLoading) {
    return (
      <Box p={6}>
        <Box mb={2} display="flex" gap={2}>
          {[1, 2].map((i) => (
            <Skeleton variant="rectangular" width="100%" height={80} key={i} />
          ))}
        </Box>
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Service Fees</Typography>
        <Button variant="contained" onClick={openAdd}>
          Add Service Fee
        </Button>
      </Box>

      <Box mb={2} display="flex" gap={2} alignItems="center">
        <TextField
          size="small"
          placeholder="Search service fees…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 320 }}
        />

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="servicefee-filter-type">Type</InputLabel>
          <Select
            labelId="servicefee-filter-type"
            label="Type"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as "ALL" | ServiceFeeType);
              setPage(0);
            }}
          >
            <MenuItem value="ALL">All</MenuItem>
            {SERVICE_FEE_TYPES.map((t) => (
              <MenuItem key={t.value} value={t.value}>
                {t.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="outlined" onClick={() => refetch()} disabled={isFetching}>
          Refresh
        </Button>
      </Box>

      {isFetching && <LinearProgress sx={{ mb: 2 }} />}

      {!filtered || filtered.length === 0 ? (
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
            No Service Fees Found
          </Typography>
          <Typography color="text.secondary" mb={2}>
            There are no service fees to display right now.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Date Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{feeTypeLabel(String(s.fee_type))}</TableCell>
                  <TableCell>{s.value}</TableCell>
                  <TableCell>{s.is_active ? "Yes" : "No"}</TableCell>
                  <TableCell>{formatDate(s.created_at)}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => openEdit(s)}>
                      Edit
                    </Button>
                    {deletingId === s.id ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Button color="error" onClick={() => handleDelete(s.id)}>
                        Delete
                      </Button>
                    )}
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogTitle>{editing ? "Edit Service Fee" : "Add Service Fee"}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <FormControl fullWidth>
              <InputLabel id="servicefee-type">Fee Type</InputLabel>
              <Select
                labelId="servicefee-type"
                label="Fee Type"
                value={editing ? editFeeType : createForm.fee_type}
                onChange={(e) => {
                  const value = e.target.value as ServiceFeeType;
                  if (editing) setEditFeeType(value);
                  else setCreateForm((f) => ({ ...f, fee_type: value }));
                }}
              >
                {SERVICE_FEE_TYPES.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Value"
              type="number"
              value={editing ? editValue : createForm.value}
              onChange={(e) => {
                const value = e.target.value;
                if (editing) setEditValue(value);
                else setCreateForm((f) => ({ ...f, value }));
              }}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel id="servicefee-active">Active</InputLabel>
              <Select
                labelId="servicefee-active"
                label="Active"
                value={editing ? String(editIsActive) : String(createForm.is_active)}
                onChange={(e) => {
                  const value = String(e.target.value) === "true";
                  if (editing) setEditIsActive(value);
                  else setCreateForm((f) => ({ ...f, is_active: value }));
                }}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={
              adding ||
              updating ||
              (editing
                ? !String(editValue).trim()
                : !String(createForm.value).trim())
            }
          >
            {adding || updating ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity={toastSeverity}
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
