import { ChangeEvent, FormEvent, useState } from "react";
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { useAppSelector } from "@/redux";
import { RootState } from "@/app/store";
import {
  CustomerCoupon,
  PublishingCreditCoupon,
  useCreateCustomerCouponMutation,
  useCreatePublishingCreditCouponMutation,
  useDeleteCustomerCouponMutation,
  useDeletePublishingCreditCouponMutation,
  useGetCustomerCouponsQuery,
  useGetPublishingCreditCouponsQuery,
  useRedeemPublishingCreditCouponMutation,
} from "@/redux/features/coupons/couponsApi";

const emptyCreditForm = {
  code: "",
  credit_type: "BOTH",
  product_credits: "1",
  service_credits: "1",
  max_redemptions: "1",
  expires_at: "",
};

const emptyCustomerForm = {
  code: "",
  discount_type: "PERCENTAGE",
  discount_value: "10",
  minimum_order_amount: "0",
  max_redemptions: "100",
  per_customer_limit: "1",
  expires_at: "",
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const err = error as { data?: { message?: string } | Record<string, unknown>; message?: string };
  if (typeof err?.data === "object" && err.data && "message" in err.data) {
    return String((err.data as { message?: string }).message);
  }
  return err?.message ?? fallback;
};

const toDateTimeIso = (value: string) => (value ? new Date(value).toISOString() : null);

export default function CouponsPage() {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const isAdmin = Boolean(user?.is_superuser || user?.is_staff || user?.user_type === "ADMIN");

  const { data: creditCoupons = [], isLoading: loadingCredits } =
    useGetPublishingCreditCouponsQuery(undefined, { skip: !isAdmin });
  const { data: customerCoupons = [], isLoading: loadingCustomerCoupons } =
    useGetCustomerCouponsQuery();

  const [createCreditCoupon, { isLoading: creatingCredit }] =
    useCreatePublishingCreditCouponMutation();
  const [deleteCreditCoupon] = useDeletePublishingCreditCouponMutation();
  const [redeemCreditCoupon, { isLoading: redeeming }] =
    useRedeemPublishingCreditCouponMutation();
  const [createCustomerCoupon, { isLoading: creatingCustomer }] =
    useCreateCustomerCouponMutation();
  const [deleteCustomerCoupon] = useDeleteCustomerCouponMutation();

  const [creditForm, setCreditForm] = useState(emptyCreditForm);
  const [customerForm, setCustomerForm] = useState(emptyCustomerForm);
  const [redeemCode, setRedeemCode] = useState("");

  const updateCreditForm = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCreditForm((form) => ({ ...form, [event.target.name]: event.target.value }));
  };

  const updateCustomerForm = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomerForm((form) => ({ ...form, [event.target.name]: event.target.value }));
  };

  const submitCreditCoupon = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await createCreditCoupon({
        code: creditForm.code,
        credit_type: creditForm.credit_type as PublishingCreditCoupon["credit_type"],
        product_credits: Number(creditForm.product_credits),
        service_credits: Number(creditForm.service_credits),
        max_redemptions: Number(creditForm.max_redemptions),
        expires_at: toDateTimeIso(creditForm.expires_at),
        is_active: true,
      }).unwrap();
      setCreditForm(emptyCreditForm);
      toast.success("Publishing credit coupon created");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to create coupon"));
    }
  };

  const submitCustomerCoupon = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await createCustomerCoupon({
        code: customerForm.code,
        discount_type: customerForm.discount_type as CustomerCoupon["discount_type"],
        discount_value: customerForm.discount_value,
        minimum_order_amount: customerForm.minimum_order_amount,
        max_redemptions: Number(customerForm.max_redemptions),
        per_customer_limit: Number(customerForm.per_customer_limit),
        expires_at: toDateTimeIso(customerForm.expires_at),
        is_active: true,
      }).unwrap();
      setCustomerForm(emptyCustomerForm);
      toast.success("Customer discount coupon created");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to create coupon"));
    }
  };

  const submitRedeem = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await redeemCreditCoupon({ code: redeemCode }).unwrap();
      setRedeemCode("");
      toast.success("Publishing credits added");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to redeem coupon"));
    }
  };

  const deleteCredit = async (coupon: PublishingCreditCoupon) => {
    if (!window.confirm(`Delete ${coupon.code}?`)) return;
    await deleteCreditCoupon(coupon.id).unwrap();
    toast.success("Coupon deleted");
  };

  const deleteCustomer = async (coupon: CustomerCoupon) => {
    if (!window.confirm(`Delete ${coupon.code}?`)) return;
    await deleteCustomerCoupon(coupon.id).unwrap();
    toast.success("Coupon deleted");
  };

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Box>
        <Typography variant="h5" fontWeight={700}>
          Coupons
        </Typography>
        <Typography color="text.secondary">
          Manage publishing credits and customer discounts.
        </Typography>
      </Box>

      {!isAdmin && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>
            Redeem Publishing Credits
          </Typography>
          <Box component="form" onSubmit={submitRedeem} display="flex" gap={2} flexWrap="wrap">
            <TextField
              label="Credit Coupon Code"
              value={redeemCode}
              onChange={(event) => setRedeemCode(event.target.value)}
              required
            />
            <Button type="submit" variant="contained" disabled={redeeming}>
              {redeeming ? "Redeeming..." : "Redeem"}
            </Button>
          </Box>
        </Paper>
      )}

      {isAdmin && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>
            Admin Publishing Credit Coupons
          </Typography>
          <Box component="form" onSubmit={submitCreditCoupon} display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }}>
            <TextField label="Code" name="code" value={creditForm.code} onChange={updateCreditForm} required />
            <FormControl>
              <InputLabel>Credit Type</InputLabel>
              <Select
                value={creditForm.credit_type}
                label="Credit Type"
                onChange={(event) => setCreditForm((form) => ({ ...form, credit_type: String(event.target.value) }))}
              >
                <MenuItem value="BOTH">Products and Services</MenuItem>
                <MenuItem value="PRODUCT">Products Only</MenuItem>
                <MenuItem value="SERVICE">Services Only</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Max Redemptions" name="max_redemptions" type="number" inputProps={{ min: 1 }} value={creditForm.max_redemptions} onChange={updateCreditForm} required />
            <TextField label="Product Credits" name="product_credits" type="number" inputProps={{ min: 0 }} value={creditForm.product_credits} onChange={updateCreditForm} />
            <TextField label="Service Credits" name="service_credits" type="number" inputProps={{ min: 0 }} value={creditForm.service_credits} onChange={updateCreditForm} />
            <TextField label="Expires At" name="expires_at" type="datetime-local" value={creditForm.expires_at} onChange={updateCreditForm} InputLabelProps={{ shrink: true }} />
            <Box>
              <Button type="submit" variant="contained" disabled={creatingCredit}>
                {creatingCredit ? "Creating..." : "Create Credit Coupon"}
              </Button>
            </Box>
          </Box>

          <TableContainer sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Credits</TableCell>
                  <TableCell>Usage</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingCredits ? (
                  <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow>
                ) : creditCoupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>{coupon.code}</TableCell>
                    <TableCell>{coupon.product_credits} products, {coupon.service_credits} services</TableCell>
                    <TableCell>{coupon.times_redeemed}/{coupon.max_redemptions}</TableCell>
                    <TableCell>
                      <Chip size="small" color={coupon.redeemable ? "success" : "default"} label={coupon.redeemable ? "Active" : "Unavailable"} />
                    </TableCell>
                    <TableCell align="right">
                      <Button color="error" onClick={() => deleteCredit(coupon)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          Customer Discount Coupons
        </Typography>
        {!isAdmin ? (
          <Box component="form" onSubmit={submitCustomerCoupon} display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }}>
            <TextField label="Code" name="code" value={customerForm.code} onChange={updateCustomerForm} required />
            <FormControl>
              <InputLabel>Discount Type</InputLabel>
              <Select
                value={customerForm.discount_type}
                label="Discount Type"
                onChange={(event) => setCustomerForm((form) => ({ ...form, discount_type: String(event.target.value) }))}
              >
                <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                <MenuItem value="FIXED">Fixed Amount</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Discount Value" name="discount_value" type="number" inputProps={{ min: 0, step: "0.01" }} value={customerForm.discount_value} onChange={updateCustomerForm} required />
            <TextField label="Minimum Order Amount" name="minimum_order_amount" type="number" inputProps={{ min: 0, step: "0.01" }} value={customerForm.minimum_order_amount} onChange={updateCustomerForm} />
            <TextField label="Max Redemptions" name="max_redemptions" type="number" inputProps={{ min: 1 }} value={customerForm.max_redemptions} onChange={updateCustomerForm} required />
            <TextField label="Per Customer Limit" name="per_customer_limit" type="number" inputProps={{ min: 1 }} value={customerForm.per_customer_limit} onChange={updateCustomerForm} required />
            <TextField label="Expires At" name="expires_at" type="datetime-local" value={customerForm.expires_at} onChange={updateCustomerForm} InputLabelProps={{ shrink: true }} />
            <Box>
              <Button type="submit" variant="contained" disabled={creatingCustomer}>
                {creatingCustomer ? "Creating..." : "Create Discount Coupon"}
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography color="text.secondary">
            Customer discount coupons are created by vendors.
          </Typography>
        )}

        <TableContainer sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                {isAdmin && <TableCell>Vendor</TableCell>}
                <TableCell>Discount</TableCell>
                <TableCell>Usage</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingCustomerCoupons ? (
                <TableRow><TableCell colSpan={isAdmin ? 6 : 5}>Loading...</TableCell></TableRow>
              ) : customerCoupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>{coupon.code}</TableCell>
                  {isAdmin && <TableCell>{coupon.vendor_name}</TableCell>}
                  <TableCell>{coupon.discount_type === "PERCENTAGE" ? `${coupon.discount_value}%` : `GHC${coupon.discount_value}`}</TableCell>
                  <TableCell>{coupon.times_redeemed}/{coupon.max_redemptions}</TableCell>
                  <TableCell>
                    <Chip size="small" color={coupon.redeemable ? "success" : "default"} label={coupon.redeemable ? "Active" : "Unavailable"} />
                  </TableCell>
                  <TableCell align="right">
                    <Button color="error" onClick={() => deleteCustomer(coupon)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
