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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

interface Order {
  orderId: string;
  customer: string;
  paymentMethod: string;
  Amount: number;
  orderDate: string;
  deliveryDate: string;
}

type ChangeEventType =
  | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | SelectChangeEvent<string>;

const initialOrders: Order[] = [
  {
    orderId: "ORD001",
    customer: "John Doe",
    paymentMethod: "Credit Card",
    Amount: 30,
    orderDate: "2025-02-01",
    deliveryDate: "2025-02-05",
  },
  {
    orderId: "ORD002",
    customer: "Jane Smith",
    paymentMethod: "PayPal",
    Amount: 20,
    orderDate: "2025-02-02",
    deliveryDate: "2025-02-06",
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [newOrder, setNewOrder] = useState<Order>({
    orderId: "",
    customer: "",
    paymentMethod: "",
    Amount: 0,
    orderDate: new Date().toISOString().split("T")[0],
    deliveryDate: "",
  });
  const [open, setOpen] = useState(false);

  const handleChange = (e: ChangeEventType) => {
    const { name, value } = e.target;
    if (name) {
      setNewOrder((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleAddOrder = () => {
    if (
      !newOrder.orderId ||
      !newOrder.customer ||
      !newOrder.paymentMethod ||
      !newOrder.deliveryDate
    )
      return;
    setOrders((prevOrders) => [...prevOrders, newOrder]);
    setNewOrder({
      orderId: "",
      customer: "",
      paymentMethod: "",
      Amount: 0,
      orderDate: new Date().toISOString().split("T")[0],
      deliveryDate: "",
    });
    setOpen(false);
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.orderId !== orderId)
    );
  };

  const handleViewOrder = (order: Order) => {
    alert(
      `Order Details:\nOrder ID: ${order.orderId}\nCustomer: ${order.customer}\nPayment Method: ${order.paymentMethod}\nOrder Date: ${order.orderDate}\nDelivery Date: ${order.deliveryDate}`
    );
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderId.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Orders Management
      </Typography>
      <Grid container spacing={2} style={{ marginBottom: "1rem" }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h5">{orders.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <TextField
          label="Search Orders"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Add Order
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Delivery Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>GHC{order.Amount}</TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>{order.deliveryDate}</TableCell>
                <TableCell>
                  <Button onClick={() => handleViewOrder(order)}>View</Button>
                  <Button onClick={() => handleDeleteOrder(order.orderId)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Order</DialogTitle>
        <DialogContent>
          <TextField
            label="Order ID"
            name="orderId"
            fullWidth
            margin="dense"
            onChange={handleChange}
          />
          <TextField
            label="Customer Name"
            name="customer"
            fullWidth
            margin="dense"
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Payment Method</InputLabel>
            <Select
              name="paymentMethod"
              value={newOrder.paymentMethod}
              onChange={handleChange}
            >
              <MenuItem value="Mobile Money">Mobile Money</MenuItem>
              <MenuItem value="Cash on Delivery">Cash on Delivery</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Order Date"
            name="orderDate"
            type="date"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
          />
          <TextField
            label="Delivery Date"
            name="deliveryDate"
            type="date"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddOrder} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
