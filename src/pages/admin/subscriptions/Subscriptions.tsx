import React from "react";
import {
  Box,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import { useGetSubscriptionsQuery } from "@/redux/features/subscriptions/subscriptionSlice";
import type { Subscriptions } from "@/redux/type";

export default function Subscriptions() {
  const {
    data: subscriptions = [],
    isLoading: isFetching,
    isError: SubscriptionError,
  } = useGetSubscriptionsQuery();

  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [selected, setSelected] = React.useState<Subscriptions | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);

  const openView = (subscription: Subscriptions) => {
    setSelected(subscription);
    setViewOpen(true);
  };

  const closeView = () => {
    setViewOpen(false);
    setSelected(null);
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "-";

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
  };

  const formatDateTime = (value?: string | null) => {
    if (!value) return "-";

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
  };

  const filteredSubscriptions = subscriptions.filter(
    (sub) =>
      sub.package_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.vendor_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (SubscriptionError) {
    return (
      <Box p={4}>
        <h2>Error loading subscriptions</h2>
      </Box>
    );
  }

  const loadingOverlay = isFetching;

  return (
    <div>
      <Box p={4}>
        <div className="flex justify-between">
          <TextField
            size="small"
            placeholder="Search…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* {isError && <Typography color="error">Error loading plans</Typography>} */}

        {loadingOverlay ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : !subscriptions || subscriptions.length === 0 ? (
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
              No Subscriptions Found
            </Typography>
            <Typography color="text.secondary" mb={2}>
              There are no subscriptions to display right now.
            </Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Package</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Subscription Status</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSubscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>{sub.package_name}</TableCell>
                  <TableCell>{sub.vendor_name}</TableCell>
                  <TableCell
                    sx={{
                      color: sub.expired ? "red" : "green",
                      fontWeight: "bold",
                    }}
                  >
                    {sub.expired ? "Expired" : "Active"}
                  </TableCell>
                  <TableCell>
                    {sub.payment_status ?? "Payment not done yet"}
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="outlined" onClick={() => openView(sub)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={viewOpen} onClose={closeView} fullWidth maxWidth="sm">
          <DialogTitle>
            Subscription Details{selected?.id ? ` - #${selected.id} ${selected.package_name}` : ""}
          </DialogTitle>
          <DialogContent dividers>
            {!selected ? (
              <Typography>No subscription selected.</Typography>
            ) : (
              <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Vendor Name
                  </Typography>
                  <Typography variant="body2">{selected.vendor_name}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Package Name
                  </Typography>
                  <Typography variant="body2">{selected.package_name}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Package Price
                  </Typography>
                  <Typography variant="body2">GHS {selected.package_price}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Payment Status
                  </Typography>
                  <Typography variant="body2">
                    {selected.payment_status ?? "Payment not done yet"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Subscription Status
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: selected.expired ? "error.main" : "success.main", fontWeight: 600 }}
                  >
                    {selected.expired ? "Expired" : "Active"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Start Date
                  </Typography>
                  <Typography variant="body2">{formatDate(selected.start_date)}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    End Date
                  </Typography>
                  <Typography variant="body2">{formatDate(selected.end_date)}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography variant="body2">{formatDateTime(selected.created_at)}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Updated At
                  </Typography>
                  <Typography variant="body2">{formatDateTime(selected.updated_at)}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Vendor ID
                  </Typography>
                  <Typography variant="body2">{selected.vendor}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Package ID
                  </Typography>
                  <Typography variant="body2">{selected.package}</Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeView}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Add/Edit Dialog
      <Dialog open={dialogOpen} onClose={close} fullWidth maxWidth="sm">
        <DialogTitle>{editingPlan ? "Edit Plan" : "Add Plan"}</DialogTitle>
        <form onSubmit={onSubmit}>
          <DialogContent dividers>
            <Box display={"flex"} flexDirection={"column"} gap={2}>
              <TextField
                name="name"
                label="Plan Name"
                value={form.name}
                onChange={onChange}
                fullWidth
                required
              />
              <TextField
                name="price"
                label="Price"
                type="number"
                value={form.price}
                onChange={onChange}
                fullWidth
                required
              />
              <FormControl fullWidth>
                <InputLabel>Interval</InputLabel>
                <Select
                  value={form.interval}
                  onChange={onIntervalChange}
                  label="Interval"
                >
                  <MenuItem value="month">Month</MenuItem>
                  <MenuItem value="year">Year</MenuItem>
                </Select>
              </FormControl>
              <TextField
                name="description"
                label="Description"
                value={form.description}
                onChange={onChange}
                fullWidth
                multiline
                rows={3}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingPlan ? "Save Changes" : "Create Plan"}
            </Button>
          </DialogActions>
        </form>
      </Dialog> */}

        {/* <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity={toastSeverity}
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar> */}
      </Box>
    </div>
  );
}
