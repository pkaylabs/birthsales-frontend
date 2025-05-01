// src/pages/ServicesPage.tsx
import React, {  useMemo, useState } from "react";
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
  LinearProgress,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import { useNavigate } from "react-location";
import {
  useGetServicesQuery,
  useAddServiceMutation,
  // useUpdateServiceMutation,
  useDeleteServiceMutation,
  ServiceDto,
} from "@/redux/features/services/servicesApi";
import { useGetVendorsQuery } from "@/redux/features/vendor/vendorApiSlice";
import { useAppSelector } from "@/redux";
import { RootState } from "@/app/store";
import { ServiceForm } from "@/redux/type";

export default function ServicesPage() {
  const navigate = useNavigate();
  const {
    data: services = [],
    isLoading,
    // isFetching,
    // refetch,
  } = useGetServicesQuery();
  const [addService, { isLoading: isAdding }] = useAddServiceMutation();
  // const [updateService] = useUpdateServiceMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  // vendors list for admin
  const { data: allVendors = [] } = useGetVendorsQuery();

  // auth user
  const user = useAppSelector((state: RootState) => state.auth.user);
  const userType = user?.user_type;

  // compute available providers
  const availableVendors = useMemo(() => {
    if (userType === "ADMIN") {
      return allVendors;
    } else if (userType === "VENDOR") {
      return allVendors.filter((v) => v.user === user?.id);
    }
    return [];
  }, [userType, allVendors, user]);

  console.log("availableVendors", availableVendors);

  // Filter services accordingly
  const visibleServices = useMemo(() => {
    if (userType === "ADMIN") return services;
    // vendor user sees only own services
    return services.filter((s) =>
      availableVendors.some((v) => v.vendor_id === s.vendor.vendor_id)
    );
  }, [services, availableVendors, userType]);

  // Local state for dialogs & form
  const [openAdd, setOpenAdd] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  // const [editService, setEditService] = useState<ServiceDto | null>(null);
  const [form, setForm] = useState<ServiceForm>({
    name: "",
    description: "",
    price: 0,
    // category: "",
    vendor_id: "",
    imageFile: undefined,
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
  // useEffect(() => {
  //   if (!editService) {
  //     setForm((f) => ({ ...f, vendor_id: availableVendors[0]?.id |}));
  //   }
  // }, [availableVendors, editService]);

  const filtered = visibleServices.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase())
    // s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((f) => ({ ...f, imageFile: file }));
    }
  };

  // Handlers
  const handleAdd = async () => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("price", form.price.toString());
    // fd.append("category", form.category);
    if (userType === "ADMIN") fd.append("vendor_id", form.vendor_id);
    else fd.append("vendor_id", availableVendors[0].vendor_id);
    if (form.imageFile) {
      fd.append("image", form.imageFile);
    }
    try {
      await addService(fd as any).unwrap();
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
    // setEditService(service);
    setForm(service);
    setOpenEdit(true);
  };

  // const handleSaveEdit = async () => {
  //   if (!editService) return;
  //   try {
  //     await updateService(form).unwrap();
  //     setToastMessage("Service updated");
  //     setToastSeverity("success");
  //     setOpenEdit(false);
  //   } catch (err) {
  //     console.error(err);
  //     setToastMessage("Update failed");
  //     setToastSeverity("error");
  //   } finally {
  //     setToastOpen(true);
  //   }
  // };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    setDeletingId(id);
    try {
      await deleteService(id).unwrap();
      setToastMessage("Service deleted");
      setToastSeverity("success");
    } catch (err: any) {
      setToastMessage(err.data.message || "Delete failed");
      setToastSeverity("error");
    } finally {
      setDeletingId(null);
      setToastOpen(true);
    }
  };

  if (isLoading) {
    return (
      <Box p={6}>
        <Box mb={2} display="flex" gap={2}>
          {[1, 2, 3].map((i) => (
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

  return (
    <div className="p-6 space-y-6">
      {(isAdding || isDeleting) && <LinearProgress />}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent>Total Services: {visibleServices.length}</CardContent>
        </Card>
        <Card>
          <CardContent>
            Total Bookings:{" "}
            {visibleServices.reduce((sum, s) => sum + (s.bookings || 0), 0)}
          </CardContent>
        </Card>
        <Card>
          <CardContent>Total Revenue: $0</CardContent>
        </Card>
      </div>

      <div className="bg-white shadow rounded p-4 overflow-x-auto">
        <div className="flex justify-between mb-4">
          <TextField
            size="small"
            placeholder="Search…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => setOpenAdd(true)}
            disabled={isAdding}
          >
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
                  setForm((f) => ({ ...f, price: Number(e.target.value) }))
                }
                fullWidth
              />
              <Button component="label" variant="outlined">
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              {form.imageFile && <span>{form.imageFile.name}</span>}
              {/* <FormControl fullWidth>
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
              </FormControl> */}
              {userType === "ADMIN" && (
                <FormControl fullWidth>
                  <InputLabel>Vendor</InputLabel>
                  <Select
                    value={form.vendor_id}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, vendor_id: e.target.value }))
                    }
                  >
                    {availableVendors?.map((v) => (
                      <MenuItem key={v.id} value={v.vendor_id}>
                        {v.vendor_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {/* Optionally allow setting bookings on creation */}
              <Button
                variant="contained"
                onClick={handleAdd}
                disabled={isAdding}
              >
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
                  setForm((f) => ({ ...f, price: Number(e.target.value) }))
                }
                fullWidth
              />
              {/* <FormControl fullWidth>
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
              </FormControl> */}
              {userType === "ADMIN" && (
                <FormControl fullWidth>
                  <InputLabel>Vendor</InputLabel>
                  <Select
                    value={form.vendor_id}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, vendor_id: e.target.value }))
                    }
                  >
                    {availableVendors?.map((v) => (
                      <MenuItem key={v.id} value={v.vendor_id}>
                        {v.vendor_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {/* <Button variant="contained" onClick={handleSaveEdit}>
                Save Changes
              </Button> */}
            </Box>
          </DialogContent>
        </Dialog>

        {/* Toast */}
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

        {/* Table */}
        <TableContainer component={Paper} sx={{ width: "100%" }}>
          <Table sx={{ minWidth: 650 }} aria-label="services table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Description</TableCell>
                <TableCell align="right">Price</TableCell>
                {/* <TableCell>Category</TableCell> */}
                {userType === "ADMIN" && (
                  <TableCell align="left">Vendor</TableCell>
                )}
                <TableCell align="center">Bookings</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id} hover>
                  <TableCell align="left">{s.name}</TableCell>
                  <TableCell align="left">{s.description}</TableCell>
                  <TableCell align="right">{s.price}</TableCell>
                  {/* <TableCell>{s.category}</TableCell> */}

                  {userType === "ADMIN" && (
                    <TableCell align="left">
                      {
                        availableVendors.find(
                          (v) => v.vendor_id === s.vendor.vendor_id
                        )?.vendor_name
                      }
                    </TableCell>
                  )}

                  <TableCell align="center">{s.bookings}</TableCell>
                  <TableCell align="center">
                    <Button
                      onClick={() => {
                        handleEdit(s);
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell>
                    {deletingId === s.id ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Button
                        color="error"
                        onClick={() => handleDelete(Number(s.id))}
                      >
                        Delete
                      </Button>
                    )}
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
