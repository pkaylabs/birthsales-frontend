import React, { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Skeleton,
} from "@mui/material";
import { useGetOrdersQuery } from "@/redux/features/orders/orderApiSlice";
import { Order } from "@/redux/type";

export default function OrdersPage() {
  const { data: orders = [], isLoading, isError } = useGetOrdersQuery();
  const [selected, setSelected] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (term === "") return orders;
    return orders.filter((o) => {
      return (
        o.id.toString().includes(term) ||
        o.status.toLowerCase().includes(term) ||
        o.payment_status.toLowerCase().includes(term) ||
        o.vendor_id.toLowerCase().includes(term)
      );
    });
  }, [orders, searchTerm]);

  if (isLoading) {
    return (
      <Box p={6}>
        <Box mb={2} display="flex" gap={2}>
          {[1, 2].map((i) => (
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
  if (isError)
    return (
      <Box p={4} color="error.main">
        Error loading Orders
      </Box>
    );

  if (!filtered || filtered.length === 0) {
    return (
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
          No Orders Found
        </Typography>
        <Typography color="text.secondary" mb={2}>
          There are no orders to display right now.
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Orders Management
      </Typography>

      <Box mb={2}>
        <TextField
          fullWidth
          placeholder="Filter by ID, status, vendor or payment…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Order ID</strong>
              </TableCell>
              <TableCell>
                <strong>Vendor</strong>
              </TableCell>
              <TableCell>
                <strong>Items Count</strong>
              </TableCell>
              <TableCell>
                <strong>Total (GHC)</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Payment Status</strong>
              </TableCell>
              <TableCell>
                <strong>Customer</strong>
              </TableCell>
              <TableCell>
                <strong>Placed At</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((o) => (
              <TableRow key={o.id} hover>
                <TableCell>{o.id}</TableCell>
                <TableCell>{o.vendor_name}</TableCell>
                <TableCell>{o.items.length}</TableCell>
                <TableCell>{o.total_price.toFixed(2)}</TableCell>
                <TableCell>{o.status}</TableCell>
                <TableCell>{o.payment_status}</TableCell>
                <TableCell>{o.customer_name}</TableCell>
                <TableCell>{new Date(o.created_at).toDateString()}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => setSelected(o)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Detail Dialog */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Order {selected?.id} — {selected?.status}
        </DialogTitle>
        <DialogContent dividers>
          {selected && (
            <Box>
              <Typography variant="subtitle2">
                Customer: {selected.customer_name}
              </Typography>
              <Typography variant="subtitle2">
                Vendor: {selected.vendor_name}
              </Typography>
              <Typography variant="subtitle2">
                Placed: {new Date(selected.created_at).toLocaleString()}
              </Typography>
              <Typography variant="subtitle2">
                Customer Phone: {selected.customer_phone}
              </Typography>
              <Typography variant="subtitle2">
                Location: {selected.location}
              </Typography>
              <Typography variant="subtitle2">
                Total: GHC{selected.total_price.toFixed(2)}
              </Typography>
              <Typography variant="subtitle2">
                Payment: {selected.payment_status}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Items
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Item ID</TableCell>
                    <TableCell>Product ID</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Price (GHC)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selected.items.map((it) => (
                    <TableRow key={it.id}>
                      <TableCell>{it.id}</TableCell>
                      <TableCell>{it.product}</TableCell>
                      <TableCell>{it.quantity}</TableCell>
                      <TableCell>{Math.round(it.price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
