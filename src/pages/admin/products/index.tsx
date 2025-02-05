import React, { useState, useEffect } from "react";
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
  TablePagination,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { useNavigate } from "react-location";
import { useProducts } from "../utils/ProductContext";
import ShimmerTable from "../components/Shimmer";

interface Product {
  id: number;
  name: string;
  image?: string;
  additionalImages?: string[];
  category: string;
  price: string | number;
  dateAdded: string;
  quantity: string | number;
  stock?: number;
  sales?: number;
  revenue?: number;
}

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const globalProduct = useProducts();
  const [products, setProducts] = useState<Product[]>(globalProduct);

  //  available categories for selection
  const availableCategories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Clothing" },
    { id: 3, name: "Accessories" },
  ];

  // New state for search/filter
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const navigate = useNavigate();

  // State for adding a new product
  const [newProduct, setNewProduct] = useState<Product>({
    id: 0,
    name: "",
    image: "",
    additionalImages: [],
    category: "",
    price: "",
    dateAdded: "",
    quantity: "",
  });
  const [open, setOpen] = useState(false);

  // State for editing an existing product
  const [editOpen, setEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const [totalRevenue, setTotalRevenue] = useState(0);

  // Upload status states for adding product
  const [mainImageUploading, setMainImageUploading] = useState(false);
  const [additionalImagesUploading, setAdditionalImagesUploading] =
    useState(false);

  // Upload status states for editing product
  const [editMainImageUploading, setEditMainImageUploading] = useState(false);
  const [editAdditionalImagesUploading, setEditAdditionalImagesUploading] =
    useState(false);

  useEffect(() => {
    const revenueSum = products.reduce(
      (sum, product) => sum + (product.revenue ?? 0),
      0
    );
    setTotalRevenue(revenueSum);
  }, [products]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    },1500)
  },[])

 

  // --- Handlers for "Add New Product" dialog ---
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setMainImageUploading(true);
      setTimeout(() => {
        setNewProduct((prev) => ({
          ...prev,
          image: URL.createObjectURL(file),
        }));
        setMainImageUploading(false);
      }, 1000);
    }
  };

  const handleAdditionalImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setAdditionalImagesUploading(true);
      setTimeout(() => {
        const urls = Array.from(files)
          .slice(0, 4)
          .map((file) => URL.createObjectURL(file));
        setNewProduct((prev) => ({ ...prev, additionalImages: urls }));
        setAdditionalImagesUploading(false);
      }, 1500);
    }
  };

  // Handle pagination change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(rowsPerPage);
    setPage(0);
  };

  const handleSave = () => {
    const quantity = parseFloat(newProduct.quantity.toString()) || 0;
    const price = parseFloat(newProduct.price.toString()) || 0;
    setProducts([
      ...products,
      {
        ...newProduct,
        id: products.length + 1,
        stock: quantity,
        sales: 0,
        revenue: price * quantity,
      },
    ]);
    setOpen(false);
    // Optionally, reset newProduct state here.
  };

  // --- Handlers for the "Edit Product" dialog ---
  const handleEditMainImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files && e.target.files[0];
    if (file && editProduct) {
      setEditMainImageUploading(true);
      setTimeout(() => {
        setEditProduct({ ...editProduct, image: URL.createObjectURL(file) });
        setEditMainImageUploading(false);
      }, 1000);
    }
  };

  const handleEditAdditionalImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files && files.length > 0 && editProduct) {
      setEditAdditionalImagesUploading(true);
      setTimeout(() => {
        const urls = Array.from(files)
          .slice(0, 4)
          .map((file) => URL.createObjectURL(file));
        setEditProduct({ ...editProduct, additionalImages: urls });
        setEditAdditionalImagesUploading(false);
      }, 1500);
    }
  };

  const handleEditSave = () => {
    if (!editProduct) return;
    const quantity = parseFloat(editProduct.quantity.toString()) || 0;
    const price = parseFloat(editProduct.price.toString()) || 0;
    setProducts(
      products.map((product) =>
        product.id === editProduct.id
          ? { ...editProduct, stock: quantity, revenue: price * quantity }
          : product
      )
    );
    setEditOpen(false);
    setEditProduct(null);
  };

  // Delete handler remains the same.
  const handleDelete = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  // Filter products based on search term (searches in name and category)
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determine products to display based on current page and rows per page
  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="p-6 space-y-6">
      {/* Dashboard Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent>Total Products: {products.length}</CardContent>
        </Card>
        <Card>
          <CardContent>
            In Stock: {products.reduce((sum, p) => sum + (p.stock ?? 0), 0)}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            Total Sales: {products.reduce((sum, p) => sum + (p.sales ?? 0), 0)}
          </CardContent>
        </Card>
        <Card>
          <CardContent>Total Revenue: ${totalRevenue}</CardContent>
        </Card>
      </div>

      {/* Product Management Table */}
      <div className="bg-white shadow rounded p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Manage Products</h2>
          <div className="flex gap-2 flex-wrap">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
            >
              Add New Product
            </Button>
          </div>

          {/* Add New Product Dialog */}
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                margin="dense"
                label="Product Name"
                variant="outlined"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
              {/* Category Dropdown */}
              <FormControl fullWidth margin="dense">
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  label="Category"
                  value={newProduct.category || ""}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                >
                  {availableCategories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                margin="dense"
                label="Price"
                variant="outlined"
                type="number"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
              />
              <TextField
                fullWidth
                margin="dense"
                label="Date Added"
                variant="outlined"
                type="date"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, dateAdded: e.target.value })
                }
              />
              <TextField
                fullWidth
                margin="dense"
                label="Quantity"
                variant="outlined"
                type="number"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, quantity: e.target.value })
                }
              />
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <Button variant="contained" component="label">
                  Upload Main Image
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                  />
                </Button>
                {mainImageUploading ? (
                  <CircularProgress size={24} />
                ) : newProduct.image ? (
                  <img
                    src={newProduct.image}
                    alt="Uploaded"
                    width="50"
                    height="50"
                  />
                ) : null}
              </div>
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <Button variant="contained" component="label">
                  Upload Additional Images
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesChange}
                  />
                </Button>
                {additionalImagesUploading ? (
                  <CircularProgress size={24} />
                ) : (newProduct.additionalImages ?? []).length > 0 ? (
                  (newProduct.additionalImages ?? []).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Uploaded ${idx}`}
                      width="50"
                      height="50"
                    />
                  ))
                ) : null}
              </div>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, display: "block" }}
                onClick={handleSave}
              >
                Save
              </Button>
            </DialogContent>
          </Dialog>

          {/* Edit Product Dialog */}
          <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogContent>
              {editProduct && (
                <>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Product Name"
                    variant="outlined"
                    value={editProduct.name}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, name: e.target.value })
                    }
                  />
                  {/* Category Dropdown for Edit */}
                  <FormControl fullWidth margin="dense">
                    <InputLabel id="edit-category-label">Category</InputLabel>
                    <Select
                      labelId="edit-category-label"
                      label="Category"
                      value={editProduct.category || ""}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          category: e.target.value,
                        })
                      }
                    >
                      {availableCategories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Price"
                    variant="outlined"
                    type="number"
                    value={editProduct.price}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, price: e.target.value })
                    }
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Date Added"
                    variant="outlined"
                    type="date"
                    value={editProduct.dateAdded}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        dateAdded: e.target.value,
                      })
                    }
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Quantity"
                    variant="outlined"
                    type="number"
                    value={editProduct.quantity}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        quantity: e.target.value,
                      })
                    }
                  />
                  <div
                    style={{
                      marginTop: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <Button variant="contained" component="label">
                      Upload Main Image
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={handleEditMainImageChange}
                      />
                    </Button>
                    {editMainImageUploading ? (
                      <CircularProgress size={24} />
                    ) : editProduct.image ? (
                      <img
                        src={editProduct.image}
                        alt="Uploaded"
                        width="50"
                        height="50"
                      />
                    ) : null}
                  </div>
                  <div
                    style={{
                      marginTop: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <Button variant="contained" component="label">
                      Upload Additional Images
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleEditAdditionalImagesChange}
                      />
                    </Button>
                    {editAdditionalImagesUploading ? (
                      <CircularProgress size={24} />
                    ) : editProduct.additionalImages &&
                      editProduct.additionalImages.length > 0 ? (
                      editProduct.additionalImages.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Uploaded ${idx}`}
                          width="50"
                          height="50"
                        />
                      ))
                    ) : null}
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, display: "block" }}
                    onClick={handleEditSave}
                  >
                    Save Changes
                  </Button>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
        <TableContainer component={Paper}>
          {loading ? (
            <ShimmerTable />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price ($)</TableCell>
                  <TableCell>Date Added</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Sales</TableCell>
                  <TableCell>Revenue ($)</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ marginRight: 10 }}
                        className="w-[3rem] h-[3rem] object-cover rounded-full"
                      />
                      {product.name}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.dateAdded}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.sales}</TableCell>
                    <TableCell>{product.revenue}</TableCell>
                    <TableCell>
                      <Button
                        color="primary"
                        onClick={() =>
                          navigate({ to: `/products/${product.id}` })
                        }
                      >
                        View
                      </Button>
                      <Button
                        color="secondary"
                        onClick={() => {
                          setEditProduct(product);
                          setEditOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        color="error"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredProducts.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>


    </div>
  );
}
