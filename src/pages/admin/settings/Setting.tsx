import { useChangePasswordMutation } from "@/redux/features/auth/authApiSlice";
import {
  useGetSubscriptionsQuery,
  useRenewSubscriptionsMutation,
} from "@/redux/features/subscriptions/subscriptionSlice";
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
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

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
  const [visible, setVisible] = useState(false);
  const [updateUserProfile, { isLoading: updating }] =
    useUpdateUserProfileMutation();

  const [renew, { isLoading: renewing }] = useRenewSubscriptionsMutation();

  // Renewal modal state
  const [openModal, setOpenModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [network, setNetwork] = useState<"MTN" | "VOD" | "AIR">("MTN");

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


  console.log(subscriptions)

  const mySubscriptions = subscriptions.find(
    (s) => s.vendor === vendorProfile?.vendor?.id
  );

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const submitProfile = async () => {
    try {
      updateUserProfile(profile).unwrap();
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log(error);
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

  const handleRenew = async () => {
    if (!mySubscriptions) return;
    try {
      const res = await renew({
        subscription: mySubscriptions?.id,
        phone,
        network,
      }).unwrap();
      toast.success(res.message || "Renewal successful");
      setPhone("");
      setOpenModal(false);
    } catch (err: any) {
      toast.error(err.data.message || "Renewal failed");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
      {/* Basic Profile */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Basic Profile</h2>
        {["name", "email", "phone", "address"].map((field) => (
          <div key={field} className="mb-3">
            <label className="block text-sm font-medium capitalize">
              {field}
            </label>
            <input
              name={field}
              value={(profile as any)[field]}
              onChange={handleProfileChange}
              className="mt-1 w-full px-2 py-1 border rounded"
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
            {[
              "vendor_name",
              "vendor_email",
              "vendor_phone",
              "vendor_address",
            ].map((field) => (
              <div key={field} className="mb-3">
                <label className="block text-sm font-medium">
                  {field.replace("vendor_", "").replace("_", " ")}
                </label>
                <input
                  name={field}
                  value={(vendorForm as any)[field]}
                  onChange={handleVendorChange}
                  className="mt-1 w-full px-2 py-1 border rounded"
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
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            submitPassword();
          }}
        >
          {["old_password", "new_password", "confirm_password"].map((field) => {
            const label =
              field === "old_password"
                ? "Current Password"
                : field === "new_password"
                ? "New Password"
                : "Confirm New Password";

            const autoCompleteAttr =
              field === "old_password" ? "current-password" : "new-password";

            return (
              <div key={field} className="mb-4 relative">
                <label className="block text-sm font-medium">{label}</label>
                <input
                  type={visible ? "text" : "password"}
                  name={field}
                  value={(passwords as any)[field]}
                  onChange={handlePwdChange}
                  className="mt-1 w-full px-3 py-2 border rounded pr-10"
                  placeholder=""
                  autoComplete={autoCompleteAttr}
                />
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
          <p>No subscription found.</p>
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
                    <InputLabel>Select network</InputLabel>
                    <Select
                      label="Select network"
                      value={network}
                      onChange={(e: any) => setNetwork(e.target.value)}
                      fullWidth
                    >
                      <MenuItem value="MTN">MTN</MenuItem>
                      <MenuItem value="VOD">TELECEL</MenuItem>
                      <MenuItem value="AIR">AIRTEL</MenuItem>
                    </Select>
                    <TextField
                      label="phone"
                      fullWidth
                      value={phone}
                      onChange={(e: any) => setPhone(e.target.value)}
                      required
                    />
                  </Box>
                </DialogContent>

                <DialogActions>
                  <Button onClick={() => setOpenModal(false)}>Close</Button>
                  <Button
                    onClick={handleRenew}
                    type="submit"
                    variant="contained"
                  >
                    {renewing ? (
                      <CircularProgress size={20} sx={{ color: "white" }} />
                    ) : (
                      "Renew Subscription"
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
