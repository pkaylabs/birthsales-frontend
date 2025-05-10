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
import { useMobilePaymentMutation } from "@/redux/features/orders/orderApiSlice";
import { useNavigate } from "react-location";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  bookingId: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  bookingId,
}) => {
  const navigate = useNavigate();
  const [network, setNetwork] = useState("MTN");
  const [phone, setPhone] = useState("");
  const [payBooking, { isLoading }] = useMobilePaymentMutation();

  const handlePay = async () => {
    try {
      const res = await payBooking({
        booking: bookingId,
        network,
        phone,
      }).unwrap();
      if (res.status === "success") {
        toast.success(res.message);
        onClose();
        navigate({ to: "/" });
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Payment failed");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Pay for this Service</DialogTitle>
      <DialogContent dividers className="space-y-4">
        <FormControl fullWidth>
          <InputLabel id="network-label">Network</InputLabel>
          <Select
            labelId="network-label"
            value={network}
            label="Network"
            onChange={(e) => setNetwork(e.target.value)}
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
          placeholder="0546573849"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handlePay}
          disabled={!phone || isLoading}
          variant="contained"
          startIcon={isLoading ? <CircularProgress size={18} /> : null}
        >
          {isLoading ? "Processing…" : "Pay Now"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;
