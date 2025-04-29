import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  CircularProgress,
  DialogContent,
  TablePagination,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-location";

import {
  useGetVendorsQuery,
  useAddVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} from "@/redux/features/vendor/vendorApiSlice";
import type { Vendor, VendorForm } from "@/redux/type";

export default function VendorsPage() {
  const navigate = useNavigate();
  const { data: vendors = [], isLoading, isError } = useGetVendorsQuery();
  const [addVendor] = useAddVendorMutation();
  const [updateVendor] = useUpdateVendorMutation();
  const [deleteVendor] = useDeleteVendorMutation();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [current, setCurrent] = useState<VendorForm>({
    user: 0,
    vendor_name: "",
    vendor_email: "",
    vendor_address: "",
    vendor_phone: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success"
  );

  // Pagination & filtering
  const filtered = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const openAdd = () => {
    setEditMode(false);
    setCurrent({
      user: 0,
      vendor_name: "",
      vendor_email: "",
      vendor_address: "",
      vendor_phone: "",
    });
    setDialogOpen(true);
  };
  const openEdit = (v: Vendor) => {
    setEditMode(true);
    setEditId(v.id);
    setCurrent({
      user: v.user,
      vendor_name: v.name,
      vendor_email: v.email,
      vendor_address: v.address,
      vendor_phone: v.phone,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editMode && editId != null) {
        await updateVendor({ id: editId, ...current } as any).unwrap();
        setToastMsg("Vendor updated");
      } else {
        await addVendor(current as any).unwrap();
        setToastMsg("Vendor added");
      }
      setToastSeverity("success");
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
      setToastMsg("Operation failed");
      setToastSeverity("error");
    } finally {
      setToastOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this vendor?")) return;
    try {
      await deleteVendor(id).unwrap();
      setToastMsg("Vendor deleted");
      setToastSeverity("success");
    } catch (err) {
      console.error(err);
      setToastMsg("Deletion failed");
      setToastSeverity("error");
    } finally {
      setToastOpen(true);
    }
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Box p={4}>
      <Box mb={2} display="flex" justifyContent="space-between">
        <TextField
          placeholder="Search..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="contained" onClick={openAdd}>
          Add Vendor
        </Button>
      </Box>
      {isError ? (
        <Alert severity="error">Error loading vendors</Alert>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>{v.name}</TableCell>
                    <TableCell>{v.email}</TableCell>
                    <TableCell>{v.address}</TableCell>
                    <TableCell>{v.phone}</TableCell>
                    <TableCell>
                      <Button onClick={() => openEdit(v)}>Edit</Button>
                      <Button color="error" onClick={() => handleDelete(v.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(_, p) => setPage(p)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(+e.target.value);
              setPage(0);
            }}
          />
        </>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editMode ? "Edit Vendor" : "Add Vendor"}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="User ID"
              type="number"
              value={current.user}
              onChange={(e) =>
                setCurrent((f) => ({ ...f, user: +e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Name"
              value={current.vendor_name}
              onChange={(e) =>
                setCurrent((f) => ({ ...f, vendor_name: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Email"
              value={current.vendor_email}
              onChange={(e) =>
                setCurrent((f) => ({ ...f, vendor_email: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Address"
              value={current.vendor_address}
              onChange={(e) =>
                setCurrent((f) => ({ ...f, vendor_address: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Phone"
              value={current.vendor_phone}
              onChange={(e) =>
                setCurrent((f) => ({ ...f, vendor_phone: e.target.value }))
              }
              fullWidth
            />
            <Button variant="contained" onClick={handleSave}>
              {editMode ? "Save Changes" : "Create Vendor"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity={toastSeverity}
          sx={{ width: "100%" }}
        >
          {toastMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
