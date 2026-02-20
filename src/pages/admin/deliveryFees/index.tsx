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
import {
  DeliveryFeeCreateRequest,
  DeliveryFeeUpdateRequest,
  useAddDeliveryFeeMutation,
  useDeleteDeliveryFeeMutation,
  useGetDeliveryFeesQuery,
  useUpdateDeliveryFeeMutation,
} from "@/redux/features/deliveryFees/deliveryFeesApi";
import { useGetLocationsQuery } from "@/redux/features/locations/locationsApi";
import type { DeliveryFee, Location } from "@/redux/type";

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString();
}

export default function DeliveryFeesPage() {
  const {
    data: deliveryFees = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetDeliveryFeesQuery();

  const { data: locations = [], isLoading: locationsLoading } =
    useGetLocationsQuery();

  const [addDeliveryFee, { isLoading: adding }] = useAddDeliveryFeeMutation();
  const [updateDeliveryFee, { isLoading: updating }] =
    useUpdateDeliveryFeeMutation();
  const [deleteDeliveryFee] = useDeleteDeliveryFeeMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success"
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<DeliveryFee | null>(null);

  const [createForm, setCreateForm] = useState<DeliveryFeeCreateRequest>({
    location: 0,
    price: "",
  });

  const [editPrice, setEditPrice] = useState<string>("");

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return deliveryFees;
    return deliveryFees.filter(
      (d) =>
        d.location_name.toLowerCase().includes(term) ||
        String(d.location_category).toLowerCase().includes(term) ||
        String(d.price).toLowerCase().includes(term)
    );
  }, [deliveryFees, searchTerm]);

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
    setCreateForm({ location: 0, price: "" });
    setEditPrice("");
    setDialogOpen(true);
  };

  const openEdit = (fee: DeliveryFee) => {
    setEditing(fee);
    setEditPrice(String(fee.price ?? ""));
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        const payload: DeliveryFeeUpdateRequest = {
          id: editing.id,
          price: String(editPrice),
        };
        await updateDeliveryFee(payload).unwrap();
        setToastMessage("Delivery fee updated successfully");
      } else {
        await addDeliveryFee({
          location: Number(createForm.location),
          price: String(createForm.price),
        }).unwrap();
        setToastMessage("Delivery fee created successfully");
      }

      setToastSeverity("success");
      setDialogOpen(false);
      setEditing(null);
      refetch();
    } catch (e: any) {
      setToastSeverity("error");
      setToastMessage(e?.data?.message || "Failed to save delivery fee");
    } finally {
      setToastOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteDeliveryFee(id).unwrap();
      setToastSeverity("success");
      setToastMessage("Delivery fee deleted");
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
        : "Failed to fetch delivery fees");

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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Delivery Fees</Typography>
        <Button variant="contained" onClick={openAdd}>
          Add Delivery Fee
        </Button>
      </Box>

      <Box mb={2} display="flex" gap={2} alignItems="center">
        <TextField
          size="small"
          placeholder="Search delivery fees…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 320 }}
        />
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
            No Delivery Fees Found
          </Typography>
          <Typography color="text.secondary" mb={2}>
            There are no delivery fees to display right now.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Location</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Date Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.location_name}</TableCell>
                  <TableCell>{d.location_category}</TableCell>
                  <TableCell>{d.price}</TableCell>
                  <TableCell>{formatDate(d.created_at)}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => openEdit(d)}>
                      Edit
                    </Button>
                    {deletingId === d.id ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Button color="error" onClick={() => handleDelete(d.id)}>
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

      {/* Add/Edit dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogTitle>{editing ? "Edit Delivery Fee" : "Add Delivery Fee"}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            {editing ? (
              <>
                <TextField
                  label="Location"
                  value={editing.location_name}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  disabled
                />
                <TextField
                  label="Category"
                  value={editing.location_category}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  disabled
                />
                <TextField
                  label="Price"
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  fullWidth
                />
              </>
            ) : (
              <>
                <FormControl fullWidth disabled={locationsLoading}>
                  <InputLabel id="deliveryfee-location">Location</InputLabel>
                  <Select
                    labelId="deliveryfee-location"
                    label="Location"
                    value={createForm.location}
                    onChange={(e) =>
                      setCreateForm((f) => ({
                        ...f,
                        location: Number(e.target.value),
                      }))
                    }
                  >
                    {locations.map((loc: Location) => (
                      <MenuItem key={loc.id} value={loc.id}>
                        {loc.name} ({loc.category})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Price"
                  type="number"
                  value={createForm.price}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, price: e.target.value }))
                  }
                  fullWidth
                />
              </>
            )}
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
                ? !String(editPrice).trim()
                : !createForm.location || !String(createForm.price).trim())
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
