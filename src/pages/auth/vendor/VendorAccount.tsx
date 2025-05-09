import React, { ChangeEvent, useState } from "react";
import { Navigate } from "react-location";
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
import { CircularProgress } from "@mui/material";
import { useMobilePaymentMutation } from "@/redux/features/orders/orderApiSlice";

const VendorAccount: React.FC = () => {
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
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [network, setNetwork] = useState("");

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
  const [makePayment, { isLoading: payLoading }] = useMobilePaymentMutation();

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
    } catch (err: any) {
      const msg =
        err?.data?.error_message ||
        err?.data?.detail ||
        "Failed to create account";
      setAccountError(msg);
      toast.error(msg);
    }
  };
  const handleBusinessSubmit = async () => {
    setBusinessError(null);
    try {
      await createBusiness(vendorData).unwrap();
      toast.success("Success: Select a subscription plan");
      setStep(3);
    } catch (err: any) {
      const msg =
        err?.data?.error_message ||
        err?.data?.detail ||
        "Failed to create vendor profile";
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
    } catch (err: any) {
      const msg =
        err?.data?.error_message || err?.data?.detail || "Subscription Failed";
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
    if (!paymentMethod) {
      setPaymentError("Please select a payment method");
      return;
    }
    if (paymentMethod === "mobile_money" && !mobileNumber) {
      setPaymentError("Please enter your mobile number");
    }
    try {
      await makePayment({
        subscription: subscriptionId ?? undefined,
        network,
        phone: mobileNumber,
      }).unwrap();
      toast.success("Payment successful");
      setStep(5);
    } catch (err: any) {
      const msg =
        err?.data?.error_message || err?.data?.message || "Payment failed";
      setPaymentError(msg);
      toast.error(msg);
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
              {["fullName", "email", "phone", "address", "password"].map(
                (f) => (
                  <div key={f}>
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {f.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      name={f}
                      type={f === "password" ? "password" : "text"}
                      value={(accountData as any)[f] || ""}
                      onChange={handleAccountChange}
                      className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                )
              )}
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
                    <CircularProgress size={15} sx={{ color: "white" }} />
                  ) : (
                    "Next"
                  )}
                </button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              {[
                "vendor_name",
                "vendor_email",
                "vendor_phone",
                "vendor_address",
              ].map((f) => (
                <div key={f}>
                  <label className="block text-sm font-medium text-gray-700 uppercase">
                    {f.replace("vendor_", "")}
                  </label>
                  <input
                    name={f}
                    type="text"
                    value={(vendorData as any)[f] || ""}
                    onChange={handleVendorChange}
                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              ))}
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
                  {bizLoading ? <CircularProgress size={15} /> : "Next"}
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
                      <p className="font-semibold">{plan.name}</p>
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
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select</option>
                  <option value="mobile_money">Mobile Money</option>
                </select>
              </div>
              {paymentMethod === "mobile_money" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Network
                  </label>
                  <select
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select</option>
                    <option value="MTN">MTN</option>
                    <option value="VOD">TELECEL</option>
                    <option value="AIR">AIRTELTIGO</option>
                  </select>
                </div>
              )}
              {paymentMethod === "mobile_money" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mobile Number
                  </label>
                  <input
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              )}
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
                  disabled={payLoading || !paymentMethod || !mobileNumber}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  {payLoading ? <CircularProgress size={15} /> : "Pay & Finish"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorAccount;
