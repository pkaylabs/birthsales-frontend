import React, { useState, ChangeEvent, FormEvent } from "react";
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
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
// import {
//   useGetPlansQuery,
//   useAddPlanMutation,
//   useUpdatePlanMutation,
//   useDeletePlanMutation,
//   Plan,
// } from "../services/api";

interface Plan {
  id: string;
  name: string;
  price: string;
  interval: string;
  description: string;
}

export default function SubscriptionPlansPage() {
  // Data fetching
  //   const { data: plans = [], isLoading } = useGetPlansQuery();
  //   const [addPlan, { isLoading: adding }] = useAddPlanMutation();
  //   const [updatePlan, { isLoading: updating }] = useUpdatePlanMutation();
  //   const [deletePlan, { isLoading: deleting }] = useDeletePlanMutation();

  // Dialog state
  const [isLoading, setIsLoading] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: "1",
      name: "Basic",
      price: "10",
      interval: "monthly",
      description: "Details here",
    },
    {
      id: "2",
      name: "Pro",
      price: "20",
      interval: "monthly",
      description: "Details here",
    },
    {
      id: "3",
      name: "Premium",
      price: "30",
      interval: "monthly",
      description: "Details here",
    },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [form, setForm] = useState<Omit<Plan, "id">>({
    name: "",
    price: "0",
    interval: "month",
    description: "",
  });

  // Handlers
  const openAdd = () => {
    setEditingPlan(null);
    setForm({ name: "", price: "0", interval: "month", description: "" });
    setDialogOpen(true);
  };

  const openEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      price: plan.price,
      interval: plan.interval,
      description: plan.description,
    });
    setDialogOpen(true);
  };

  const close = () => setDialogOpen(false);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const onIntervalChange = (e: ChangeEvent<{ value: unknown }>) => {
    setForm((f) => ({
      ...f,
      interval: e.target.value as "month" | "year",
    }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // if (editingPlan) {
    //   await updatePlan({ id: editingPlan.id, ...form }).unwrap();
    // } else {
    //   await addPlan(form).unwrap();
    // }
    close();
  };

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

      {isLoading ? (
        <CircularProgress />
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
                  <IconButton onClick={() => openEdit(plan)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    // onClick={() => deletePlan(plan.id)}
                    // disabled={deleting}
                    onClick={() => {alert("Delete plan")}} // Placeholder for delete action
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={close}>
        <DialogTitle>{editingPlan ? "Edit Plan" : "Add Plan"}</DialogTitle>
        <form onSubmit={onSubmit}>
          <DialogContent className="space-y-4">
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
          </DialogContent>
          <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
            //   disabled={adding || updating}
            >
              {editingPlan ? "Save Changes" : "Create Plan"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
