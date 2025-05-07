import React, { useState, FormEvent } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { Add, Delete, Info } from "@mui/icons-material";

import {
  useGetPlansQuery,
  useAddPlanMutation,
  useDeletePlanMutation,
} from "@/redux/features/plans/plansApi";

import type { Plan } from "@/redux/type";

type ChangeEventType =
  | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | SelectChangeEvent<string>;

export default function SubscriptionPlansPage() {
  const {
    data: plans = [],
    isLoading: isFetching,
    isError,
  } = useGetPlansQuery();
  const [addPlan, { isLoading: isAdding }] = useAddPlanMutation();
  const [deletePlan, { isLoading: isDeleting }] = useDeletePlanMutation();

  // Delete confirmation dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success"
  );

  // Dialog state and form state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewingPlan, setViewingPlan] = useState<Plan | null>(null);
  const [form, setForm] = useState<Omit<Plan, "id">>({
    name: "",
    price: "0",
    interval: "month",
    description: "",
  });

  // Handlers
  const openAdd = () => {
    setForm({ name: "", price: "0", interval: "month", description: "" });
    setDialogOpen(true);
  };

  const close = () => setDialogOpen(false);

  const onChange = (e: ChangeEventType) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  };

  const onIntervalChange = (e: ChangeEventType) => {
    setForm((f) => ({
      ...f,
      interval: e.target.value,
    }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await addPlan(form).unwrap();
      setToastMessage("Plan added successfully!");
      setToastSeverity("success");
      setToastOpen(true);
      close();
    } catch (error) {
      setToastMessage("Operation Failed.");
      setToastSeverity("error");
      setToastOpen(true);
      console.error("Submission error", error);
    }
  };

  const requestDelete = (plan: Plan) => {
    setPlanToDelete(plan);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!planToDelete) return;
    try {
      await deletePlan(planToDelete.id).unwrap();
      setToastMessage("Plan deleted successfully");
      setToastSeverity("success");
    } catch (error) {
      setToastMessage("Deletion failed");
      setToastSeverity("error");
      console.error("Delete error", error);
    } finally {
      setToastOpen(true);
      setConfirmOpen(false);
      setPlanToDelete(null);
    }
  };

  const loadingOverlay = isFetching || isAdding || isDeleting;

  return (
    <Box p={4}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <h2 className="text-2xl font-bold">Subscription Packages</h2>
        <Button variant="contained" startIcon={<Add />} onClick={openAdd}>
          Add Plan
        </Button>
      </Box>

      {isError && <Typography color="error">Error loading plans</Typography>}

      {loadingOverlay ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : !plans || plans.length === 0 ? (
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
            No Packages Found
          </Typography>
          <Typography color="text.secondary" mb={2}>
            There are no packages to display right now.
          </Typography>
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Interval</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>{plan.name}</TableCell>
                <TableCell>GHC{plan.price}</TableCell>
                <TableCell>{plan.interval}</TableCell>
                <TableCell>{plan.description}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => setViewingPlan(plan)}>
                    <Info />
                  </IconButton>
                  <IconButton onClick={() => requestDelete(plan)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add Dialog */}
      <Dialog open={dialogOpen} onClose={close} fullWidth maxWidth="sm">
        <DialogTitle>{"Add Plan"}</DialogTitle>
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
              {isAdding ? "Creating..." : "Create Plan"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* Plan details */}
      <Dialog
        open={!!viewingPlan}
        onClose={() => setViewingPlan(null)}
        fullWidth
      >
        <DialogTitle>Plan Details</DialogTitle>
        <DialogContent dividers>
          {viewingPlan && (
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography>
                <strong>Name:</strong> {viewingPlan.name}
              </Typography>
              <Typography>
                <strong>Price:</strong> GHC{viewingPlan.price}
              </Typography>
              <Typography>
                <strong>Interval:</strong> {viewingPlan.interval}
              </Typography>
              <Typography>
                <strong>Description:</strong> {viewingPlan.description}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewingPlan(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the plan "{planToDelete?.name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            disabled={isDeleting}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
}
