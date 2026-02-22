import { useChangePasswordMutation } from "@/redux/features/auth/authApiSlice";
import {
  useGetSubscriptionsQuery,
} from "@/redux/features/subscriptions/subscriptionSlice";
import {
  usePaystackCheckStatusMutation,
  usePaystackInitializePaymentMutation,
} from "@/redux/features/orders/orderApiSlice";
import { useUpdateUserProfileMutation } from "@/redux/features/users/usersApi";
import {
  useGetVendorProfileQuery,
  useUpdateVendorProfileMutation,
} from "@/redux/features/vendor/vendorApiSlice";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-location";
import { toast } from "react-toastify";
import { VENDOR_SIGN_UP } from "@/constants";

const LS_RENEWAL_PAYSTACK_REF = "paystack_subscription_renewal_reference";
const LS_RENEWAL_PAYSTACK_URL = "paystack_subscription_renewal_auth_url";

export interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface VendorForm {
  vendor_name: string;
  vendor_email: string;
  vendor_phone: string;
  vendor_address: string;
}

const Setting = () => {
  const navigate = useNavigate();

  const isRecord = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null;

  const extractErrorMessage = (err: unknown, fallback: string): string => {
    if (!err) return fallback;
    if (typeof err === "string") return err;
    if (isRecord(err)) {
      const data = err.data;
      if (typeof data === "string") return data;
      if (isRecord(data)) {
        const message = data.message;
        if (typeof message === "string") return message;
        const detail = data.detail;
        if (typeof detail === "string") return detail;
      }
      const message = err.message;
      if (typeof message === "string") return message;
    }
    return fallback;
  };

  const [visible, setVisible] = useState(false);
  const [updateUserProfile, { isLoading: updating }] =
    useUpdateUserProfileMutation();

  // Renewal modal state
  const [openModal, setOpenModal] = useState(false);
  const [paystackReference, setPaystackReference] = useState<string | null>(
    null
  );
  const [paystackAuthUrl, setPaystackAuthUrl] = useState<string | null>(null);

  const [initializePaystack, { isLoading: initLoading }] =
    usePaystackInitializePaymentMutation();
  const [checkPaystackStatus, { isLoading: statusLoading }] =
    usePaystackCheckStatusMutation();

  // Basic Profile
  const [profile, setProfile] = useState<ProfileForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Vendor Profile
  const { data: vendorProfile, isLoading: vLoading } =
    useGetVendorProfileQuery();
  const [updateVendorProfile, { isLoading: vUpdating }] =
    useUpdateVendorProfileMutation();

  const [vendorForm, setVendorForm] = useState<VendorForm>({
    vendor_name: "",
    vendor_email: "",
    vendor_phone: "",
    vendor_address: "",
  });

  // Reset the password
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    if (vendorProfile) {
      setVendorForm({
        vendor_name: vendorProfile.vendor.vendor_name,
        vendor_email: vendorProfile.vendor.vendor_email,
        vendor_phone: vendorProfile.vendor.vendor_phone,
        vendor_address: vendorProfile.vendor.vendor_address,
      });
      setProfile({
        name: vendorProfile.user.name,
        email: vendorProfile.user.email,
        phone: vendorProfile.user.phone,
        address: vendorProfile.user.address,
      });
      setPasswords({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    }
  }, [vendorProfile]);

  const [changePwd, { isLoading: pwdLoading }] = useChangePasswordMutation();

  // Subscription status
  const { data: subscriptions = [] } = useGetSubscriptionsQuery(undefined, {
    skip: false,
  });

  const mySubscriptions = subscriptions.find(
    (s) => s.vendor === vendorProfile?.vendor?.id
  );

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const submitProfile = async () => {
    try {
      await updateUserProfile(profile).unwrap();
      toast.success("Profile updated successfully");
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to update profile"));
    }
  };

  const handleVendorChange = (e: ChangeEvent<HTMLInputElement>) =>
    setVendorForm((v) => ({ ...v, [e.target.name]: e.target.value }));

  const submitVendor = async () => {
    try {
      const res = await updateVendorProfile(vendorForm).unwrap();
      toast.success(res.message);
    } catch (error) {
      toast.error("Update failed");
      console.log(error);
    }
  };

  const handlePwdChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPasswords((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submitPassword = () => {
    if (passwords.new_password !== passwords.confirm_password) {
      toast.error("New passwords do not match");
      return;
    }
    changePwd({
      old_password: passwords.old_password,
      new_password: passwords.new_password,
      confirm_password: passwords.confirm_password,
    })
      .unwrap()
      .then(() => {
        toast.success("Password Changed");
        setPasswords({
          old_password: "",
          new_password: "",
          confirm_password: "",
        });
      })
      .catch(() => toast.error("Password change failed"));
  };

  const isPaidStatus = (status: string): boolean => {
    const s = status.toLowerCase();
    return (
      s === "success" ||
      s === "successful" ||
      s === "paid" ||
      s === "completed" ||
      s === "complete"
    );
  };

  // Auto-check status after Paystack redirects back.
  useEffect(() => {
    const pendingRef = localStorage.getItem(LS_RENEWAL_PAYSTACK_REF);
    if (!pendingRef) return;

    const pendingUrl = localStorage.getItem(LS_RENEWAL_PAYSTACK_URL);
    setPaystackReference(pendingRef);
    if (pendingUrl) setPaystackAuthUrl(pendingUrl);
    setOpenModal(true);

    (async () => {
      try {
        const res = await checkPaystackStatus({ reference: pendingRef }).unwrap();
        if (res.status && isPaidStatus(res.status)) {
          localStorage.removeItem(LS_RENEWAL_PAYSTACK_REF);
          localStorage.removeItem(LS_RENEWAL_PAYSTACK_URL);
          toast.success("Payment confirmed");
          setOpenModal(false);
          setPaystackReference(null);
          setPaystackAuthUrl(null);
          return;
        }
        toast.info(res.message || `Payment status: ${res.status || "unknown"}`);
      } catch (err: unknown) {
        toast.error(extractErrorMessage(err, "Failed to check payment status"));
      }
    })();
  }, [checkPaystackStatus]);

  const handleRenew = async () => {
    if (!mySubscriptions) return;
    try {
      const res = await initializePaystack({ subscription: mySubscriptions.id }).unwrap();

      if (res.status === "failed") {
        toast.error(res.message || "Payment initialization failed");
        return;
      }

      setPaystackReference(res.reference);
      setPaystackAuthUrl(res.authorization_url);

      localStorage.setItem(LS_RENEWAL_PAYSTACK_REF, res.reference);
      localStorage.setItem(LS_RENEWAL_PAYSTACK_URL, res.authorization_url);

      // Same-tab redirect for a smoother flow.
      window.location.assign(res.authorization_url);
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Renewal failed"));
    }
  };

  const handleCheckRenewalStatus = async () => {
    if (!paystackReference) {
      toast.error("No payment reference found");
      return;
    }

    try {
      const res = await checkPaystackStatus({ reference: paystackReference }).unwrap();
      if (res.status && isPaidStatus(res.status)) {
        toast.success("Payment confirmed");
        localStorage.removeItem(LS_RENEWAL_PAYSTACK_REF);
        localStorage.removeItem(LS_RENEWAL_PAYSTACK_URL);
        setOpenModal(false);
        setPaystackReference(null);
        setPaystackAuthUrl(null);
        return;
      }
      toast.info(res.message || `Payment status: ${res.status || "unknown"}`);
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to check payment status"));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
      {/* Basic Profile */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Basic Profile</h2>
        {([
          "name",
          "email",
          "phone",
          "address",
        ] as const satisfies ReadonlyArray<keyof ProfileForm>).map((field) => (
          <div key={field} className="mb-3">
            <label
              htmlFor={`profile-${field}`}
              className="block text-sm font-medium capitalize"
            >
              {field}
            </label>
            <input
              id={`profile-${field}`}
              name={field}
              value={profile[field]}
              onChange={handleProfileChange}
              className="mt-1 w-full px-2 py-1 border rounded"
              placeholder={`Enter ${field}`}
            />
          </div>
        ))}
        <button
          onClick={submitProfile}
          className="mt-2 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition"
        >
          {updating ? <CircularProgress size={20} /> : "Save"}
        </button>
      </section>

      {/* Vendor Profile (only for vendors) */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Vendor Profile</h2>
        {vLoading ? (
          <p>Loading…</p>
        ) : (
          <>
            {([
              "vendor_name",
              "vendor_email",
              "vendor_phone",
              "vendor_address",
            ] as const satisfies ReadonlyArray<keyof VendorForm>).map((field) => (
              <div key={field} className="mb-3">
                <label
                  htmlFor={`vendor-${field}`}
                  className="block text-sm font-medium"
                >
                  {field.replace("vendor_", "").replace("_", " ")}
                </label>
                <input
                  id={`vendor-${field}`}
                  name={field}
                  value={vendorForm[field]}
                  onChange={handleVendorChange}
                  className="mt-1 w-full px-2 py-1 border rounded"
                  placeholder={`Enter ${field.replace("vendor_", "").replace("_", " ")}`}
                />
              </div>
            ))}
            <button
              disabled={vUpdating}
              onClick={submitVendor}
              className="mt-2 w-full bg-green-600 text-white py-1 rounded hover:bg-green-700 transition"
            >
              {vUpdating ? <CircularProgress size={20} /> : "Save"}
            </button>
          </>
        )}
      </section>

      {/* Reset Password */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Reset Password</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitPassword();
          }}
        >
          {["old_password", "new_password", "confirm_password"].map((field) => {
            const inputId = `password-${field}`;
            const label =
              field === "old_password"
                ? "Current Password"
                : field === "new_password"
                ? "New Password"
                : "Confirm New Password";

            return (
              <div key={field} className="mb-4 relative">
                <label htmlFor={inputId} className="block text-sm font-medium">
                  {label}
                </label>
                {visible ? (
                  <input
                    id={inputId}
                    type="text"
                    name={field}
                    value={passwords[field as keyof typeof passwords]}
                    onChange={handlePwdChange}
                    className="mt-1 w-full px-3 py-2 border rounded pr-10"
                    placeholder={label}
                    autoComplete="off"
                  />
                ) : field === "old_password" ? (
                  <input
                    id={inputId}
                    type="password"
                    name={field}
                    value={passwords[field as keyof typeof passwords]}
                    onChange={handlePwdChange}
                    className="mt-1 w-full px-3 py-2 border rounded pr-10"
                    placeholder={label}
                    autoComplete="current-password"
                  />
                ) : (
                  <input
                    id={inputId}
                    type="password"
                    name={field}
                    value={passwords[field as keyof typeof passwords]}
                    onChange={handlePwdChange}
                    className="mt-1 w-full px-3 py-2 border rounded pr-10"
                    placeholder={label}
                    autoComplete="new-password"
                  />
                )}
                <button
                  type="button"
                  onClick={() => setVisible((v) => !v)}
                  className="absolute inset-y-0 right-2 flex items-center top-5"
                >
                  {visible ? (
                    <EyeSlashIcon className="w-4 h-4 text-gray-500" />
                  ) : (
                    <EyeIcon className="w-4 h- text-gray-500" />
                  )}
                </button>
              </div>
            );
          })}
          <button
            disabled={pwdLoading}
            type="submit"
            className="mt-10 w-full bg-yellow-600 text-white py-1 rounded hover:bg-yellow-700 transition"
          >
            {pwdLoading ? <CircularProgress size={20} /> : "Change Password"}
          </button>
        </form>
      </section>

      {/* Subscription Status */}
      <section className="bg-white p-4 rounded shadow flex flex-col justify-between">
        <h2 className="text-lg font-semibold mb-2">Subscription</h2>
        {!mySubscriptions ? (
          <div className="flex flex-col gap-3">
            <p>No subscription found.</p>
            <button
              type="button"
              onClick={() => navigate({ to: VENDOR_SIGN_UP, search: { step: 3 } })}
              className="w-full bg-yellow-600 text-white py-1 rounded hover:bg-yellow-700 transition"
            >
              Subscribe to a plan
            </button>
          </div>
        ) : (
          <>
            <p>
              <strong>Plan:</strong> {mySubscriptions.package_name}
            </p>
            <p>
              <strong>Package Price:</strong> GHC{mySubscriptions.package_price}
            </p>

            <p>
              <strong>Status:</strong> {mySubscriptions.payment_status}
            </p>

            <p>
              <strong>Expired:</strong> {mySubscriptions.expired ? "Yes" : "No"}
            </p>
            {mySubscriptions.expired === true ? (
              <button
                onClick={() => setOpenModal(true)}
                className="mt-4 w-full bg-red text-white py-1 rounded hover:bg-red transition"
              >
                Renew
              </button>
            ) : (
              <span className="mt-4 text-green-600 font-medium">Active</span>
            )}
            {openModal && (
              <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle>
                  <Typography variant="h6">Renew your subscription</Typography>
                </DialogTitle>
                <DialogContent dividers>
                  <Box display={"flex"} flexDirection={"column"} gap={2}>
                    <Typography variant="body2" color="textSecondary">
                      Renewal payments are processed via Paystack. Clicking “Pay with Paystack” will redirect you to the Paystack payment page in this tab.
                    </Typography>

                    {paystackAuthUrl && (
                      <a
                        href={paystackAuthUrl}
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.assign(paystackAuthUrl);
                        }}
                        className="text-blue-600 underline break-all"
                      >
                        Continue payment
                      </a>
                    )}

                    {paystackReference && (
                      <TextField
                        label="Reference"
                        fullWidth
                        value={paystackReference}
                        InputProps={{ readOnly: true }}
                      />
                    )}
                  </Box>
                </DialogContent>

                <DialogActions>
                  <Button onClick={() => setOpenModal(false)}>Close</Button>
                  <Button
                    onClick={handleRenew}
                    type="submit"
                    variant="contained"
                    disabled={initLoading || statusLoading}
                  >
                    {initLoading ? (
                      <CircularProgress size={20} sx={{ color: "white" }} />
                    ) : (
                      "Pay with Paystack"
                    )}
                  </Button>

                  <Button
                    onClick={handleCheckRenewalStatus}
                    variant="outlined"
                    disabled={!paystackReference || statusLoading}
                  >
                    {statusLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      "Check status"
                    )}
                  </Button>
                </DialogActions>
              </Dialog>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Setting;
