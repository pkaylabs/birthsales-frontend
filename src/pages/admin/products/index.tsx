import React, { useState, ChangeEvent, useEffect } from "react";
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
  TablePagination,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  DialogActions,
  Divider,
  Skeleton,
  LinearProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  useAddProductMutation,
  useAddProductImagesMutation,
  useDeleteProductImageMutation,
  useGetProductImagesQuery,
  useGetProductsQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from "@/redux/features/products/productsApi";
import { useAppSelector } from "@/redux";
import { RootState } from "@/app/store";
import { useGetVendorsQuery } from "@/redux/features/vendor/vendorApiSlice";
import { useGetCategoriesQuery } from "@/redux/features/category/productCategoryApiSlice";
import { Product } from "@/redux/type";
import { BASE_URL } from "@/constants";
import { toast } from "react-toastify";
import ChipInput from "@/components/core/chip-input";

function parseFlexibleList(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((v) => String(v).trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    const raw = value.trim();
    if (!raw) return [];
    if (raw.startsWith("[")) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed
            .map((v) => String(v).trim())
            .filter(Boolean);
        }
      } catch {
        // fall through to comma split
      }
    }
    return raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  return [];
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

function resolveImageUrl(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `${BASE_URL}${trimmed}`;
}

function revokeIfBlobUrl(url: string) {
  if (url && url.startsWith("blob:")) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  }
}

export default function ProductsPage() {
  // auth user
  const user = useAppSelector((state: RootState) => state.auth.user);
  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductsQuery();
  const [addProduct, { isLoading: adding }] = useAddProductMutation();
  const [addProductImages, { isLoading: uploadingImages }] =
    useAddProductImagesMutation();
  const [deleteProductImage, { isLoading: deletingProductImage }] =
    useDeleteProductImageMutation();
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: allVendors = [] } = useGetVendorsQuery(undefined, {
    skip:
      !(user?.is_superuser || user?.is_staff || user?.user_type === "ADMIN"),
  });
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [updateProduct, { isLoading: isPublishing }] =
    useUpdateProductMutation();

  // table/filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success"
  );

  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [deletingImageId, setDeletingImageId] = useState<string | number | null>(
    null
  );

  const { data: productImages = [] } = useGetProductImagesQuery(
    detailProduct?.id ?? "",
    { skip: !detailProduct?.id }
  );

  const handleDeleteImage = async (imageId: string | number | undefined) => {
    if (!detailProduct?.id || imageId == null) return;
    const ok = window.confirm("Delete this product image?");
    if (!ok) return;
    setDeletingImageId(imageId);
    try {
      await deleteProductImage({
        productId: detailProduct.id,
        imageId,
      }).unwrap();
      toast.success("Image deleted");
    } catch (e: unknown) {
      toast.error(getErrorMessage(e, "Failed to delete image"));
    } finally {
      setDeletingImageId(null);
    }
  };

  // dialog state for "Add Product"
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const getEmptyForm = () => ({
    name: "",
    description: "",
    price: "",
    category: "",
    vendor: "",
    in_stock: true as boolean,
    imageFile: null as File | null,
    imagePreview: "",
    available_sizes: [] as string[],
    available_colors: [] as string[],
    extraImages: [] as File[],
  });

  const [form, setForm] = useState(getEmptyForm);

  const resetForm = () => {
    revokeIfBlobUrl(form.imagePreview);
    setForm(getEmptyForm());
  };

  const openAdd = () => {
    setEditingProduct(null);
    setEditOpen(false);
    resetForm();
    setOpen(true);
  };

  // upload spinner
  const [uploading, setUploading] = useState(false);

  // filter + paginate
  const filtered = products?.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.category).toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginated = filtered?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  console.log(paginated);

  // handlers
  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setUploading(true);
      setTimeout(() => {
        const objectUrl = URL.createObjectURL(file);
        setForm((f) => ({ ...f, imageFile: file, imagePreview: objectUrl }));
        setUploading(false);
      }, 1000);
    }
  };

  const handleExtraImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const limited = files.slice(0, 7);
    if (files.length > 7) {
      toast.error("You can upload up to 7 images per product.");
    }
    setForm((f) => ({ ...f, extraImages: limited }));
    e.target.value = "";
  };

  const handleSave = async () => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("price", form.price);
    fd.append("category", form.category);
    if (user?.is_superuser || user?.is_staff || user?.user_type === "ADMIN")
      fd.append("vendor", form.vendor);
    fd.append("in_stock", String(form.in_stock));
    fd.append("available_sizes", JSON.stringify(form.available_sizes));
    fd.append("available_colors", JSON.stringify(form.available_colors));
    if (form.imageFile) {
      setUploading(true);
      fd.append("image", form.imageFile);
    }

    try {
      const created = await addProduct(fd).unwrap();

      if (form.extraImages.length > 0) {
        try {
          await addProductImages({
            productId: created.id,
            images: form.extraImages,
          }).unwrap();
        } catch (e: unknown) {
          toast.error(getErrorMessage(e, "Product created, but image upload failed"));
        }
      }

      setOpen(false);
      setToastMessage("Product created successfully");
      setToastSeverity("success");
      resetForm();
      refetch();
    } catch (err) {
      console.error(err);
      setToastMessage("Failed to add product");
      setToastSeverity("error");
    } finally {
      setUploading(false);
      setToastOpen(true);
    }
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    revokeIfBlobUrl(form.imagePreview);
    setForm({
      name: p.name ?? "",
      description: p.description ?? "",
      price: p.price != null ? String(p.price) : "",
      category: p.category != null ? String(p.category) : "",
      vendor: p.vendor != null ? String(p.vendor) : "",
      in_stock: Boolean(p.in_stock),
      imageFile: null,
      imagePreview: (() => {
        const main = p.image ?? (p as unknown as { main_image_url?: string }).main_image_url;
        return main ? resolveImageUrl(String(main)) : "";
      })(),
      available_sizes: parseFlexibleList(p.available_sizes),
      available_colors: parseFlexibleList(p.available_colors),
      extraImages: [],
    });
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingProduct) return;
    const fd = new FormData();
    fd.append("product_id", String(editingProduct.id));
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("price", form.price);
    fd.append("category", form.category);
    if (user?.is_superuser || user?.is_staff || user?.user_type === "ADMIN") {
      if (form.vendor) fd.append("vendor", form.vendor);
    }
    fd.append("in_stock", String(form.in_stock));
    fd.append("available_sizes", JSON.stringify(form.available_sizes));
    fd.append("available_colors", JSON.stringify(form.available_colors));
    if (form.imageFile) {
      setUploading(true);
      fd.append("image", form.imageFile);
    }

    try {
      await updateProduct(fd).unwrap();

      if (form.extraImages.length > 0) {
        try {
          await addProductImages({
            productId: editingProduct.id,
            images: form.extraImages,
          }).unwrap();
        } catch (e: unknown) {
          toast.error(getErrorMessage(e, "Product updated, but image upload failed"));
        }
      }

      setEditOpen(false);
      setEditingProduct(null);
      setToastMessage("Product updated successfully");
      setToastSeverity("success");
      resetForm();
      refetch();
    } catch (err: unknown) {
      setToastMessage(getErrorMessage(err, "Failed to update product"));
      setToastSeverity("error");
    } finally {
      setUploading(false);
      setToastOpen(true);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    setDeletingId(id);
    try {
      await deleteProduct(id).unwrap();
      setToastMessage("Product deleted");
      setToastSeverity("success");
    } catch (err: unknown) {
      setToastMessage(getErrorMessage(err, "Delete failed"));
      setToastSeverity("error");
    } finally {
      setDeletingId(null);
      setToastOpen(true);
    }
  };

  const handlePublish = async (p: Product) => {
    const form = new FormData();
    form.append("is_published", String(true));
    form.append("product_id", String(p.id));
    try {
      await updateProduct(form).unwrap();
      setToastMessage("Product published successfully");
      setToastSeverity("success");
      setToastOpen(true);
      refetch();
      setDetailProduct(null);
    } catch (err) {
      console.error(err);
      setToastMessage("Failed to publish product");
      setToastSeverity("error");
    }
  };

  useEffect(() => {
    if (!isError || !error) return;
    toast.error(getErrorMessage(error, "Failed to fetch products"));
  }, [isError, error]);

  if (isLoading) {
    return (
      <Box p={6}>
        <Box mb={2} display="flex" gap={2}>
          {[1, 2].map((i) => (
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
    <Box p={6}>
      {/* Header + Add button */}
      {(adding || isDeleting) && <LinearProgress />}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          size="small"
          placeholder="Search products…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="contained" onClick={openAdd}>
          Add New Product
        </Button>
      </Box>

      {/* Add‐product dialog */}
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Name"
              fullWidth
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <TextField
              label="Description"
              fullWidth
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
            <TextField
              label="Price"
              fullWidth
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={form.category}
                label="Category"
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value as string }))
                }
              >
                {categories?.map((c) => (
                  <MenuItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <ChipInput
              label="Available Sizes"
              values={form.available_sizes}
              onChange={(values) => setForm((f) => ({ ...f, available_sizes: values }))}
              placeholder="Type a size and press Enter (or comma)"
              helperText="Examples: S, M, L"
            />

            <ChipInput
              label="Available Colors"
              values={form.available_colors}
              onChange={(values) => setForm((f) => ({ ...f, available_colors: values }))}
              placeholder="Type a color and press Enter (or comma)"
              helperText="Examples: Red, Blue"
            />
            <Button component="label">
              {uploading ? "Uploading" : "Upload Image"}
              <input
                hidden
                type="file"
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
                  alt="Product image"
                />
              )
            )}
            {(user?.is_staff ||
              user?.is_superuser ||
              user?.user_type === "ADMIN") && (
              <FormControl fullWidth>
                <InputLabel>Vendor</InputLabel>
                <Select
                  value={form.vendor}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, vendor: e.target.value }))
                  }
                >
                  {allVendors?.map((v) => (
                    <MenuItem key={v.id} value={String(v.user)}>
                      {v.vendor_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <Button component="label" variant="outlined" disabled={uploadingImages}>
              {uploadingImages ? "Uploading Images…" : "Upload More Images (max 7)"}
              <input
                hidden
                type="file"
                accept="image/*"
                multiple
                onChange={handleExtraImagesChange}
              />
            </Button>
            {form.extraImages.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                Selected: {form.extraImages.length}/7
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={adding || uploading || uploadingImages}
            >
              {adding || uploading ? "Saving…" : "Save"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Edit‐product dialog */}
      <Dialog
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditingProduct(null);
          resetForm();
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Name"
              fullWidth
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <TextField
              label="Description"
              fullWidth
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
            <TextField
              label="Price"
              fullWidth
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={form.category}
                label="Category"
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value as string }))
                }
              >
                {categories?.map((c) => (
                  <MenuItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <ChipInput
              label="Available Sizes"
              values={form.available_sizes}
              onChange={(values) => setForm((f) => ({ ...f, available_sizes: values }))}
              placeholder="Type a size and press Enter (or comma)"
              helperText="Examples: S, M, L"
            />

            <ChipInput
              label="Available Colors"
              values={form.available_colors}
              onChange={(values) => setForm((f) => ({ ...f, available_colors: values }))}
              placeholder="Type a color and press Enter (or comma)"
              helperText="Examples: Red, Blue"
            />

            <Button component="label">
              {uploading ? "Uploading" : "Upload Image"}
              <input
                hidden
                type="file"
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
                  alt="Product image"
                />
              )
            )}

            {(user?.is_staff ||
              user?.is_superuser ||
              user?.user_type === "ADMIN") && (
              <FormControl fullWidth>
                <InputLabel>Vendor</InputLabel>
                <Select
                  value={form.vendor}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, vendor: e.target.value }))
                  }
                >
                  {allVendors?.map((v) => (
                    <MenuItem key={v.id} value={String(v.user)}>
                      {v.vendor_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <Button component="label" variant="outlined" disabled={uploadingImages}>
              {uploadingImages ? "Uploading Images…" : "Upload More Images (max 7)"}
              <input
                hidden
                type="file"
                accept="image/*"
                multiple
                onChange={handleExtraImagesChange}
              />
            </Button>
            {form.extraImages.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                Selected: {form.extraImages.length}/7
              </Typography>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              disabled={isPublishing || uploading || uploadingImages}
            >
              {isPublishing || uploading ? "Saving…" : "Save"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Details Page */}
      <Dialog
        open={!!detailProduct}
        onClose={() => setDetailProduct(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Typography variant="h6">{detailProduct?.name}</Typography>
        </DialogTitle>
        <Divider />
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Image */}
            {(() => {
              const main =
                detailProduct?.image ??
                (detailProduct as unknown as { main_image_url?: string })
                  ?.main_image_url;
              const mainPath = main ? String(main) : "";
              if (!mainPath) return null;
              return (
                <Box
                  component="img"
                  src={resolveImageUrl(mainPath)}
                  alt={detailProduct?.name ?? "Product"}
                  sx={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    borderRadius: 1,
                  }}
                />
              );
            })()}

            {/* Extra Images */}
            {productImages && productImages.length > 0 && (
              <Box>
                <Typography variant="subtitle2" color="textSecondary" mb={1}>
                  More Images
                </Typography>
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(3, 1fr)"
                  gap={1}
                >
                  {productImages.slice(0, 7).map((img) => {
                    const path = extractImagePath(img);
                    if (!path || !path.trim()) return null;
                    const rec = img as Record<string, unknown>;
                    const imageId =
                      (rec["id"] as string | number | undefined) ??
                      (rec["image_id"] as string | number | undefined) ??
                      (rec["pk"] as string | number | undefined);
                    const busy =
                      deletingProductImage && deletingImageId === imageId;
                    return (
                      <Box
                        key={String(imageId ?? path)}
                        position="relative"
                        sx={{ borderRadius: 1, overflow: "hidden" }}
                      >
                        <Box
                          component="img"
                          src={resolveImageUrl(path)}
                          alt="Product"
                          sx={{
                            width: "100%",
                            height: 90,
                            objectFit: "cover",
                            borderRadius: 1,
                            display: "block",
                          }}
                        />

                        {imageId != null && (
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteImage(imageId)}
                            disabled={deletingProductImage}
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              bgcolor: "background.paper",
                            }}
                            aria-label="Delete image"
                          >
                            {busy ? (
                              <CircularProgress size={16} />
                            ) : (
                              <DeleteOutlineIcon fontSize="small" />
                            )}
                          </IconButton>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* Details Grid */}
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Price
                </Typography>
                <Typography>GHC{detailProduct?.price}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  In Stock
                </Typography>
                <Typography>
                  {detailProduct?.in_stock ? "Yes" : "No"}
                </Typography>
              </Box>
              <Box gridColumn="1 / -1">
                <Typography variant="subtitle2" color="textSecondary">
                  Description
                </Typography>
                <Typography>{detailProduct?.description}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Category
                </Typography>
                <Typography>
                  {
                    categories?.find(
                      (c) => String(c.id) === String(detailProduct?.category)
                    )?.name
                  }
                </Typography>
              </Box>
              {(user?.is_staff ||
                user?.is_superuser ||
                user?.user_type === "ADMIN") && (
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Vendor
                  </Typography>
                  <Typography>
                    {
                      allVendors.find(
                        (v) => String(v.user) === String(detailProduct?.vendor)
                      )?.vendor_name
                    }
                  </Typography>
                </Box>
              )}
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Published
                </Typography>
                <Typography>
                  {detailProduct?.is_published ? "Yes" : "No"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDetailProduct(null)}>Close</Button>
          {(user?.is_staff ||
            user?.is_superuser ||
            user?.user_type === "ADMIN") &&
            !detailProduct?.is_published && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handlePublish(detailProduct!)}
                disabled={isPublishing}
              >
                {isPublishing ? "Publishing…" : "Publish"}
              </Button>
            )}
        </DialogActions>
      </Dialog>

      {/* Products table */}
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
            No Products Found
          </Typography>
          <Typography color="text.secondary" mb={2}>
            There are no products to display right now.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                {(user?.is_staff ||
                  user?.is_superuser ||
                  user?.user_type === "ADMIN") && <TableCell>Vendor</TableCell>}
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Published</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated?.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {/* <img
                    src={p.image}
                    width={40}
                    height={40}
                    style={{ objectFit: "cover" }}
                    alt={p.name}
                  /> */}
                      {p.name}
                    </Box>
                  </TableCell>
                  {(user?.is_staff ||
                    user?.is_superuser ||
                    user?.user_type === "ADMIN") && (
                    <TableCell>
                      {
                        allVendors.find(
                          (v) => String(v.id) === String(p.vendor)
                        )?.vendor_name
                      }
                    </TableCell>
                  )}

                  <TableCell>
                    {
                      categories?.find(
                        (c) => String(c.id) === String(p.category)
                      )?.name
                    }
                  </TableCell>

                  {/* <TableCell>{p.vendor}</TableCell> */}
                  <TableCell>GHC{p.price}</TableCell>
                  <TableCell>{p.in_stock ? "Yes" : "No"}</TableCell>
                  <TableCell>{p.is_published ? "✅" : "⏳"}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => setDetailProduct(p)}>
                      View
                    </Button>
                    <Button size="small" onClick={() => openEdit(p)}>
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell>
                    {deletingId === Number(p.id) ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Button
                        color="error"
                        onClick={() => handleDelete(Number(p.id))}
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

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filtered?.length || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
