// src/pages/ServicesPage.tsx
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-location";
import {
  useGetServicesQuery,
  useAddServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  ServiceDto,
} from "@/redux/features/services/servicesApi";
import ShimmerTable from "../components/Shimmer";
import { useGetVendorsQuery } from "@/redux/features/vendor/vendorApiSlice";
import { useAppSelector } from "@/redux";
import { RootState } from "@/app/store";

export default function ServicesPage() {
  const navigate = useNavigate();
  const {
    data: services = [],
    isLoading,
    // isFetching,
    // refetch,
  } = useGetServicesQuery();
  const [addService] = useAddServiceMutation();
  const [updateService] = useUpdateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();

  // vendors list for admin
  const { data: allVendors = [] } = useGetVendorsQuery();

  // auth user
  const user = useAppSelector((state: RootState) => state.auth.user);
  const userType = user?.user_type;

  // compute available providers
  const availableProviders = React.useMemo(() => {
    if (userType === "ADMIN") {
      return allVendors;
    } else if (userType === "VENDOR") {
      return user ? [{ id: user.id, name: user.name }] : [];
    }
    return [];
  }, [userType, allVendors, user]);

  // Local state for dialogs & form
  const [openAdd, setOpenAdd] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [editService, setEditService] = useState<ServiceDto | null>(null);
  const [form, setForm] = useState<ServiceDto>({
    name: "",
    description: "",
    price: "",
    category: "",
    provider: availableProviders[0]?.id || 0,
    bookings: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success"
  );
  // const availableCategories = [
  //   "Electronics",
  //   "Clothing",
  //   "Accessories",
  //   "Beauty",
  //   "Wellness",
  // ];

  // sync initial provider selection when availableProviders load
  useEffect(() => {
    if (!editService) {
      setForm((f) => ({ ...f, provider: availableProviders[0]?.id || 0 }));
    }
  }, [availableProviders]);

  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const handleAdd = async () => {
    try {
      await addService(form).unwrap();
      setToastMessage("Service added");
      setToastSeverity("success");
      setOpenAdd(false);
    } catch (err) {
      console.error(err);
      setToastMessage("Add failed");
      setToastSeverity("error");
    } finally {
      setToastOpen(true);
    }
  };

  const handleEdit = (service: ServiceDto) => {
    setEditService(service);
    setForm(service);
    setOpenEdit(true);
  };

  const handleSaveEdit = async () => {
    if (!editService) return;
    try {
      await updateService(form).unwrap();
      setToastMessage("Service updated");
      setToastSeverity("success");
      setOpenEdit(false);
    } catch (err) {
      console.error(err);
      setToastMessage("Update failed");
      setToastSeverity("error");
    } finally {
      setToastOpen(true);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await deleteService(id).unwrap();
      setToastMessage("Service deleted");
      setToastSeverity("success");
    } catch (err) {
      console.error(err);
      setToastMessage("Deletion failed");
      setToastSeverity("error");
    } finally {
      setToastOpen(true);
    }
  };

  if (isLoading) return <ShimmerTable />;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent>Total Services: {services.length}</CardContent>
        </Card>
        <Card>
          <CardContent>
            Total Bookings:{" "}
            {services.reduce((sum, s) => sum + (s.bookings || 0), 0)}
          </CardContent>
        </Card>
        <Card>
          <CardContent>Total Revenue: $0</CardContent>
        </Card>
      </div>

      <div className="bg-white shadow rounded p-4">
        <div className="flex justify-between mb-4">
          <TextField
            size="small"
            placeholder="Search…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="contained" onClick={() => setOpenAdd(true)}>
            Add Service
          </Button>
        </div>

        {/* Add Dialog */}
        <Dialog
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Add Service</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                fullWidth
              />
              <TextField
                label="Description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                fullWidth
              />
              <TextField
                label="Price"
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                >
                  {[
                    "Electronics",
                    "Clothing",
                    "Accessories",
                    "Beauty",
                    "Wellness",
                  ].map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Provider</InputLabel>
                <Select
                  value={form.provider}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, provider: Number(e.target.value) }))
                  }
                >
                  {availableProviders.map((v) => (
                    <MenuItem key={v.id} value={v.id}>
                      {v.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Optionally allow setting bookings on creation */}
              <TextField
                label="Bookings"
                type="number"
                value={form.bookings}
                onChange={(e) =>
                  setForm((f) => ({ ...f, bookings: Number(e.target.value) }))
                }
                fullWidth
              />
              <Button variant="contained" onClick={handleAdd}>
                Save
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit Service</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                fullWidth
              />
              <TextField
                label="Description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                fullWidth
              />
              <TextField
                label="Price"
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                >
                  {[
                    "Electronics",
                    "Clothing",
                    "Accessories",
                    "Beauty",
                    "Wellness",
                  ].map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Provider</InputLabel>
                <Select
                  value={form.provider}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, provider: Number(e.target.value) }))
                  }
                >
                  {availableProviders.map((v) => (
                    <MenuItem key={v.id} value={v.id}>
                      {v.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Bookings"
                type="number"
                value={form.bookings}
                onChange={(e) =>
                  setForm((f) => ({ ...f, bookings: Number(e.target.value) }))
                }
                fullWidth
              />
              <Button variant="contained" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Toast */}
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
            {toastMessage}
          </Alert>
        </Snackbar>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>Bookings</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.description}</TableCell>
                  <TableCell>{s.price}</TableCell>
                  <TableCell>{s.category}</TableCell>
                  <TableCell>
                    {availableProviders.find((v) => v.id === s.provider)?.name}
                  </TableCell>
                  <TableCell>{s.bookings}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        handleEdit(s);
                      }}
                    >
                      Edit
                    </Button>
                    <Button color="error" onClick={() => handleDelete(Number(s.id))}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
