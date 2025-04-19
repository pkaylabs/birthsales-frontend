import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Ads = () => {
  const [open, setOpen] = useState(false);

  const [ads, setAds] = useState([
    {
      id: 1,
      name: "Homepage Banner",
      status: "Active",
      clicks: 1200,
      budget: 500,
    },
    {
      id: 2,
      name: "Sidebar Ad",
      status: "Paused",
      clicks: 800,
      budget: 300,
    },
  ]);

  const [newAd, setNewAd] = useState({ name: "", budget: "" });
  const [totalBudget, setTotalBudget] = useState(0);

  const chartData = [
    { month: "Jan", clicks: 500 },
    { month: "Feb", clicks: 1200 },
    { month: "Mar", clicks: 1500 },
    { month: "Apr", clicks: 2000 },
    { month: "May", clicks: 2500 },
  ];

  useEffect(() => {
    const budgetSum = ads.reduce(
      (sum, ad) => sum + parseFloat(ad.budget.toString()),
      0
    );
    setTotalBudget(budgetSum);
  }, [ads]);

  return (
    <div className="p-6 space-y-6">
      {/* Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent>Total Ads: {ads.length}</CardContent>
        </Card>
        <Card>
          <CardContent>
            Active Ads: {ads.filter((ad) => ad.status === "Active").length}
          </CardContent>
        </Card>
        <Card>
          <CardContent>Clicks: 3,000+</CardContent>
        </Card>
        <Card>
          <CardContent>Budget Spent: ${totalBudget}</CardContent>
        </Card>
      </div>
      {/* Ad management table */}
      <div className="bg-white shadow rounded p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Manage Ads</h2>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
          >
            Add New Ad
          </Button>
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Create New Ad</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                margin="dense"
                label="Ad Name"
                variant="outlined"
                onChange={(e) => setNewAd({ ...newAd, name: e.target.value })}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Budget"
                variant="outlined"
                onChange={(e) => setNewAd({ ...newAd, budget: e.target.value })}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setAds([
                    ...ads,
                    {
                      ...newAd,
                      id: ads.length + 1,
                      status: "Active",
                      clicks: 0,
                      budget: parseFloat(newAd.budget) || 0,
                    },
                  ]);
                  setOpen(false);
                }}
              >
                Save
              </Button>
            </DialogContent>
          </Dialog>
        </div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Clicks</TableCell>
                <TableCell>Budget ($)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ads.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell>{ad.name}</TableCell>
                  <TableCell>{ad.status}</TableCell>
                  <TableCell>{ad.clicks}</TableCell>
                  <TableCell>${ad.budget}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {/* Analytics */}
      <div className="bg-white shadow rounded p-4 h-[50vh] w-full">
        <h2 className="text-xl font-bold mb-4">Ad Performance</h2>
        <ResponsiveContainer width={"100%"}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={"month"} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type={"monotone"}
              dataKey={"clicks"}
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Ads;
