import React, { useState } from "react";
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
  Box,
} from "@mui/material";

import { useNavigate } from "react-location";
import ShimmerTable from "../components/Shimmer";
import {
  useAddUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "@/redux/features/users/usersApi";
import { User, UserForm } from "@/redux/type";

export default function Users() {
  const navigate = useNavigate();
  const { data: users = [], isLoading, isError } = useGetUsersQuery();
  const [addUser] = useAddUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  // New state for search/filter
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [mainImageUploading, setMainImageUploading] = useState(false);
  const [editImageUploading, setEditImageUploading] = useState(false);
  const [current, setCurrent] = useState<UserForm>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: null,
    user_type: "",
    password: "",
  });

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm) ||
      u.email.toLowerCase().includes(searchTerm)
  );

  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSave = async () => {
    if (editOpen) {
      await updateUser(current).unwrap();
    } else {
      await addUser(current).unwrap();
    }
    setDialogOpen(false);
    setEditOpen(false);
    setMainImageUploading(false);
    setEditImageUploading(false);
  };

  const handleEdit = (user: User) => {
    setCurrent({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar,
      user_type: user.userType,
    });
    setEditOpen(true);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteUser(id).unwrap();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    const setUploading = editOpen
      ? setEditImageUploading
      : setMainImageUploading;
    setUploading(true);
    reader.onloadend = () => {
      setCurrent((prev) => ({ ...prev, avatar: reader.result as string }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

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
              onClick={() => {
                setCurrent({
                  id: 0,
                  name: "",
                  email: "",
                  phone: "",
                  address: "",
                  avatar: null,
                  user_type: "",
                  password: "",
                });
                setDialogOpen(true);
                setEditOpen(false);
              }}
            >
              Add New User
            </Button>
          </div>

          {/* Add New User Dialog */}
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <DialogTitle>{editOpen ? "Edit User" : "Add New User"}</DialogTitle>
            <DialogContent>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  fullWidth
                  margin="dense"
                  label="Name"
                  value={current.name}
                  onChange={(e) =>
                    setCurrent({ ...current, name: e.target.value })
                  }
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Email"
                  value={current.email}
                  onChange={(e) =>
                    setCurrent({ ...current, email: e.target.value })
                  }
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Phone"
                  value={current.phone}
                  onChange={(e) =>
                    setCurrent({ ...current, phone: e.target.value })
                  }
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Address"
                  value={current.address}
                  onChange={(e) =>
                    setCurrent({ ...current, address: e.target.value })
                  }
                />

                {/* Avatar upload */}
                <Box display="flex" alignItems="center" gap={2}>
                  <Button
                    variant="contained"
                    component="label"
                    disabled={
                      editOpen ? editImageUploading : mainImageUploading
                    }
                  >
                    {editOpen
                      ? editImageUploading
                        ? "Uploading..."
                        : "Change Avatar"
                      : mainImageUploading
                      ? "Uploading..."
                      : "Upload Avatar"}
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </Button>
                  {(editOpen ? current.avatar : current.avatar) &&
                    !(editOpen ? editImageUploading : mainImageUploading) && (
                      <img
                        src={current.avatar as string}
                        alt="Avatar"
                        className="w-12 h-12 object-cover rounded-full"
                      />
                    )}
                  {(editOpen ? editImageUploading : mainImageUploading) && (
                    <CircularProgress size={24} />
                  )}
                </Box>

                <Button variant="contained" sx={{ mt: 2 }} onClick={handleSave}>
                  {editOpen ? "Save Changes" : "Save"}
                </Button>
              </Box>
            </DialogContent>
          </Dialog>
        </div>
        <TableContainer component={Paper}>
          {isLoading ? (
            <ShimmerTable />
          ) : isError ? (
            <div>Error loading</div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Avatar</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Date Added</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {user.avatar && (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          style={{ marginRight: 10 }}
                          className="w-[3rem] h-[3rem] object-cover rounded-full"
                        />
                      )}
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>

                    <TableCell>{user.dateAdded}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => navigate({ to: `/users/${user.id}` })}
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => {
                          handleEdit(user);
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
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </div>
    </div>
  );
}
