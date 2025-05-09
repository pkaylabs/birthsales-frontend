import React, { useState, ChangeEvent, useMemo } from "react";
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
import {
  useAddProductMutation,
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

export default function ProductsPage() {
  // auth user
  const user = useAppSelector((state: RootState) => state.auth.user);
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery();
  const [addProduct, { isLoading: adding }] = useAddProductMutation();
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: allVendors = [] } = useGetVendorsQuery();
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

  // dialog state for "Add Product"
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    vendor: "",
    in_stock: true as boolean,
    imageFile: null as File | null,
    imagePreview: "",
  });

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
  const handleChangePage = (_: any, newPage: number) => setPage(newPage);
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

  const handleSave = async () => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("price", form.price);
    fd.append("category", form.category);
    if (user?.is_superuser || user?.is_staff || user?.user_type === "ADMIN")
      fd.append("vendor", form.vendor);
    fd.append("in_stock", String(form.in_stock));
    if (form.imageFile) {
      setUploading(true);
      fd.append("image", form.imageFile);
    }

    try {
      await addProduct(fd).unwrap();
      setOpen(false);
      setToastMessage("Product created successfully");
      setToastSeverity("success");
      // setForm({
      //   name: "",
      //   description: "",
      //   price: "",
      //   vendor: "",
      //   category: "",
      //   in_stock: true,
      //   imageFile: null,
      //   imagePreview: "",
      // });
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

  const handleDelete = async (id?: number) => {
    if (!id) return;
    setDeletingId(id);
    try {
      await deleteProduct(id).unwrap();
      setToastMessage("Product deleted");
      setToastSeverity("success");
    } catch (err: any) {
      setToastMessage(err.data.message || "Delete failed");
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
  if (isError)
    return (
      <Box p={4} color="error.main">
        Error loading products
      </Box>
    );

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
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add New Product
        </Button>
      </Box>

      {/* Add‐product dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
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
                    <MenuItem key={v.id} value={v.user}>
                      {v.vendor_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={adding || uploading}
            >
              {adding || uploading ? "Saving…" : "Save"}
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
            {detailProduct?.image && (
              <Box
                component="img"
                src={`${BASE_URL}${detailProduct.image}`}
                alt={detailProduct.name}
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
                        (v) => String(v.id) === String(detailProduct?.vendor)
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
