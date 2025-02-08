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
} from "@mui/material";

interface Category {
  id?: number;
  name: string;
  description: string;
  image: string;
}

export default function Category() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      name: "Electronics",
      description: "All electronic items",
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      name: "Clothing",
      description: "Apparel for men and women",
      image:
        "https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?q=80&w=1798&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 3,
      name: "Accessories",
      description: "All accessories",
      image:
        "https://images.unsplash.com/3/www.madebyvadim.com.jpg?q=80&w=1782&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ]);

  // State for adding a new category
  const [newCategory, setNewCategory] = useState<Category>({
    name: "",
    description: "",
    image: "",
  });
  const [open, setOpen] = useState(false);

  // State for editing an existing category
  const [editOpen, setEditOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  // Upload status states for adding category
  const [imageUploading, setImageUploading] = useState(false);

  // Upload status states for editing category
  const [editImageUploading, setEditImageUploading] = useState(false);

  // Handler for new category image upload
  const handleCategoryImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageUploading(true);
      // Simulate async upload delay
      setTimeout(() => {
        setNewCategory((prev) => ({
          ...prev,
          image: URL.createObjectURL(file),
        }));
        setImageUploading(false);
      }, 1000);
    }
  };

  // Handler for editing category image upload
  const handleEditCategoryImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files && e.target.files[0];
    if (file && editCategory) {
      setEditImageUploading(true);
      setTimeout(() => {
        setEditCategory({ ...editCategory, image: URL.createObjectURL(file) });
        setEditImageUploading(false);
      }, 1000);
    }
  };

  const handleAddCategory = () => {
    setCategories([
      ...categories,
      { ...newCategory, id: categories.length + 1 },
    ]);
    setOpen(false);
    // Optionally reset newCategory state
  };

  const handleEditSave = () => {
    if (!editCategory) return;
    setCategories(
      categories.map((cat) => (cat.id === editCategory.id ? editCategory : cat))
    );
    setEditOpen(false);
    setEditCategory(null);
  };

  const handleDelete = (id: number | undefined) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Dashboard Overview */}
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
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
            >
              Add New Category
            </Button>
          </div>

          {/* Add New Category Dialog */}
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Add New Category</DialogTitle>
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
                ) : newCategory.image ? (
                  <img
                    src={newCategory.image}
                    alt="Category"
                    className="w-[3rem] h-[3rem] rounded-full object-cover"
                  />
                ) : null}
              </div>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, display: "block" }}
                onClick={handleAddCategory}
              >
                Save
              </Button>
            </DialogContent>
          </Dialog>

          {/* Edit Category Dialog */}
          <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogContent>
              {editCategory && (
                <>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Category Name"
                    variant="outlined"
                    value={editCategory.name}
                    onChange={(e) =>
                      setEditCategory({ ...editCategory, name: e.target.value })
                    }
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Description"
                    variant="outlined"
                    value={editCategory.description}
                    onChange={(e) =>
                      setEditCategory({
                        ...editCategory,
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
                        onChange={handleEditCategoryImageChange}
                      />
                    </Button>
                    {editImageUploading ? (
                      <CircularProgress size={24} />
                    ) : editCategory.image ? (
                      <img
                        src={editCategory.image}
                        alt="Category"
                        width="50"
                        height="50"
                      />
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

        {/* Categories Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{cat.description}</TableCell>
                  <TableCell>
                    {cat.image && (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-[3rem] h-[3rem] rounded-full object-cover"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      color="secondary"
                      onClick={() => {
                        setEditCategory(cat);
                        setEditOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button color="error" onClick={() => handleDelete(cat.id)}>
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
