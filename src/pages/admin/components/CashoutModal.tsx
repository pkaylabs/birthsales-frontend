import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { useCashoutMutation } from "@/redux/features/orders/orderApiSlice";

interface CashoutModalProps {
  open: boolean;
  onClose: () => void;
}

const CashoutModal: React.FC<CashoutModalProps> = ({ open, onClose }) => {
  const [network, setNetwork] = useState<"MTN" | "VOD" | "AIR">("MTN");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState<number>(0);

  const [cashOut, { isLoading }] = useCashoutMutation()

  const handleSubmit = async () => {
    try {
      const res = await cashOut({ network, phone, amount }).unwrap();
      if (res.status === "success") {
        toast.success(res.message);
        onClose();
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Cash-out failed");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Cash Out Funds</DialogTitle>
      <DialogContent dividers className="space-y-4">
        <FormControl fullWidth>
          <InputLabel id="network-label">Network</InputLabel>
          <Select
            labelId="network-label"
            value={network}
            label="Network"
            onChange={(e) => setNetwork(e.target.value as any)}
          >
            <MenuItem value="MTN">MTN</MenuItem>
            <MenuItem value="VOD">Vodafone</MenuItem>
            <MenuItem value="AIR">AirtelTigo</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Phone Number"
          fullWidth
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g. 0551234567"
        />

        <TextField
          label="Amount (GHC)"
          type="number"
          fullWidth
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !phone || amount <= 0}
          variant="contained"
          color="primary"
          startIcon={isLoading ? <CircularProgress size={18} /> : null}
        >
          {isLoading ? "Processing…" : "Cash Out"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CashoutModal;
