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
  // Snackbar,
  // Alert,
  Typography,
  DialogActions,
  // FormControl,
  // InputLabel,
  // Select,
  // MenuItem,
} from "@mui/material";

import ShimmerTable from "../components/Shimmer";
// import { useGetUsersQuery } from "@/redux/features/users/usersApi";
import {  Vendor, } from "@/redux/type";
import {
  // useAddVendorMutation,
  useGetVendorsQuery,
} from "@/redux/features/vendor/vendorApiSlice";

export default function VendorsPage() {
  // const { data: users } = useGetUsersQuery();
  const { data: vendors = [], isLoading, isError } = useGetVendorsQuery();
  // const [addVendor] = useAddVendorMutation();

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [searchTerm, setSearchTerm] = useState("");

  // Toast state
  // const [toastOpen, setToastOpen] = useState(false);
  // const [toastMessage, setToastMessage] = useState("");
  // const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
  //   "success"
  // );
  const [viewOpen, setViewOpen] = useState(false);
  const [viewUser, setViewUser] = useState<Vendor | null>(null);

  // New state for search/filter

  // const [dialogOpen, setDialogOpen] = useState(false);

  // const [current, setCurrent] = useState<VendorForm>({
  //   user: 0,
  //   vendor_name: "",
  //   vendor_email: "",
  //   vendor_address: "",
  //   vendor_phone: "",
  // });

  const filtered = vendors.filter(
    (u) =>
      u.vendor_name.toLowerCase().includes(searchTerm) ||
      u.vendor_email.toLowerCase().includes(searchTerm)
  );

  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // const handleOpenAdd = () => {
  //   setDialogOpen(true);
  // };

  const handleView = (u: Vendor) => {
    setViewUser(u);
    setViewOpen(true);
  };

  // const handleSave = async () => {
   
  //   try {
  //     await addVendor(current as any).unwrap();
  //     setToastMessage("Vendor added successfully");
  //     setToastSeverity("success");
  //   } catch (err) {
  //     console.error("Save error", err);
  //     setToastMessage("Operation failed");
  //     setToastSeverity("error");
  //   } finally {
  //     setToastOpen(true);
  //     setDialogOpen(false);
  //   }
  // };

  // const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0] || null;
  //   if (file) {
  //     setCurrent((f) => ({
  //       ...f,
  //       avatarFile: file,
  //       avatarPreview: URL.createObjectURL(file),
  //     }));
  //   }
  // };

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Dashboard Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent>Total Vendors: {vendors.length}</CardContent>
          </Card>
        </div>

        {/* User Management Table */}
        <div className="bg-white shadow rounded p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Manage Vendors</h2>
            <div className="flex gap-2 flex-wrap">
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {/* <Button
                variant="contained"
                color="primary"
                onClick={handleOpenAdd}
              >
                Add New Vendor
              </Button> */}
            </div>

            {/* Add New Vendor Dialog */}
            {/* <Dialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle>{"Add New Vendor"}</DialogTitle>
              <DialogContent>
                <Box display="flex" flexDirection="column" gap={2}>
                  {users && (
             <FormControl fullWidth>
               <InputLabel>User Type</InputLabel>
               <Select
                 value={current.user}
                 label="User Type"
                 onChange={(e) =>
                    setCurrent((f) => ({
                     ...f,
                     user: Number(e.target.value),
                   }))
                 }
               >
                 {users.map((user) => (
                   <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                 ))}
               </Select>
             </FormControl>
           )}
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Name"
                    value={current.vendor_name}
                    onChange={(e) =>
                      setCurrent({ ...current, vendor_name: e.target.value })
                    }
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Email"
                    value={current.vendor_email}
                    onChange={(e) =>
                      setCurrent({ ...current, vendor_email: e.target.value })
                    }
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Phone"
                    value={current.vendor_phone}
                    onChange={(e) =>
                      setCurrent({ ...current, vendor_phone: e.target.value })
                    }
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Address"
                    value={current.vendor_address}
                    onChange={(e) =>
                      setCurrent({
                        ...current,
                        vendor_address: e.target.value,
                      })
                    }
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
                    {"Create Vendor"}
                  </Button>
                </Box>
              </DialogContent>
            </Dialog> */}
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
                      <TableCell>{user.vendor_name}</TableCell>
                      <TableCell>{user.vendor_email}</TableCell>
                      <TableCell>{user.vendor_phone}</TableCell>
                      <TableCell>{user.vendor_address}</TableCell>
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
      {/* <Snackbar
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
      </Snackbar> */}
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
                <strong>Name:</strong> {viewUser.vendor_name}
              </Typography>
              <Typography>
                <strong>Email:</strong> {viewUser.vendor_email}
              </Typography>
              <Typography>
                <strong>Phone:</strong> {viewUser.vendor_phone}
              </Typography>
              <Typography>
                <strong>Type:</strong> {viewUser.vendor_address}
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
