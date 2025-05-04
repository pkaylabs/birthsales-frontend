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
} from "@mui/material";

import { useGetSubscriptionsQuery } from "@/redux/features/subscriptions/subscriptionSlice";

export default function Subscriptions() {
  const {
    data: subscriptions = [],
    isLoading: isFetching,
    isError: SubscriptionError,
  } = useGetSubscriptionsQuery();

  const [searchTerm, setSearchTerm] = React.useState<string>("");

  const filteredSubscriptions = subscriptions.filter(
    (sub) =>
      sub.package_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.vendor_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dialog state and form state
  //   const [dialogOpen, setDialogOpen] = useState(false);
  //   const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  console.log("Subscriptions data", subscriptions);

  //   const openEdit = (plan: Plan) => {
  //     setEditingPlan(plan);
  //     setForm({
  //       name: plan.name,
  //       price: plan.price,
  //       interval: plan.interval,
  //       description: plan.description,
  //     });
  //     setDialogOpen(true);
  //   };

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
                    <Button>View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

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
