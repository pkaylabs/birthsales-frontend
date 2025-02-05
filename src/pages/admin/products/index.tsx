import { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Product {
  id: number;
  name: string;
  image: string | null;
  additionalImages: string[];
  category: string;
  price: string | number;
  dateAdded: string;
  quantity: string | number;
  stock: number;
  sales?: number;
  revenue?: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Laptop",
      image:
        "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      additionalImages: [
        "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      category: "Electronics",
      price: 1200,
      dateAdded: "2025-01-15",
      quantity: 50,
      stock: 50,
      sales: 120,
      revenue: 60000,
    },
    {
      id: 2,
      name: "Smartphone",
      image:
        "https://plus.unsplash.com/premium_photo-1680623400141-7e129b7c56d0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      additionalImages: [
        "https://plus.unsplash.com/premium_photo-1680623400141-7e129b7c56d0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1680623400141-7e129b7c56d0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1680623400141-7e129b7c56d0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1680623400141-7e129b7c56d0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      category: "Electronics",
      price: 800,
      dateAdded: "2025-01-10",
      quantity: 30,
      stock: 30,
      sales: 200,
      revenue: 80000,
    },
  ]);

  // New state for search/filter
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  // State for adding a new product
  const [newProduct, setNewProduct] = useState({
    name: "",
    image: null,
    additionalImages: [],
    category: "",
    price: "",
    dateAdded: "",
    quantity: "",
  });
  const [open, setOpen] = useState(false);

  // State for editing an existing product
  const [editOpen, setEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);

  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const revenueSum = products.reduce(
      (sum, product) => sum + parseFloat(product.revenue),
      0
    );
    setTotalRevenue(revenueSum);
  }, [products]);

  const salesData = [
    { month: "Jan", sales: 300 },
    { month: "Feb", sales: 450 },
    { month: "Mar", sales: 500 },
    { month: "Apr", sales: 650 },
    { month: "May", sales: 800 },
  ];

  // --- Handlers for "Add New Product" dialog ---
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const urls = Array.from(files)
        .slice(0, 4)
        .map((file) => URL.createObjectURL(file));
      setNewProduct((prev) => ({ ...prev, additionalImages: urls }));
    }
  };

  // Handle pagination change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt("5"));
    setPage(0);
  };

  const handleSave = () => {
    const quantity = parseFloat(newProduct.quantity) || 0;
    const price = parseFloat(newProduct.price) || 0;
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
  const handleEditMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file && editProduct) {
      setEditProduct({ ...editProduct, image: URL.createObjectURL(file) });
    }
  };

  const handleEditAdditionalImagesChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0 && editProduct) {
      const urls = Array.from(files)
        .slice(0, 4)
        .map((file) => URL.createObjectURL(file));
      setEditProduct({ ...editProduct, additionalImages: urls });
    }
  };

  const handleEditSave = () => {
    const quantity = parseFloat(editProduct.quantity) || 0;
    const price = parseFloat(editProduct.price) || 0;
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
  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  // Filter products based on search term (searches in name and category)
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
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
            In Stock: {products.reduce((sum, p) => sum + p.stock, 0)}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            Total Sales: {products.reduce((sum, p) => sum + p.sales, 0)}
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
              <TextField
                fullWidth
                margin="dense"
                label="Category"
                variant="outlined"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
              />
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
              <Button
                variant="contained"
                component="label"
                sx={{ mt: 2, mr: 2 }}
              >
                Upload Main Image
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                />
              </Button>
              <Button variant="contained" component="label" sx={{ mt: 2 }}>
                Upload Additional Images
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalImagesChange}
                />
              </Button>
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
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Category"
                    variant="outlined"
                    value={editProduct.category}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        category: e.target.value,
                      })
                    }
                  />
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
                  <Button
                    variant="contained"
                    component="label"
                    sx={{ mt: 2, mr: 2 }}
                  >
                    Upload Main Image
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={handleEditMainImageChange}
                    />
                  </Button>
                  <Button variant="contained" component="label" sx={{ mt: 2 }}>
                    Upload Additional Images
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleEditAdditionalImagesChange}
                    />
                  </Button>
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
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell style={{ display: "flex", alignItems: "center" }}>
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
                    <Button color="primary">View</Button>
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
        </TableContainer>
        {/* Pagination */}
        <TablePagination
          component={"div"}
          count={filteredProducts.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>

      {/* Sales Analytics Chart */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-bold mb-4">Sales Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
