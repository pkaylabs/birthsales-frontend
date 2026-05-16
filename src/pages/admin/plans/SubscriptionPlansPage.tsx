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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { Add, Delete, Edit, Info } from "@mui/icons-material";

import {
  useGetPlansQuery,
  useAddPlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} from "@/redux/features/plans/plansApi";

import type { Plan } from "@/redux/type";

type ChangeEventType =
  | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | SelectChangeEvent<string>;

export default function SubscriptionPlansPage() {
  const clampPositiveInt = (value: unknown, fallback: number) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(1, Math.trunc(n));
  };

  const getErrorMessage = (error: unknown) => {
    if (!error || typeof error !== "object") return "Operation Failed.";

    const anyErr = error as any;
    const data = anyErr?.data;
    if (typeof data === "string" && data.trim()) return data;
    if (typeof data?.message === "string" && data.message.trim()) return data.message;
    if (typeof data?.detail === "string" && data.detail.trim()) return data.detail;
    if (typeof anyErr?.error === "string" && anyErr.error.trim()) return anyErr.error;

    return "Operation Failed.";
  };

  const {
    data: plans = [],
    isLoading: isFetching,
    isError,
  } = useGetPlansQuery();
  const [addPlan, { isLoading: isAdding }] = useAddPlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();
  const [deletePlan, { isLoading: isDeleting }] = useDeletePlanMutation();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success"
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [viewingPlan, setViewingPlan] = useState<Plan | null>(null);
  const [form, setForm] = useState<Omit<Plan, "id">>({
    name: "",
    price: "0",
    interval: "month",
    description: "",
    can_create_product: false,
    can_create_service: false,
    max_products: 5,
    max_services: 5,
  });

  const openAdd = () => {
    setEditingPlanId(null);
    setForm({
      name: "",
      price: "0",
      interval: "month",
      description: "",
      can_create_product: false,
      can_create_service: false,
      max_products: 5,
      max_services: 5,
    });
    setDialogOpen(true);
  };

  const openEdit = (plan: Plan) => {
    setEditingPlanId(plan.id);
    setForm({
      name: plan.name,
      price: plan.price ?? "0",
      interval: plan.interval ?? "month",
      description: plan.description ?? "",
      can_create_product: !!plan.can_create_product,
      can_create_service: !!plan.can_create_service,
      max_products: Math.max(1, Math.trunc(Number(plan.max_products ?? 5))),
      max_services: Math.max(1, Math.trunc(Number(plan.max_services ?? 5))),
    });
    setDialogOpen(true);
  };

  const close = () => setDialogOpen(false);

  const onChange = (e: ChangeEventType) => {
    const { name, value } = e.target;

    if (name === "max_products") {
      const n = clampPositiveInt(value, 5);
      setForm((f) => ({
        ...f,
        max_products: n,
      }));
      return;
    }

    if (name === "max_services") {
      const n = clampPositiveInt(value, 5);
      setForm((f) => ({
        ...f,
        max_services: n,
      }));
      return;
    }

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
      const normalizedForm: Omit<Plan, "id"> = {
        ...form,
        price: String(form.price ?? "0"),
        max_products: clampPositiveInt(form.max_products ?? 5, 5),
        max_services: clampPositiveInt(form.max_services ?? 5, 5),
      };

      if (editingPlanId) {
        await updatePlan({ id: editingPlanId, ...normalizedForm }).unwrap();
        setToastMessage("Plan updated successfully!");
      } else {
        await addPlan(normalizedForm).unwrap();
        setToastMessage("Plan added successfully!");
      }
      setToastSeverity("success");
      setToastOpen(true);
      close();
    } catch (error) {
      setToastMessage(getErrorMessage(error));
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

  const loadingOverlay = isFetching || isAdding || isUpdating || isDeleting;

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
              <TableCell>Max Products</TableCell>
              <TableCell>Max Services</TableCell>
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
                <TableCell>{plan.max_products ?? "-"}</TableCell>
                <TableCell>{plan.max_services ?? "-"}</TableCell>
                <TableCell>{plan.description}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => setViewingPlan(plan)}>
                    <Info />
                  </IconButton>
                  <IconButton onClick={() => openEdit(plan)}>
                    <Edit />
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

      <Dialog open={dialogOpen} onClose={close} fullWidth maxWidth="sm">
        <DialogTitle>{editingPlanId ? "Edit Plan" : "Add Plan"}</DialogTitle>
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

              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.can_create_product}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        can_create_product: e.target.checked,
                      }))
                    }
                  />
                }
                label="Can create product"
              />
              <TextField
                name="max_products"
                label="Max Products"
                type="number"
                value={form.max_products ?? 5}
                onChange={onChange}
                fullWidth
                required
                inputProps={{ min: 1, step: 1 }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.can_create_service}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        can_create_service: e.target.checked,
                      }))
                    }
                  />
                }
                label="Can create service"
              />
              <TextField
                name="max_services"
                label="Max Services"
                type="number"
                value={form.max_services ?? 5}
                onChange={onChange}
                fullWidth
                required
                inputProps={{ min: 1, step: 1 }}
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
              {editingPlanId
                ? isUpdating
                  ? "Saving..."
                  : "Save Changes"
                : isAdding
                  ? "Creating..."
                  : "Create Plan"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={!!viewingPlan} onClose={() => setViewingPlan(null)} fullWidth>
        <DialogTitle>Plan Details</DialogTitle>
        <DialogContent dividers>
          {viewingPlan && (
            <Box display="flex" flexDirection="column" gap={2}>
              <Box
                display="grid"
                gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
                gap={2}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Name
                  </Typography>
                  <Typography fontWeight={600}>{viewingPlan.name}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Price
                  </Typography>
                  <Typography fontWeight={600}>GHC{viewingPlan.price}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Interval
                  </Typography>
                  <Typography fontWeight={600}>{viewingPlan.interval}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Description
                  </Typography>
                  <Typography>{viewingPlan.description || "-"}</Typography>
                </Box>
              </Box>

              <Box>
                <Typography fontWeight={700} gutterBottom>
                  Capabilities
                </Typography>
                <Box
                  display="grid"
                  gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
                  gap={2}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Can create products
                    </Typography>
                    <Typography fontWeight={600}>
                      {viewingPlan.can_create_product ? "Yes" : "No"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Max products: {viewingPlan.max_products ?? "-"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Can create services
                    </Typography>
                    <Typography fontWeight={600}>
                      {viewingPlan.can_create_service ? "Yes" : "No"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Max services: {viewingPlan.max_services ?? "-"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              if (viewingPlan) {
                openEdit(viewingPlan);
                setViewingPlan(null);
              }
            }}
            disabled={!viewingPlan}
          >
            Edit
          </Button>
          <Button onClick={() => setViewingPlan(null)}>Close</Button>
        </DialogActions>
      </Dialog>

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
