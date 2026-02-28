import React, { useEffect, useMemo, useState } from "react";
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
  Alert,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  useCashoutMutation,
  useGetBanksQuery,
  useGetTelcosQuery,
} from "@/redux/features/orders/orderApiSlice";
import { useAppSelector } from "@/redux";
import { RootState } from "@/app/store";

type CashoutFrom = "mobile_money" | "ghipss";

function getCashoutName(user: unknown): string {
  if (!user || typeof user !== "object") return "";
  const record = user as Record<string, unknown>;

  const vendorName = record["vendor_name"];
  if (typeof vendorName === "string" && vendorName.trim()) return vendorName;

  const name = record["name"];
  if (typeof name === "string" && name.trim()) return name;

  const username = record["user_name"] ?? record["username"];
  if (typeof username === "string" && username.trim()) return username;

  const firstName = record["first_name"];
  const lastName = record["last_name"];
  const joined = [firstName, lastName]
    .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    .join(" ")
    .trim();
  return joined;
}

interface CashoutModalProps {
  open: boolean;
  onClose: () => void;
}

const CashoutModal: React.FC<CashoutModalProps> = ({ open, onClose }) => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const cashoutName = useMemo(() => getCashoutName(user), [user]);

  const [cashoutFrom, setCashoutFrom] = useState<CashoutFrom | "">("");
  const [amount, setAmount] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [bankCode, setBankCode] = useState<string>("");

  const { data: telcos = [], isLoading: telcosLoading } = useGetTelcosQuery(
    undefined,
    { skip: cashoutFrom !== "mobile_money" }
  );
  const { data: banks = [], isLoading: banksLoading } = useGetBanksQuery(
    undefined,
    { skip: cashoutFrom !== "ghipss" }
  );

  const supportedOptions = cashoutFrom === "mobile_money" ? telcos : banks;
  const supportedLoading = cashoutFrom === "mobile_money" ? telcosLoading : banksLoading;
  const supportedEmpty =
    cashoutFrom === "mobile_money"
      ? !supportedLoading && telcos.length === 0
      : cashoutFrom === "ghipss"
        ? !supportedLoading && banks.length === 0
        : false;

  const [cashOut, { isLoading }] = useCashoutMutation();

  useEffect(() => {
    if (!open) return;
    // reset state each time modal opens
    setCashoutFrom("");
    setAmount("");
    setAccountNumber("");
    setBankCode("");
  }, [open]);

  useEffect(() => {
    // if user switches method, clear dependent fields
    setAccountNumber("");
    setBankCode("");
  }, [cashoutFrom]);

  const amountNumber = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) ? n : NaN;
  }, [amount]);

  const handleSubmit = async () => {
    try {
      if (!cashoutFrom) {
        toast.error("Please select a cashout method.");
        return;
      }

      const payload = {
        amount: amount.trim(),
        recipient_type: cashoutFrom,
        name: cashoutName,
        account_number: accountNumber.trim(),
        bank_code: bankCode,
        currency: "GHS" as const,
        reason: "Vendor cashout",
      };

      const res = await cashOut(payload).unwrap();
      const message =
        (typeof res?.message === "string" && res.message) ||
        (typeof res?.status === "string" && res.status) ||
        "Cashout initiated";
      toast.success(message);
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Cashout failed");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Cash Out Funds</DialogTitle>
      <DialogContent dividers className="space-y-4">
        <FormControl fullWidth>
          <InputLabel id="cashout-from-label">Cashout From</InputLabel>
          <Select
            labelId="cashout-from-label"
            value={cashoutFrom}
            label="Cashout From"
            onChange={(e) => setCashoutFrom(e.target.value as CashoutFrom)}
          >
            <MenuItem value="mobile_money">Mobile Money</MenuItem>
            <MenuItem value="ghipss">Bank</MenuItem>
          </Select>
        </FormControl>

        {cashoutFrom && supportedEmpty && (
          <Alert severity="warning">
            Cashout via {cashoutFrom === "mobile_money" ? "Mobile Money" : "Bank"} is currently unavailable.
          </Alert>
        )}

        {cashoutFrom && (
          <FormControl fullWidth disabled={supportedLoading || supportedEmpty}>
            <InputLabel id="bank-code-label">
              {cashoutFrom === "mobile_money" ? "Telco" : "Bank"}
            </InputLabel>
            <Select
              labelId="bank-code-label"
              value={bankCode}
              label={cashoutFrom === "mobile_money" ? "Telco" : "Bank"}
              onChange={(e) => setBankCode(String(e.target.value))}
            >
              {supportedOptions.map((o) => (
                <MenuItem key={o.id} value={o.code}>
                  {o.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {cashoutFrom && (
          <TextField
            label={cashoutFrom === "mobile_money" ? "MoMo Number" : "Account Number"}
            fullWidth
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder={cashoutFrom === "mobile_money" ? "e.g. 0551234567" : "e.g. 0123456789"}
            disabled={supportedEmpty}
          />
        )}

        <TextField
          label="Amount (GHS)"
          type="number"
          fullWidth
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={!cashoutFrom || supportedEmpty}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={
            isLoading ||
            !cashoutFrom ||
            supportedEmpty ||
            !cashoutName ||
            !accountNumber.trim() ||
            !bankCode ||
            !amount.trim() ||
            !(amountNumber > 0)
          }
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
