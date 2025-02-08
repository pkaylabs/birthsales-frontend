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
} from "@mui/material";

import { useNavigate } from "react-location";
import ShimmerTable from "../components/Shimmer";
import { useUsers } from "../utils/UsersContext";
import { User } from "../utils/UsersContext";

export default function Users() {
  const [loading, setLoading] = useState(true);
  const globalUsers = useUsers();
  const [users, setusers] = useState<User[]>(globalUsers);

  // New state for search/filter
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const navigate = useNavigate();

  // State for adding a new user
  const [newUser, setNewUser] = useState<User>({
    id: 0,
    username: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    image: "",
    dateAdded: "",
  });
  const [open, setOpen] = useState(false);

  // State for editing an existing user
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEdituser] = useState<User | null>(null);

  // Upload status states for adding user
  const [mainImageUploading, setMainImageUploading] = useState(false);

  // Upload status states for editing user
  const [editMainImageUploading, setEditMainImageUploading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  // --- Handlers for "Add New User" dialog ---
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setMainImageUploading(true);
      setTimeout(() => {
        setNewUser((prev) => ({
          ...prev,
          image: URL.createObjectURL(file),
        }));
        setMainImageUploading(false);
      }, 1000);
    }
  };

  // Handle pagination change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: unknown) => {
    setRowsPerPage(rowsPerPage);
    setPage(0);
  };

  const handleSave = () => {
    setusers([
      ...users,
      {
        ...newUser,
        id: users.length + 1,
      },
    ]);
    setOpen(false);
    // Optionally, reset newuser state here.
  };

  // --- Handlers for the "Edit User" dialog ---
  const handleEditMainImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files && e.target.files[0];
    if (file && editUser) {
      setEditMainImageUploading(true);
      setTimeout(() => {
        setEdituser({ ...editUser, image: URL.createObjectURL(file) });
        setEditMainImageUploading(false);
      }, 1000);
    }
  };

  const handleEditSave = () => {
    if (!editUser) return;
    setusers(
      users.map((user) => (user.id === editUser.id ? { ...editUser } : user))
    );
    setEditOpen(false);
    setEdituser(null);
  };

  // Delete handler remains the same.
  const handleDelete = (id: number) => {
    setusers(users.filter((user) => user.id !== id));
  };

  // Filter users based on search term (searches in name and email)
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determine users to display based on current page and rows per page
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="p-6 space-y-6">
      {/* Dashboard Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent>Total Users: {users.length}</CardContent>
        </Card>
      </div>

      {/* User Management Table */}
      <div className="bg-white shadow rounded p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Manage Users</h2>
          <div className="flex gap-2 flex-wrap">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
            >
              Add New User
            </Button>
          </div>

          {/* Add New User Dialog */}
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                margin="dense"
                label="User Name"
                variant="outlined"
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
              />
              <TextField
                fullWidth
                margin="dense"
                label="Name"
                variant="outlined"
                type="text"
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
              />
              <TextField
                fullWidth
                margin="dense"
                label="Email"
                variant="outlined"
                type="email"
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
              <TextField
                fullWidth
                margin="dense"
                label="Phone"
                variant="outlined"
                type="text"
                onChange={(e) =>
                  setNewUser({ ...newUser, phone: e.target.value })
                }
              />
              <TextField
                fullWidth
                margin="dense"
                label="Password"
                variant="outlined"
                type="password"
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
              />
              <TextField
                fullWidth
                margin="dense"
                label="Address"
                variant="outlined"
                type="address"
                onChange={(e) =>
                  setNewUser({ ...newUser, address: e.target.value })
                }
              />
              <TextField
                fullWidth
                margin="dense"
                label="Date"
                variant="outlined"
                type="date"
                onChange={(e) =>
                  setNewUser({ ...newUser, dateAdded: e.target.value })
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
                ) : newUser.image ? (
                  <img
                    src={newUser.image}
                    alt="Uploaded"
                    width="50"
                    height="50"
                  />
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
            <DialogTitle>Edit User</DialogTitle>
            <DialogContent>
              {editUser && (
                <>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="User Name"
                    variant="outlined"
                    value={editUser.username}
                    onChange={(e) =>
                      setEdituser({ ...editUser, username: e.target.value })
                    }
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Name"
                    variant="outlined"
                    value={editUser.name}
                    type="text"
                    onChange={(e) =>
                      setEdituser({ ...editUser, name: e.target.value })
                    }
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Email"
                    variant="outlined"
                    value={editUser.email}
                    type="email"
                    onChange={(e) =>
                      setEdituser({ ...editUser, email: e.target.value })
                    }
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Phone"
                    variant="outlined"
                    value={editUser.phone}
                    type="text"
                    onChange={(e) =>
                      setEdituser({ ...editUser, phone: e.target.value })
                    }
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Password"
                    variant="outlined"
                    value={editUser.password}
                    type="password"
                    onChange={(e) =>
                      setEdituser({ ...editUser, password: e.target.value })
                    }
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Address"
                    variant="outlined"
                    value={editUser.address}
                    type="address"
                    onChange={(e) =>
                      setEdituser({ ...editUser, address: e.target.value })
                    }
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Date"
                    variant="outlined"
                    value={editUser.dateAdded}
                    type="date"
                    onChange={(e) =>
                      setEdituser({ ...editUser, dateAdded: e.target.value })
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
                    ) : editUser.image ? (
                      <img
                        src={editUser.image}
                        alt="Uploaded"
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
        <TableContainer component={Paper}>
          {loading ? (
            <ShimmerTable />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  {/* <TableCell>Address</TableCell> */}
                  <TableCell>Date Added</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <img
                        src={user.image}
                        alt={user.name}
                        style={{ marginRight: 10 }}
                        className="w-[3rem] h-[3rem] object-cover rounded-full"
                      />
                      {user.username}
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    {/* <TableCell>{user.address}</TableCell> */}
                    <TableCell>{user.dateAdded}</TableCell>
                    <TableCell>
                      <Button
                        color="primary"
                        onClick={() => navigate({ to: `/users/${user.id}` })}
                      >
                        View
                      </Button>
                      <Button
                        color="secondary"
                        onClick={() => {
                          setEdituser(user);
                          setEditOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        color="error"
                        onClick={() => handleDelete(user.id)}
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
          count={filteredUsers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
}
