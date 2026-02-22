import React, { ChangeEvent, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-location";
import { useRegisterMutation } from "@/redux/features/auth/authApiSlice";
import {
  useCreateBusinessMutation,
  useSubscribePlanMutation,
} from "@/redux/features/business/businessApiSlice";
import { useGetPlansQuery } from "@/redux/features/plans/plansApi";
import { ADMIN_HOME } from "@/constants";
import type { Plan } from "@/redux/type";
import { useAppSelector } from "@/redux";
import { RootState } from "@/app/store";
import { toast } from "react-toastify";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  usePaystackCheckStatusMutation,
  usePaystackInitializePaymentMutation,
} from "@/redux/features/orders/orderApiSlice";

const GH_PHONE = /^(?:0|233)(?:24|25|54|55|20|26|27|50|56|57|28)\d{7}$/;
const STRONG_PWD =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

const LS_VENDOR_PAYSTACK_REF = "paystack_vendor_onboarding_reference";
const LS_VENDOR_PAYSTACK_URL = "paystack_vendor_onboarding_auth_url";

const VendorAccount: React.FC = () => {
  const location = useLocation();
  const isRecord = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null;

  const extractErrorMessage = (err: unknown, fallback: string): string => {
    if (!err) return fallback;
    if (typeof err === "string") return err;

    const fromStringArray = (v: unknown): string | null => {
      if (!Array.isArray(v) || v.length === 0) return null;
      const strings = v.filter((x): x is string => typeof x === "string");
      return strings.length ? strings.join(" ") : null;
    };

    const fromRecord = (obj: Record<string, unknown>): string | null => {
      for (const value of Object.values(obj)) {
        if (typeof value === "string" && value.trim()) return value;
        const joined = fromStringArray(value);
        if (joined) return joined;
      }
      return null;
    };

    if (isRecord(err)) {
      const data = err.data;
      if (typeof data === "string") return data;
      if (isRecord(data)) {
        const errorMessage = data.error_message;
        if (typeof errorMessage === "string") return errorMessage;
        const detail = data.detail;
        if (typeof detail === "string") return detail;
        const message = data.message;
        if (typeof message === "string") return message;

        // Some APIs return field validation errors, e.g. { error: { vendor_phone: ["..."] } }
        const nestedError = data.error;
        if (isRecord(nestedError)) {
          const nestedMsg = fromRecord(nestedError);
          if (nestedMsg) return nestedMsg;
        }

        // Or validation errors at the top-level of data, e.g. { vendor_phone: ["..."] }
        const flatMsg = fromRecord(data);
        if (flatMsg) return flatMsg;
      }
      const message = err.message;
      if (typeof message === "string") return message;
    }

    return fallback;
  };

  const token = useAppSelector((state: RootState) => state.auth.token);
  const [step, setStep] = useState(1);
  const [accountData, setAccountData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [vendorData, setVendorData] = useState({
    vendor_name: "",
    vendor_email: "",
    vendor_phone: "",
    vendor_address: "",
  });
  const [viewingPlan, setViewingPlan] = useState<Plan | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paystackReference, setPaystackReference] = useState<string | null>(
    null
  );
  const [paystackAuthUrl, setPaystackAuthUrl] = useState<string | null>(null);
  const [paystackDialogOpen, setPaystackDialogOpen] = useState(false);

  const [accountError, setAccountError] = useState<string | null>(null);
  const [businessError, setBusinessError] = useState<string | null>(null);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<number | null>(null);

  const [register, { isLoading: regLoading }] = useRegisterMutation();
  const [createBusiness, { isLoading: bizLoading }] =
    useCreateBusinessMutation();
  const {
    data: plans = [],
    isLoading: plansLoading,
    error: plansError,
  } = useGetPlansQuery(undefined, { skip: !token || step < 3 });
  const [subscribePlan, { isLoading: subLoading }] = useSubscribePlanMutation();
  const [initializePaystack, { isLoading: initLoading }] =
    usePaystackInitializePaymentMutation();
  const [checkPaystackStatus, { isLoading: statusLoading }] =
    usePaystackCheckStatusMutation();

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

  const parseStepFromSearch = (search: unknown): number | null => {
    if (!search || typeof search !== "object") return null;
    const raw = (search as Record<string, unknown>).step;
    const n = typeof raw === "number" ? raw : typeof raw === "string" ? Number(raw) : NaN;
    if (!Number.isFinite(n)) return null;
    const stepNum = Math.trunc(n);
    // Supported UI steps: 1=Account, 2=Business Profile, 3=Plan, 4=Payment
    if (stepNum < 1 || stepNum > 4) return null;
    return stepNum;
  };

  // Allow deep-linking into a specific onboarding step (e.g. vendors subscribing later: ?step=3)
  useEffect(() => {
    const desired = parseStepFromSearch(location.current.search);
    if (!desired) return;
    // Step 3+ requires auth token to fetch plans/subscribe.
    if (desired >= 3 && !token) return;
    setStep(desired);
    // Only run when URL/search changes or token becomes available.
  }, [location.current.search, token]);

  // If Paystack redirects back to this page, auto-check the last pending reference
  // so users don't need to manually click "Check status".
  useEffect(() => {
    const pendingRef = localStorage.getItem(LS_VENDOR_PAYSTACK_REF);
    if (!pendingRef) return;

    const pendingUrl = localStorage.getItem(LS_VENDOR_PAYSTACK_URL);
    setPaystackReference(pendingRef);
    if (pendingUrl) setPaystackAuthUrl(pendingUrl);
    setStep(4);

    (async () => {
      try {
        const res = await checkPaystackStatus({ reference: pendingRef }).unwrap();
        if (res.status && isPaidStatus(res.status)) {
          localStorage.removeItem(LS_VENDOR_PAYSTACK_REF);
          localStorage.removeItem(LS_VENDOR_PAYSTACK_URL);
          toast.success("Payment confirmed");
          setPaystackDialogOpen(false);
          setStep(5);
          return;
        }

        setPaystackDialogOpen(true);
        toast.info(res.message || `Payment status: ${res.status || "unknown"}`);
      } catch (err: unknown) {
        setPaystackDialogOpen(true);
        toast.error(extractErrorMessage(err, "Failed to check payment status"));
      }
    })();
  }, [checkPaystackStatus]);

  const handleAccountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountData((prev) => ({ ...prev, [name]: value }));
  };
  const handleVendorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVendorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccountSubmit = async () => {
    setAccountError(null);
    if (!GH_PHONE.test(accountData.phone)) {
      setAccountError("Enter a valid number, e.g. 0546573849 or 233546573849");
      return;
    }
    if (!STRONG_PWD.test(accountData.password)) {
      setAccountError(
        "Password must be ≥8 chars, include uppercase, lowercase, number & special character"
      );
      return;
    }
    try {
      await register({
        name: accountData.fullName,
        email: accountData.email,
        phone: accountData.phone,
        address: accountData.address,
        password: accountData.password,
        user_type: "VENDOR",
      }).unwrap();
      toast.success("Success: Proceed to create business profile");
      setStep(2);
    } catch (err: unknown) {
      const msg = extractErrorMessage(err, "Failed to create account");
      setAccountError(msg);
      toast.error(msg);
    }
  };
  const handleBusinessSubmit = async () => {
    setBusinessError(null);
    if (!GH_PHONE.test(vendorData.vendor_phone)) {
      setBusinessError(
        "Enter a valid vendor phone number, e.g. 0546573849 or 233546573849"
      );
      return;
    }
    try {
      await createBusiness(vendorData).unwrap();
      toast.success("Success: Select a subscription plan");
      setStep(3);
    } catch (err: unknown) {
      const msg = extractErrorMessage(err, "Failed to create vendor profile");
      setBusinessError(msg);
      toast.error(msg);
    }
  };
  const handlePlanSubscribe = async () => {
    setSubscribeError(null);
    if (!selectedPlan) return;
    try {
      const res = await subscribePlan({ package: selectedPlan.id }).unwrap();
      setSubscriptionId(res.id);
      toast.success("Proceed to make payment");
      setStep(4);
    } catch (err: unknown) {
      const msg = extractErrorMessage(err, "Subscription Failed");
      setSubscribeError(msg);
      toast.error(msg);
    }
  };

  const handlePayment = async () => {
    setPaymentError(null);
    if (!selectedPlan) {
      setPaymentError("No plan selected");
      return;
    }

    if (!subscriptionId) {
      setPaymentError("Subscription not found. Please re-select your plan.");
      return;
    }

    try {
      const res = await initializePaystack({ subscription: subscriptionId }).unwrap();

      if (res.status === "failed") {
        const msg = res.message || "Payment initialization failed";
        setPaymentError(msg);
        toast.error(msg);
        return;
      }

      setPaystackReference(res.reference);
      setPaystackAuthUrl(res.authorization_url);

      // Persist so we can auto-check after Paystack redirects back
      localStorage.setItem(LS_VENDOR_PAYSTACK_REF, res.reference);
      localStorage.setItem(LS_VENDOR_PAYSTACK_URL, res.authorization_url);

      // Keep the user in the same tab for a smoother flow.
      window.location.assign(res.authorization_url);
    } catch (err: unknown) {
      const msg = extractErrorMessage(err, "Payment failed");
      setPaymentError(msg);
      toast.error(msg);
    }
  };

  const handleCheckPaymentStatus = async () => {
    if (!paystackReference) {
      toast.error("No payment reference found");
      return;
    }

    try {
      const res = await checkPaystackStatus({ reference: paystackReference }).unwrap();
      if (res.status && isPaidStatus(res.status)) {
        toast.success("Payment confirmed");
        localStorage.removeItem(LS_VENDOR_PAYSTACK_REF);
        localStorage.removeItem(LS_VENDOR_PAYSTACK_URL);
        setPaystackDialogOpen(false);
        setStep(5);
        return;
      }
      toast.info(res.message || `Payment status: ${res.status || "unknown"}`);
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to check payment status"));
    }
  };

  if (step === 5) return <Navigate to={ADMIN_HOME} replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
          <h2 className="text-xl font-semibold text-white text-center">
            Vendor Onboarding
          </h2>
          <div className="flex mt-2 justify-center space-x-2">
            {["Account", "Business Profile", "Plan", "Payment"].map(
              (label, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-1 rounded-full text-sm font-medium cursor-default ${
                    step - 1 === idx
                      ? "bg-white text-blue-600"
                      : "bg-blue-200 text-blue-700"
                  }`}
                >
                  {label}
                </div>
              )
            )}
          </div>
        </div>
        <div className="p-6 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  name="fullName"
                  type="text"
                  value={accountData.fullName}
                  onChange={handleAccountChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-400"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={accountData.email}
                  onChange={handleAccountChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-400"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  name="phone"
                  type="tel"
                  maxLength={10}
                  value={accountData.phone}
                  onChange={handleAccountChange}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) e.preventDefault();
                  }}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-400"
                  placeholder="0546573849"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  name="address"
                  type="text"
                  value={accountData.address}
                  onChange={handleAccountChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-400"
                  placeholder="Enter your address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={accountData.password}
                  onChange={handleAccountChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-400"
                  placeholder="••••••••"
                />
              </div>
              {accountError && (
                <p className="text-red text-sm">{accountError}</p>
              )}
              <div className="text-right">
                <button
                  onClick={handleAccountSubmit}
                  disabled={regLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  {regLoading ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    "Next"
                  )}
                </button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="vendor_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Vendor Name
                </label>
                <input
                  id="vendor_name"
                  name="vendor_name"
                  type="text"
                  value={vendorData.vendor_name}
                  onChange={handleVendorChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter vendor name"
                />
              </div>
              <div>
                <label
                  htmlFor="vendor_email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Vendor Email
                </label>
                <input
                  id="vendor_email"
                  name="vendor_email"
                  type="email"
                  value={vendorData.vendor_email}
                  onChange={handleVendorChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter vendor email"
                />
              </div>
              <div>
                <label
                  htmlFor="vendor_phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Vendor Phone
                </label>
                <input
                  id="vendor_phone"
                  name="vendor_phone"
                  type="tel"
                  maxLength={10}
                  value={vendorData.vendor_phone}
                  onChange={handleVendorChange}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) e.preventDefault();
                  }}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="0546573849"
                />
              </div>
              <div>
                <label
                  htmlFor="vendor_address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Vendor Address
                </label>
                <input
                  id="vendor_address"
                  name="vendor_address"
                  type="text"
                  value={vendorData.vendor_address}
                  onChange={handleVendorChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter vendor address"
                />
              </div>
              {businessError && (
                <p className="text-red text-sm">{businessError}</p>
              )}
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  Back
                </button>
                <button
                  onClick={handleBusinessSubmit}
                  disabled={bizLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  {bizLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Next"
                  )}
                </button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              {plansLoading && <p>Loading plans...</p>}
              {plansError && (
                <p className="text-red-600">Error loading plans</p>
              )}
              {!plansLoading &&
                !plansError &&
                plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex justify-between items-center p-4 border rounded-md"
                  >
                    <div>
                      <p
                        className="font-semibold cursor-pointer hover:underline"
                        onClick={() => setViewingPlan(plan)}
                      >
                        {plan.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        GHC{plan.price}/month
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedPlan(plan)}
                      className={`px-4 py-2 rounded-md ${
                        selectedPlan?.id === plan.id
                          ? "bg-green-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {selectedPlan?.id === plan.id ? "Selected" : "Select"}
                    </button>
                  </div>
                ))}
              {subscribeError && (
                <p className="text-red-600 text-sm">{subscribeError}</p>
              )}
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  Back
                </button>
                <button
                  onClick={handlePlanSubscribe}
                  disabled={!selectedPlan || subLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  {subLoading ? <CircularProgress size={15} /> : "Next"}
                </button>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                Payments are processed via Paystack. Clicking the button will open a Paystack payment page in a new tab.
              </p>
              {paymentError && (
                <p className="text-red-600 text-sm">{paymentError}</p>
              )}
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  Back
                </button>
                <button
                  onClick={handlePayment}
                  disabled={initLoading || statusLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  {initLoading ? <CircularProgress size={15} /> : "Pay with Paystack"}
                </button>
              </div>
            </div>
          )}

          <Dialog
            open={paystackDialogOpen}
            onClose={() => setPaystackDialogOpen(false)}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogContent dividers className="space-y-3">
              <p className="text-sm text-gray-700">
                  Complete your payment on Paystack. When you return here, we'll automatically check the status.
              </p>
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
                <p className="text-xs text-gray-500 break-all">
                  Reference: {paystackReference}
                </p>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPaystackDialogOpen(false)}>Close</Button>
              <Button
                onClick={handleCheckPaymentStatus}
                variant="contained"
                disabled={!paystackReference || statusLoading}
              >
                {statusLoading ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : (
                  "Check status"
                )}
              </Button>
            </DialogActions>
          </Dialog>
          {/* PLAN DETAILS MODAL */}
          <Dialog
            open={!!viewingPlan}
            onClose={() => setViewingPlan(null)}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Plan Details</DialogTitle>
            <DialogContent dividers>
              {viewingPlan && (
                <div className="space-y-2">
                  <p>
                    <strong>Name: </strong>
                    {viewingPlan.name}
                  </p>
                  <p>
                    <strong>Price: </strong>
                    {viewingPlan.price}
                  </p>
                  <p>
                    <strong>Interval: </strong>
                    {viewingPlan.interval}
                  </p>
                  <p>
                    <strong>Description: </strong>
                    {viewingPlan.description}
                  </p>
                  {typeof viewingPlan.can_create_product !== "undefined" && (
                    <>
                      <p>
                        <strong>Can create products: </strong>
                        {viewingPlan.can_create_product ? "Yes" : "No"}
                      </p>
                      <p>
                        <strong>Can create services: </strong>
                        {viewingPlan.can_create_service ? "Yes" : "No"}
                      </p>
                    </>
                  )}
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewingPlan(null)}>Close</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default VendorAccount;
