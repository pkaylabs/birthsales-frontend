import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Grid,
} from "@mui/material";

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  image?: File | null;
}

const initialUsers: User[] = [];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<User>({
    id: "",
    username: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    image: null,
  });

  const handleAddUser = () => {
    setLoading(true);
    setTimeout(() => {
      setUsers([...users, { ...newUser, id: Date.now().toString() }]);
      setOpen(false);
      setNewUser({
        id: "",
        username: "",
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        image: null,
      });
      setLoading(false);
    }, 1500);
  };

  const handleEditUser = () => {
    if (!editUser) return;
    setUsers(users.map(user => (user.id === editUser.id ? editUser : user)));
    setEditUser(null);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>

      <Grid container spacing={2} style={{ marginBottom: "1rem" }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">{users.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Add User
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "1rem" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell style={{ display: "flex", alignItems: "center" }}>
                  {user.image && (
                    <img
                      src={URL.createObjectURL(user.image)}
                      alt="Profile"
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        marginRight: 10,
                      }}
                    />
                  )}
                  {user.username}
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => setViewUser(user)}>
                    View
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => setEditUser({ ...user })}
                  >
                    Edit
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add User Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Username"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Name"
            value={newUser.name}
            onChange={(e) =>
              setNewUser({ ...newUser, name: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Email"
            type="email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({ ...newUser, email: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Password"
            type="password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Phone"
            value={newUser.phone}
            onChange={(e) =>
              setNewUser({ ...newUser, phone: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Address"
            value={newUser.address}
            onChange={(e) =>
              setNewUser({ ...newUser, address: e.target.value })
            }
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewUser({
                ...newUser,
                image: e.target.files ? e.target.files[0] : null,
              })
            }
            style={{ marginTop: "1rem" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleAddUser}
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog
        open={Boolean(editUser)}
        onClose={() => setEditUser(null)}
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Username"
            value={editUser?.username || ""}
            onChange={(e) =>
              setEditUser(editUser ? { ...editUser, username: e.target.value } : null)
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Name"
            value={editUser?.name || ""}
            onChange={(e) =>
              setEditUser(editUser ? { ...editUser, name: e.target.value } : null)
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Email"
            type="email"
            value={editUser?.email || ""}
            onChange={(e) =>
              setEditUser(editUser ? { ...editUser, email: e.target.value } : null)
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Password"
            type="password"
            value={editUser?.password || ""}
            onChange={(e) =>
              setEditUser(editUser ? { ...editUser, password: e.target.value } : null)
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Phone"
            value={editUser?.phone || ""}
            onChange={(e) =>
              setEditUser(editUser ? { ...editUser, phone: e.target.value } : null)
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Address"
            value={editUser?.address || ""}
            onChange={(e) =>
              setEditUser(editUser ? { ...editUser, address: e.target.value } : null)
            }
          />
          <div style={{ marginTop: "1rem" }}>
            {editUser?.image && (
              <img
                src={URL.createObjectURL(editUser.image)}
                alt="Profile"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  marginRight: 10,
                }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setEditUser(
                  editUser
                    ? {
                        ...editUser,
                        image: e.target.files ? e.target.files[0] : null,
                      }
                    : null
                )
              }
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUser(null)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditUser} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
