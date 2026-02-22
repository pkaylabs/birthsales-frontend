import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";

import { usePaystackCheckStatusMutation } from "@/redux/features/orders/orderApiSlice";

export interface TablesProps {
  payment_id: string;
  customer_name: string;
  created_at: string;
  what_was_paid_for: string;
  amount: number;
  payment_method: string;
  status: string;
}



const Tables = ({ rows }: { rows: TablesProps[] }) => {
  const [checkPaystackStatus, { isLoading: statusLoading }] =
    usePaystackCheckStatusMutation();
  const [checkingRef, setCheckingRef] = useState<string | null>(null);

  const isPendingStatus = (status: unknown): boolean =>
    /pending/i.test(String(status ?? ""));
  const isPaystack = (method: unknown): boolean =>
    /paystack/i.test(String(method ?? ""));

  const extractErrorMessage = (err: unknown, fallback: string): string => {
    if (!err) return fallback;
    if (typeof err === "string") return err;
    if (typeof err === "object" && err !== null) {
      const maybe = err as { data?: unknown; error?: unknown; message?: unknown };
      if (typeof maybe.message === "string" && maybe.message.trim()) return maybe.message;
      if (typeof maybe.error === "string" && maybe.error.trim()) return maybe.error;

      if (typeof maybe.data === "string" && maybe.data.trim()) return maybe.data;
      if (typeof maybe.data === "object" && maybe.data !== null) {
        const dataObj = maybe.data as { message?: unknown; detail?: unknown };
        if (typeof dataObj.message === "string" && dataObj.message.trim()) return dataObj.message;
        if (typeof dataObj.detail === "string" && dataObj.detail.trim()) return dataObj.detail;
      }
    }
    return fallback;
  };

  const handleCheckStatus = async (reference: string) => {
    const ref = String(reference ?? "").trim();
    if (!ref) {
      toast.error("Missing payment reference");
      return;
    }

    try {
      setCheckingRef(ref);
      const res = await checkPaystackStatus({ reference: ref }).unwrap();
      if (String(res.status).toLowerCase() === "success") {
        toast.success(res.message || "Payment confirmed");
      } else {
        toast(res.message || `Payment status: ${res.status || "unknown"}`);
      }
    } catch (err) {
      toast.error(extractErrorMessage(err, "Failed to check payment status"));
    } finally {
      setCheckingRef(null);
    }
  };

  return (
    <TableContainer component={Paper} className="">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="">Tracking ID</TableCell>
            <TableCell className="">Customer</TableCell>
            <TableCell className="">Reason</TableCell>
            <TableCell className="">Date</TableCell>
            <TableCell className="">Amount</TableCell>
            <TableCell className="">Payment method</TableCell>
            <TableCell className="">Status</TableCell>
            <TableCell className="" align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.payment_id}>
              <TableCell>{row.payment_id}</TableCell>
              <TableCell>{row.customer_name}</TableCell>
              <TableCell>{row.what_was_paid_for}</TableCell>
              <TableCell>
                {row.created_at.split(".")[0].replace("T", " ")}
              </TableCell>
              <TableCell>GHC{row.amount}</TableCell>
              <TableCell>{row.payment_method}</TableCell>
              <TableCell>
                <span
                  className={`p-[5px] rounded-md ${
                    /approved|success/i.test(row.status)
                      ? "text-green-300 bg-green-950"
                      : "text-yellow-300 bg-yellow-950"
                  }`}
                >
                  {row.status}
                </span>
              </TableCell>
              <TableCell align="right">
                {isPendingStatus(row.status) && isPaystack(row.payment_method) ? (
                  <Button
                    size="small"
                    variant="contained"
                    disabled={statusLoading}
                    onClick={() => handleCheckStatus(row.payment_id)}
                  >
                    {statusLoading && checkingRef === String(row.payment_id)
                      ? "Checking..."
                      : "Check status"}
                  </Button>
                ) : (
                  "-"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Tables;
