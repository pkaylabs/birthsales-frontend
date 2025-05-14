// src/pages/ServicesPage.tsx
import React, { useMemo, useState } from "react";
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
  Typography,
  Divider,
} from "@mui/material";
import {
  useGetServicesQuery,
  useAddServiceMutation,
  useDeleteServiceMutation,
} from "@/redux/features/services/servicesApi";
import { useGetVendorsQuery } from "@/redux/features/vendor/vendorApiSlice";
import { useAppSelector } from "@/redux";
import { RootState } from "@/app/store";
import { Service, ServiceForm } from "@/redux/type";
import { BASE_URL } from "@/constants";
import { toast } from "react-toastify";

export default function ServicesPage() {
  // auth user
  const user = useAppSelector((state: RootState) => state.auth.user);
  const userType =
    user?.is_superuser || user?.is_staff || user?.user_type === "ADMIN";
  const {
    data: services = [],
    isLoading,
    isError,
    error,
    // isFetching,
    // refetch,
  } = useGetServicesQuery();
  const [addService, { isLoading: isAdding }] = useAddServiceMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  // vendors list for admin
  const { data: allVendors = [] } = useGetVendorsQuery(undefined, {
    skip: !userType,
  });

  const visibleServices = useMemo(() => {
    if (userType) return services;
    // vendor user sees only own services
    else return services.filter((s) => s.vendor.user === user?.id);
  }, [services, userType, user]);

  // Local state for dialogs & form
  const [openAdd, setOpenAdd] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [detailService, setDetailService] = useState<Service | null>(null);
  const [form, setForm] = useState<ServiceForm>({
    name: "",
    description: "",
    price: "",
    // category: "",
    vendor_id: "",
    imageFile: null,
    imagePreview: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success"
  );

  const filtered = visibleServices.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase())
    // s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files?.[0];
    if (file) {
      setUploading(true);
      setTimeout(() => {
        const objectUrl = URL.createObjectURL(file);
        setForm((f) => ({ ...f, imageFile: file, imagePreview: objectUrl }));
        setUploading(false);
      }, 1000);
    }
  };

  // Handlers
  const handleAdd = async () => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("price", form.price.toString());
    if (userType) fd.append("vendor_id", form.vendor_id);
    else fd.append("vendor_id", user?.id?.toString() || "");
    if (form.imageFile) {
      fd.append("image", form.imageFile);
    }
    try {
      await addService(fd as any).unwrap();
      setToastMessage("Service created successfully");
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

  // if (isError) {
  //   toast.error(error?.data?.message);
  // }

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
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                fullWidth
              />
              <Button component="label" variant="outlined">
                {uploading ? "Uploading" : "Upload Image"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              {uploading ? (
                <CircularProgress size={24} />
              ) : (
                form.imagePreview && (
                  <img
                    className="w-[3rem] h-[3rem] rounded-full object-cover"
                    src={form.imagePreview}
                    alt="Service image"
                  />
                )
              )}

              {userType && (
                <FormControl fullWidth>
                  <InputLabel>Vendor</InputLabel>
                  <Select
                    value={form.vendor_id}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, vendor_id: e.target.value }))
                    }
                  >
                    {allVendors?.map((v) => (
                      <MenuItem key={v.id} value={v.user}>
                        {v.vendor_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
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
            <Box mb={2}>
              <Typography variant="h1" color="text.disabled">
                🛒
              </Typography>
            </Box>
            <Typography variant="h6" gutterBottom>
              No Services Found
            </Typography>
            <Typography color="text.secondary" mb={2}>
              There are no services to display right now.
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ width: "100%" }}>
            <Table sx={{ minWidth: 650 }} aria-label="services table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Name</TableCell>
                  {userType && <TableCell align="left">Vendor</TableCell>}
                  <TableCell align="left">Description</TableCell>
                  <TableCell>Price</TableCell>
                  {/* <TableCell>Category</TableCell> */}

                  <TableCell align="center">Bookings</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id} hover>
                    <TableCell align="left">{s.name}</TableCell>
                    {userType && (
                      <TableCell align="left">
                        {
                          allVendors.find(
                            (v) => v.vendor_id === s.vendor.vendor_id
                          )?.vendor_name
                        }
                      </TableCell>
                    )}
                    <TableCell align="left">{s.description}</TableCell>
                    <TableCell>GHC{s.price}</TableCell>
                    {/* <TableCell>{s.category}</TableCell> */}

                    <TableCell align="center">{s.bookings}</TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() => {
                          setDetailService(s);
                        }}
                      >
                        View
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
        )}
      </div>
      <Dialog
        open={!!detailService}
        onClose={() => setDetailService(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Typography variant="h6">{detailService?.name}</Typography>
        </DialogTitle>
        <Divider />
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Image */}
            {detailService?.image && (
              <Box
                component="img"
                src={`${BASE_URL}${detailService.image}`}
                alt={detailService.name}
                sx={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
            )}

            {/* Details Grid */}
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Price
                </Typography>
                <Typography>${detailService?.price}</Typography>
              </Box>
              <Box></Box>
              <Box gridColumn="1 / -1">
                <Typography variant="subtitle2" color="textSecondary">
                  Description
                </Typography>
                <Typography>{detailService?.description}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Bookings
                </Typography>
                <Typography>{detailService?.bookings}</Typography>
              </Box>
              {userType && (
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Vendor
                  </Typography>
                  <Typography>
                    {
                      allVendors.find(
                        (v) => v.vendor_id === detailService?.vendor.vendor_id
                      )?.vendor_name
                    }
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
