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
  LocationCreateRequest,
  LocationUpdateRequest,
  useAddLocationMutation,
  useDeleteLocationMutation,
  useGetLocationsQuery,
  useUpdateLocationMutation,
} from "@/redux/features/locations/locationsApi";
import type { Location } from "@/redux/type";

const CATEGORY_OPTIONS = ["HALL", "DEPARTMENT"] as const;
type CategoryOption = (typeof CATEGORY_OPTIONS)[number];

function normalizeCategory(value: string): CategoryOption {
  return (CATEGORY_OPTIONS as readonly string[]).includes(value)
    ? (value as CategoryOption)
    : "HALL";
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString();
}

export default function LocationsPage() {
  const {
    data: locations = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetLocationsQuery();

  const [addLocation, { isLoading: adding }] = useAddLocationMutation();
  const [updateLocation, { isLoading: updating }] = useUpdateLocationMutation();
  const [deleteLocation] = useDeleteLocationMutation();

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
  const [editing, setEditing] = useState<Location | null>(null);
  const [form, setForm] = useState<LocationCreateRequest>({
    name: "",
    category: "HALL",
  });

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return locations;
    return locations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(term) ||
        String(loc.category).toLowerCase().includes(term)
    );
  }, [locations, searchTerm]);

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
    setForm({ name: "", category: "HALL" });
    setDialogOpen(true);
  };

  const openEdit = (loc: Location) => {
    setEditing(loc);
    setForm({
      name: loc.name,
      category: normalizeCategory(loc.category),
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        const payload: LocationUpdateRequest = {
          id: editing.id,
          location_id: editing.id,
          ...form,
        };
        await updateLocation(payload).unwrap();
        setToastMessage("Location updated successfully");
      } else {
        await addLocation(form).unwrap();
        setToastMessage("Location created successfully");
      }

      setToastSeverity("success");
      setDialogOpen(false);
      setEditing(null);
      refetch();
    } catch (e: any) {
      setToastSeverity("error");
      setToastMessage(e?.data?.message || "Failed to save location");
    } finally {
      setToastOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteLocation(id).unwrap();
      setToastSeverity("success");
      setToastMessage("Location deleted");
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
      (typeof err.data === "string" ? err.data : "Failed to fetch locations");

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
        <Typography variant="h5">Locations</Typography>
        <Button variant="contained" onClick={openAdd}>
          Add Location
        </Button>
      </Box>

      <Box mb={2} display="flex" gap={2} alignItems="center">
        <TextField
          size="small"
          placeholder="Search locations…"
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
            No Locations Found
          </Typography>
          <Typography color="text.secondary" mb={2}>
            There are no locations to display right now.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Date Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((loc) => (
                <TableRow key={loc.id}>
                  <TableCell>{loc.name}</TableCell>
                  <TableCell>{loc.category}</TableCell>
                  <TableCell>{formatDate(loc.created_at)}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => openEdit(loc)}>
                      Edit
                    </Button>
                    {deletingId === loc.id ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Button color="error" onClick={() => handleDelete(loc.id)}>
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
        <DialogTitle>{editing ? "Edit Location" : "Add Location"}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel id="location-category">Category</InputLabel>
              <Select
                labelId="location-category"
                label="Category"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    category: normalizeCategory(String(e.target.value)),
                  }))
                }
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {editing && (
              <TextField
                label="Delivery Fee Price"
                type="number"
                value={Number(editing.delivery_fee_price ?? 0)}
                fullWidth
                InputProps={{ readOnly: true }}
                disabled
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={adding || updating || !form.name.trim()}
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
