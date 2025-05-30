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
  Box,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  DialogActions,
} from "@mui/material";

import ShimmerTable from "../components/Shimmer";
import {
  useAddUserMutation,
  useGetUsersQuery,
} from "@/redux/features/users/usersApi";
import { User, UserForm } from "@/redux/type";

export default function Users() {
  const { data: users = [], isLoading, isError } = useGetUsersQuery();
  const [addUser] = useAddUserMutation();

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [searchTerm, setSearchTerm] = useState("");

  // Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success"
  );
  const [viewOpen, setViewOpen] = useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null);

  // New state for search/filter

  const [dialogOpen, setDialogOpen] = useState(false);

  const [currentForm, setCurrentForm] = useState<UserForm>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    address: "",
    user_type: "",
    password: "",
    avatarFile: null,
    avatarPreview: null,
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

  const handleOpenAdd = () => {
    setDialogOpen(true);
  };

  const handleView = (u: User) => {
    setViewUser(u);
    setViewOpen(true);
  };


  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", currentForm.name);
    formData.append("email", currentForm.email);
    formData.append("phone", currentForm.phone);
    formData.append("address", currentForm.address);
    formData.append("user_type", currentForm.user_type);
    if (currentForm.password) formData.append("password", currentForm.password);
    if (currentForm.avatarFile) {
      formData.append("avatar", currentForm.avatarFile);
    }
    try {
      await addUser(formData as any).unwrap();
      setToastMessage("User added successfully");
      setToastSeverity("success");
    } catch (err) {
      console.error("Save error", err);
      setToastMessage("Operation failed");
      setToastSeverity("error");
    } finally {
      setToastOpen(true);
      setDialogOpen(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setCurrentForm((f) => ({
        ...f,
        avatarFile: file,
        avatarPreview: URL.createObjectURL(file),
      }));
    }
  };

  return (
    <>
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
                onClick={handleOpenAdd}
              >
                Add New User
              </Button>
            </div>

            {/* Add New User Dialog */}
            <Dialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle>{"Add New User"}</DialogTitle>
              <DialogContent>
                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Name"
                    value={currentForm.name}
                    onChange={(e) =>
                      setCurrentForm({ ...currentForm, name: e.target.value })
                    }
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Email"
                    value={currentForm.email}
                    onChange={(e) =>
                      setCurrentForm({ ...currentForm, email: e.target.value })
                    }
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Phone"
                    value={currentForm.phone}
                    onChange={(e) =>
                      setCurrentForm({ ...currentForm, phone: e.target.value })
                    }
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Address"
                    value={currentForm.address}
                    onChange={(e) =>
                      setCurrentForm({
                        ...currentForm,
                        address: e.target.value,
                      })
                    }
                  />
                  <FormControl fullWidth>
                    <InputLabel>User Type</InputLabel>
                    <Select
                      value={currentForm.user_type}
                      label="User Type"
                      onChange={(e) =>
                        setCurrentForm((f) => ({
                          ...f,
                          user_type: e.target.value,
                        }))
                      }
                    >
                      <MenuItem value="ADMIN">Admin</MenuItem>
                      <MenuItem value="VENDOR">Vendor</MenuItem>
                      <MenuItem value="DELIVERY">Delivery</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Password"
                    type="password"
                    value={currentForm.password}
                    onChange={(e) =>
                      setCurrentForm((f) => ({
                        ...f,
                        password: e.target.value,
                      }))
                    }
                    fullWidth
                  />

                  <Button variant="contained" component="label">
                    Choose Avatar{" "}
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </Button>
                  {currentForm.avatarPreview && (
                    <img
                      src={currentForm.avatarPreview}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded-full"
                    />
                  )}
                  <Button variant="contained" onClick={handleSave}>
                    {"Create User"}
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
                    {/* <TableCell>Avatar</TableCell> */}
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginated.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.user_type}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleView(user)}>View</Button>
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

      {/* Toast Snackbar */}
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
      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>User Details</DialogTitle>
        <DialogContent dividers>
          {viewUser && (
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography>
                <strong>Name:</strong> {viewUser.name}
              </Typography>
              <Typography>
                <strong>Email:</strong> {viewUser.email}
              </Typography>
              <Typography>
                <strong>Phone:</strong> {viewUser.phone}
              </Typography>
              <Typography>
                <strong>Type:</strong> {viewUser.user_type}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
