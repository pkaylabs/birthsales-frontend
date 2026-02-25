// src/pages/ServicesPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
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
  DialogActions,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  useGetServicesQuery,
  useAddServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  usePublishServiceMutation,
  useAddServiceImagesMutation,
  useDeleteServiceImageMutation,
  useGetServiceImagesQuery,
} from "@/redux/features/services/servicesApi";
import { useGetVendorsQuery } from "@/redux/features/vendor/vendorApiSlice";
import { useAppSelector } from "@/redux";
import { RootState } from "@/app/store";
import { Service, ServiceForm } from "@/redux/type";
import { toast } from "react-toastify";
import { resolveImageUrl } from "@/utils/resolve-image-url";

function extractImagePath(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const image = obj["image"];
    if (typeof image === "string") return image;
    const url = obj["url"];
    if (typeof url === "string") return url;
  }
  return null;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  if (error instanceof Error && error.message) return error.message;

  if (typeof error === "object") {
    const obj = error as Record<string, unknown>;
    const data = obj["data"];
    if (typeof data === "string" && data.trim()) return data;
    if (data && typeof data === "object") {
      const message = (data as Record<string, unknown>)["message"];
      if (typeof message === "string" && message.trim()) return message;
    }
    const message = obj["message"];
    if (typeof message === "string" && message.trim()) return message;
  }

  return fallback;
}

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
  const [updateService, { isLoading: isUpdating }] =
    useUpdateServiceMutation();
  const [addServiceImages, { isLoading: uploadingImages }] =
    useAddServiceImagesMutation();
  const [deleteServiceImage, { isLoading: deletingServiceImage }] =
    useDeleteServiceImageMutation();
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

  // publis services
  const [publishService, { isLoading: isPublishing }] =
    usePublishServiceMutation();

  // Local state for dialogs & form
  const [openAdd, setOpenAdd] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [detailService, setDetailService] = useState<Service | null>(null);
  const [deletingImageId, setDeletingImageId] = useState<string | number | null>(
    null
  );

  const { data: serviceImages = [] } = useGetServiceImagesQuery(
    detailService?.id ?? "",
    { skip: !detailService?.id }
  );
  const getEmptyForm = (): ServiceForm => ({
    name: "",
    description: "",
    price: "",
    vendor_id: "",
    imageFile: null,
    imagePreview: "",
    extraImages: [],
  });

  const [form, setForm] = useState<ServiceForm>(getEmptyForm);
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

  const handleExtraImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const limited = files.slice(0, 7);
    if (files.length > 7) {
      toast.error("You can upload up to 7 images per service.");
    }
    setForm((f) => ({ ...f, extraImages: limited }));
    e.target.value = "";
  };

  const handleDeleteImage = async (imageId: string | number | undefined) => {
    if (!detailService?.id || imageId == null) return;
    const ok = window.confirm("Delete this service image?");
    if (!ok) return;
    setDeletingImageId(imageId);
    try {
      await deleteServiceImage({
        serviceId: detailService.id,
        imageId,
      }).unwrap();
      toast.success("Image deleted");
    } catch {
      toast.error("Failed to delete image");
    } finally {
      setDeletingImageId(null);
    }
  };

  const handleUploadMoreImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!detailService?.id) return;
    const files = Array.from(e.target.files ?? []);
    const limited = files.slice(0, 7);
    if (files.length > 7) {
      toast.error("You can upload up to 7 images per service.");
    }
    e.target.value = "";
    if (limited.length === 0) return;

    try {
      await addServiceImages({ serviceId: detailService.id, images: limited }).unwrap();
      toast.success("Images uploaded");
    } catch {
      toast.error("Image upload failed");
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
      const created = await addService(fd).unwrap();

      if (form.extraImages && form.extraImages.length > 0) {
        try {
          await addServiceImages({
            serviceId: created.id,
            images: form.extraImages,
          }).unwrap();
        } catch {
          toast.error("Service created, but image upload failed");
        }
      }

      setToastMessage("Service created successfully");
      setToastSeverity("success");
      setOpenAdd(false);
      setForm({
        name: "",
        description: "",
        price: "",
        vendor_id: "",
        imageFile: null,
        imagePreview: "",
        extraImages: [],
      });
    } catch (err) {
      console.error(err);
      setToastMessage("Add failed");
      setToastSeverity("error");
    } finally {
      setToastOpen(true);
    }
  };

  const openEdit = (service: Service) => {
    setEditingService(service);
    setForm({
      name: service.name ?? "",
      description: service.description ?? "",
      price: service.price != null ? String(service.price) : "",
      vendor_id: service.vendor?.user != null ? String(service.vendor.user) : "",
      imageFile: null,
      imagePreview: service.image ? resolveImageUrl(service.image) : "",
      extraImages: [],
    });
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingService) return;

    const fd = new FormData();
    fd.append("service_id", String(editingService.id));
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("price", form.price.toString());
    if (userType) fd.append("vendor_id", form.vendor_id);
    else fd.append("vendor_id", user?.id?.toString() || "");
    if (form.imageFile) {
      fd.append("image", form.imageFile);
    }

    try {
      await updateService(fd).unwrap();

      if (form.extraImages && form.extraImages.length > 0) {
        try {
          await addServiceImages({
            serviceId: editingService.id,
            images: form.extraImages,
          }).unwrap();
        } catch {
          toast.error("Service updated, but image upload failed");
        }
      }

      setToastMessage("Service updated successfully");
      setToastSeverity("success");
      setEditOpen(false);
      setEditingService(null);
      setForm(getEmptyForm());
    } catch (err: unknown) {
      setToastMessage(getErrorMessage(err, "Update failed"));
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
    } catch (err: unknown) {
      setToastMessage(getErrorMessage(err, "Delete failed"));
      setToastSeverity("error");
    } finally {
      setDeletingId(null);
      setToastOpen(true);
    }
  };

  const handlePublish = async (service: Service) => {
    try {
      await publishService(Number(service.id)).unwrap();
      setToastMessage("Service published successfully");
      setToastSeverity("success");
      setDetailService(null); // Close detail dialog
    } catch (err: unknown) {
      console.error(err);
      setToastMessage(getErrorMessage(err, "Publish failed"));
      setToastSeverity("error");
    } finally {
      setToastOpen(true);
    }
  };

  useEffect(() => {
    if (isError && error && "data" in error) {
      const err = error as {
        status: number;
        data: { message?: string } & Record<string, unknown>;
      };

      const message =
        err?.data?.message ||
        (typeof err.data === "string" ? err.data : "Failed to fetch services");

      toast.error(message);
    }
  }, [isError, error]);

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
      <Typography variant="h4" gutterBottom>
        Services Management
      </Typography>
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
                component="label"
                variant="outlined"
                disabled={uploadingImages}
              >
                {uploadingImages
                  ? "Uploading Images…"
                  : "Upload More Images (max 7)"}
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleExtraImagesChange}
                />
              </Button>
              {!!form.extraImages?.length && (
                <Typography variant="body2" color="text.secondary">
                  Selected: {form.extraImages.length}/7
                </Typography>
              )}

              <Button
                variant="contained"
                onClick={handleAdd}
                disabled={isAdding || uploadingImages}
              >
                Save
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setEditingService(null);
            setForm(getEmptyForm());
          }}
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
                      setForm((f) => ({ ...f, vendor_id: String(e.target.value) }))
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
                component="label"
                variant="outlined"
                disabled={uploadingImages}
              >
                {uploadingImages
                  ? "Uploading Images…"
                  : "Upload More Images (max 7)"}
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleExtraImagesChange}
                />
              </Button>
              {!!form.extraImages?.length && (
                <Typography variant="body2" color="text.secondary">
                  Selected: {form.extraImages.length}/7
                </Typography>
              )}

              <Button
                variant="contained"
                onClick={handleUpdate}
                disabled={isUpdating || uploading || uploadingImages}
              >
                {isUpdating ? "Saving…" : "Save"}
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
                  <TableCell>Published</TableCell>
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
                    <TableCell align="center">{s.published ? "✅" : "⏳"}</TableCell>
                    <TableCell align="center">{s.bookings}</TableCell>
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" gap={1}>
                        <Button
                          size="small"
                          onClick={() => {
                            setDetailService(s);
                          }}
                        >
                          View
                        </Button>
                        <Button size="small" onClick={() => openEdit(s)}>
                          Edit
                        </Button>
                        {deletingId === Number(s.id) ? (
                          <CircularProgress size={24} />
                        ) : (
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleDelete(Number(s.id))}
                          >
                            Delete
                          </Button>
                        )}
                      </Box>
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
                src={resolveImageUrl(detailService.image)}
                alt={detailService.name}
                sx={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
            )}

            {/* Extra Images */}
            {serviceImages && serviceImages.length > 0 && (
              <Box>
                <Typography variant="subtitle2" color="textSecondary" mb={1}>
                  More Images
                </Typography>
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(3, 1fr)"
                  gap={1}
                >
                  {serviceImages.slice(0, 7).map((img) => {
                    const path = extractImagePath(img);
                    if (!path || !path.trim()) return null;
                    const rec = img as Record<string, unknown>;
                    const imageId =
                      (rec["id"] as string | number | undefined) ??
                      (rec["image_id"] as string | number | undefined) ??
                      (rec["pk"] as string | number | undefined);
                    const busy =
                      deletingServiceImage && deletingImageId === imageId;

                    return (
                      <Box
                        key={String(imageId ?? path)}
                        position="relative"
                        sx={{ borderRadius: 1, overflow: "hidden" }}
                      >
                        <Box
                          component="img"
                          src={resolveImageUrl(path)}
                          alt="Service"
                          sx={{
                            width: "100%",
                            height: 90,
                            objectFit: "cover",
                            borderRadius: 1,
                            display: "block",
                          }}
                        />

                        {imageId != null && (
                          <Button
                            size="small"
                            onClick={() => handleDeleteImage(imageId)}
                            disabled={deletingServiceImage}
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              minWidth: 0,
                              padding: 0,
                              bgcolor: "background.paper",
                            }}
                            aria-label="Delete image"
                          >
                            {busy ? (
                              <CircularProgress size={16} />
                            ) : (
                              <DeleteOutlineIcon fontSize="small" />
                            )}
                          </Button>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* Upload more images (updates gallery) */}
            <Button component="label" variant="outlined" disabled={uploadingImages}>
              {uploadingImages ? "Uploading Images…" : "Upload More Images"}
              <input
                hidden
                type="file"
                accept="image/*"
                multiple
                onChange={handleUploadMoreImages}
              />
            </Button>

            {/* Details Grid */}
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Price
                </Typography>
                <Typography>GHC{detailService?.price}</Typography>
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
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDetailService(null)}>Close</Button>
          {(user?.is_staff ||
            user?.is_superuser ||
            user?.user_type === "ADMIN") &&
            !detailService?.published && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handlePublish(detailService!)}
                disabled={isPublishing}
              >
                {isPublishing ? "Publishing…" : "Publish"}
              </Button>
            )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
