import React from "react";

import { useState } from "react";
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
  CircularProgress,
  Skeleton,
  Box,
  LinearProgress,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "@/redux/features/category/productCategoryApiSlice";
import { CategoryForm } from "@/redux/type";
import { useAppSelector } from "@/redux";

export default function Category() {
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin =
    user?.is_staff || user?.is_superuser || user?.user_type === "ADMIN";
  const {
    data: categories = [],
    isLoading: isFetching,
    isError,
  } = useGetCategoriesQuery();
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  // State for adding a new category
  const [newCategory, setNewCategory] = useState<CategoryForm>({
    name: "",
    description: "",
    imageFile: null,
    imagePreview: "",
  });
  const [open, setOpen] = useState(false);

  const [imageUploading, setImageUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success"
  );
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Handler for new category image upload
  const handleCategoryImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageUploading(true);
      // Simulate async upload delay
      setTimeout(() => {
        const objectUrl = URL.createObjectURL(file);
        setNewCategory((prev) => ({
          ...prev,
          imageFile: file,
          imagePreview: objectUrl,
        }));
        setImageUploading(false);
      }, 1000);
    }
  };

  const handleAddCategory = async () => {
    const newCat = {
      id: categories.length + 1,
      name: newCategory.name,
      description: newCategory.description,
      image: newCategory.imageFile,
    };
    try {
      await addCategory(newCat).unwrap();
      setToastMessage("Category added successfully");
      setToastSeverity("success");
      setOpen(false);
    } catch (err: any) {
      const errMsg = err.data.message;
      setToastMessage(errMsg || "Failed to add category");
      setToastSeverity("error");
    } finally {
      setToastOpen(true);
      setOpen(false);
    }

    // Optionally reset newCategory state
  };

  const handleDelete = async (id: number | undefined) => {
    if (!id) return;
    setDeletingId(id);
    if (id) {
      try {
        await deleteCategory(id).unwrap();
        setToastMessage("Category deleted successfully");
        setToastSeverity("success");
      } catch (err: any) {
        setToastMessage(err.data.message || "Failed to delete category");
        setToastSeverity("error");
      } finally {
        setToastOpen(true);
        setDeletingId(null);
      }
    }
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isFetching) {
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

  if (isError) {
    return (
      <Box p={6}>
        <Alert severity="error">Failed to load categories</Alert>
      </Box>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Dashboard Overview */}
      {(isAdding || isDeleting) && <LinearProgress />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent>Total Categories: {categories.length}</CardContent>
        </Card>
      </div>

      {/* Category Management Area */}
      <div className="bg-white shadow rounded p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-xl font-bold mb-2 md:mb-0">Manage Categories</h2>
          <div className="flex gap-2 flex-wrap">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {isAdmin && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpen(true)}
              >
                Add New Category
              </Button>
            )}
          </div>

          {/* Add New Category Dialog */}
          {isAdmin && (
            <Dialog open={open} onClose={() => setOpen(false)}>
              {isAdmin ? (
                <DialogTitle>Add New Category</DialogTitle>
              ) : (
                <Box sx={{ height: 0, visibility: "hidden" }} />
              )}
              <DialogContent>
                <TextField
                  fullWidth
                  margin="dense"
                  label="Category Name"
                  variant="outlined"
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Description"
                  variant="outlined"
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      description: e.target.value,
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
                    Upload Image
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={handleCategoryImageChange}
                    />
                  </Button>
                  {imageUploading ? (
                    <CircularProgress size={24} />
                  ) : (
                    newCategory.imagePreview && (
                      <img
                        className="w-[3rem] h-[3rem] rounded-full object-cover"
                        src={newCategory.imagePreview}
                        alt="Category preview"
                      />
                    )
                  )}
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, display: "block" }}
                  onClick={handleAddCategory}
                  disabled={isAdding}
                >
                  Save
                </Button>
              </DialogContent>
            </Dialog>
          )}
        </div>

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

        {/* Categories Table */}
        {!filteredCategories || filteredCategories.length === 0 ? (
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
              No Categories Found
            </Typography>
            <Typography color="text.secondary" mb={2}>
              There are no categories to display right now.
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCategories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell>{cat.description}</TableCell>

                    <TableCell>
                      {deletingId === Number(cat.id) ? (
                        <CircularProgress size={24} />
                      ) : (
                        <Button
                          color="error"
                          onClick={() => handleDelete(Number(cat.id))}
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
    </div>
  );
}
