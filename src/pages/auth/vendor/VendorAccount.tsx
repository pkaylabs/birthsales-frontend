import React, { ChangeEvent, useState } from "react";
import { Navigate } from "react-location";
import { useRegisterMutation } from "@/redux/features/auth/authApiSlice";
import {
  useCreateBusinessMutation,
  useSubscribePlanMutation,
} from "@/redux/features/business/businessApiSlice";
import { useGetPlansQuery } from "@/redux/features/plans/plansApi";
import { ADMIN_HOME } from "@/constants";
import type { Plan, User } from "@/redux/type";
import { useAppSelector } from "@/redux";
import { RootState } from "@/app/store";

const VendorAccount: React.FC = () => {
  const authUser: User | null = useAppSelector(
    (state: RootState) => state.auth.user
  );
  const token = useAppSelector((state: RootState) => state.auth.token);
  const userId = authUser?.id;
  const [step, setStep] = useState<number>(1);
  const [accountData, setAccountData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    user_type: "VENDOR" as const,
  });
  const [vendorData, setVendorData] = useState({
    vendor_name: "",
    vendor_email: "",
    vendor_phone: "",
    vendor_address: "",
  });
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");

  const [register, { isLoading: regLoading, error: regError }] =
    useRegisterMutation();
  const [createBusiness, { isLoading: bizLoading, error: bizError }] =
    useCreateBusinessMutation();
  const {
    data: plans = [],
    isLoading: plansLoading,
    error: plansError,
  } = useGetPlansQuery(undefined, { skip: !token || step < 3 });
  const [subscribePlan, { isLoading: subLoading, error: subError }] =
    useSubscribePlanMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (step === 1) setAccountData((prev) => ({ ...prev, [name]: value }));
    if (step === 2) setVendorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccountSubmit = async () => {
    try {
      await register({
        name: accountData.fullName,
        email: accountData.email,
        phone: accountData.phone,
        address: accountData.address,
        password: accountData.password,
        user_type: "VENDOR",
      }).unwrap();

      setStep(2);
    } catch {
      console.log("something");
    }
  };

  const handleBusinessSubmit = async () => {
    if (!userId) return;
    try {
      // map vendorData to CreateBusinessDto
      await createBusiness({
        user: userId,
        vendor_name: vendorData.vendor_name,
        vendor_email: vendorData.vendor_email,
        vendor_address: vendorData.vendor_address,
        vendor_phone: vendorData.vendor_phone,
      }).unwrap();
      setStep(3);
    } catch (err) {
      console.error("Business creation failed", err);
    }
  };

  const handlePlanSubscribe = async () => {
    if (selectedPlan) {
      try {
        await subscribePlan({ plan_id: selectedPlan.id }).unwrap();
        setStep(5);
      } catch {
        console.log("something");
      }
    }
  };

  return (
    <div>
      <div className="max-w-3xl mx-auto p-6 border rounded shadow my-12">
        <h1 className="text-2xl font-bold mb-6">Vendor Registration</h1>

        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Create Your Account</h2>
            {["fullName", "email", "phone", "address", "password"].map((f) => (
              <div key={f} className="mb-3">
                <label className="block mb-1">{f}</label>
                <input
                  name={f}
                  type={f === "password" ? "password" : "text"}
                  value={(accountData as any)[f]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
            {regError && (
              <div className="text-red-600 mb-2">
                {(regError as any).data?.message}
              </div>
            )}
            <div className="flex justify-end">
              <button
                onClick={handleAccountSubmit}
                disabled={regLoading}
                className="bg-blue-600 text-white p-2 rounded"
              >
                {regLoading ? "Creating..." : "Next"}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Vendor Profile Setup</h2>
            {["businessName", "contactEmail", "phone", "address"].map((f) => (
              <div key={f} className="mb-3">
                <label className="block mb-1">{f}</label>
                <input
                  name={f}
                  type="text"
                  value={(vendorData as any)[f]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
            {bizError && (
              <div className="text-red-600 mb-2">
                {(bizError as any).data?.message}
              </div>
            )}
            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="bg-gray-300 text-black p-2 rounded"
              >
                Back
              </button>
              <button
                onClick={handleBusinessSubmit}
                disabled={bizLoading}
                className="bg-blue-600 text-white p-2 rounded"
              >
                {bizLoading ? "Saving..." : "Next"}
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Choose a Plan</h2>
            {plansLoading ? (
              <p>Loading plans...</p>
            ) : plansError ? (
              <p className="text-red-600">Failed to load plans</p>
            ) : (
              <ul>
                {plans.map((plan) => (
                  <li
                    key={plan.id}
                    className="border p-4 mb-2 flex justify-between"
                  >
                    <div>
                      <strong>{plan.name}</strong> — GHC{plan.price}/
                      {plan.interval}
                    </div>
                    <button
                      onClick={() => setSelectedPlan(plan)}
                      className={`px-3 py-1 rounded ${
                        selectedPlan?.id === plan.id
                          ? "bg-green-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {selectedPlan?.id === plan.id ? "Selected" : "Select"}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setStep(2)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!selectedPlan}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}

        {step === 4 && selectedPlan && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Payment Subscription</h2>
            <div className="mb-4">
              <label className="block mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select</option>
                <option value="mobile_money">Mobile Money</option>
              </select>
            </div>
            {paymentMethod === "mobile_money" && (
              <div className="mb-4">
                <label className="block mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            )}
            <div className="flex justify-between">
              <button
                onClick={() => setStep(3)}
                className="bg-gray-300 text-black p-2 rounded"
              >
                Back
              </button>
              <button
                onClick={handlePlanSubscribe}
                disabled={subLoading || !paymentMethod || !mobileNumber}
                className="bg-blue-600 text-white p-2 rounded"
              >
                {subLoading ? "Processing..." : "Process Subscription"}
              </button>
            </div>
            {subError && (
              <div className="text-red-600 mt-2">
                {(subError as any).data?.message}
              </div>
            )}
          </div>
        )}

        {step === 5 && <Navigate to={ADMIN_HOME} />}
      </div>
    </div>
  );
};

export default VendorAccount;

// import React, { ChangeEvent, useEffect, useState } from "react";
// import { Modal } from "./VendorSubscriptionForm";
// import { Navigate } from "react-location";

// import { ADMIN_HOME } from "@/constants";
// import { useRegisterMutation } from "@/redux/features/auth/authApiSlice";

// interface Plan {
//   id: string;
//   name: string;
//   price: string;
//   interval: string;
//   description: string;
// }

// interface paymentStatus {
//   status: string;
//   message: string;
// }

// const VendorAccount = () => {
//   // const [isLoading, setIsLoading] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   // Steps:
//   // 1 = Create Account, 2 = Vendor Profile, 3 = Payment Subscription, 4 = Review & Submit
//   const [step, setStep] = useState(1);
//   const [message, setMessage] = useState("");
//   const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
//   const [plans, setPlans] = useState<Plan[]>([
//     {
//       id: "1",
//       name: "Basic",
//       price: "10",
//       interval: "monthly",
//       description: "Details here",
//     },
//     {
//       id: "2",
//       name: "Pro",
//       price: "20",
//       interval: "monthly",
//       description: "Details here",
//     },
//     {
//       id: "3",
//       name: "Premium",
//       price: "30",
//       interval: "monthly",
//       description: "Details here",
//     },
//   ]);
//   const [showPlanModal, setShowPlanModal] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [transactionId, setTransactionId] = useState<string | null>(null);
//   const [paymentRequested, setPaymentRequested] = useState(false);
//   const [paymentStatus, setPaymentStatus] = useState<paymentStatus | null>(
//     null
//   );

//   const [accountData, setAccountData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     address: "",
//     password: "",
//     user_type: "VENDOR",
//   });

//   const [vendorData, setVendorData] = useState({
//     businessName: "",
//     contactEmail: "",
//     phone: "",
//     address: "",
//   });

//   const [register, { isLoading: regLoading, error: regError }] =
//     useRegisterMutation();

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     if (step === 1) setAccountData((prev) => ({ ...prev, [name]: value }));
//     if (step === 2) setVendorData((prev) => ({ ...prev, [name]: value }));
//   };

//   const nextStep = () => setStep((prev) => prev + 1);
//   const prevStep = () => setStep((prev) => prev - 1);

//   // Step 1: Create account
//   const handleAccountSubmit = async () => {
//     // setIsLoading(true);
//     // try {
//     //   // const user: User = await createAccount(accountData).unwrap();
//     //   // store user.id somewhere (e.g. local state) for next step
//     //   // setVendorData(prev => ({ ...prev, vendorId: user.id }));
//     //   setIsLoading(false);
//     //   nextStep();
//     // } catch (err: any) {
//     //   setMessage(err.data?.message || "Account creation failed");
//     // }
//     try {
//       await register({
//         name: accountData.fullName,
//         email: accountData.email,
//         phone: accountData.phone,
//         address: accountData.address,
//         password: accountData.password,
//         user_type: accountData.user_type,
//       }).unwrap();
//       setStep(2);
//     } catch {
//       // error shown by regError
//     }
//   };

//   // Step 2: Create business
//   const handleBusinessSubmit = async () => {
//     setIsLoading(true);
//     try {
//       // const business: Business = await createBusiness({
//       //   vendorId: vendorData.vendorId!,
//       //   businessName: vendorData.businessName,
//       //   contactEmail: vendorData.contactEmail,
//       //   phone: vendorData.phone,
//       //   address: vendorData.address,
//       // }).unwrap();
//       setIsLoading(false);
//       nextStep();
//     } catch (err: any) {
//       setMessage(err.data?.message || "Business creation failed");
//     }
//   };

//   // Step 3: Show details in modal
//   const openPlanDetails = (plan: Plan) => {
//     setSelectedPlan(plan);
//     setShowPlanModal(true);
//   };

//   // Step 4: Process payment
//   const onProcessPayment = async () => {
//     if (!selectedPlan || !paymentMethod || !mobileNumber) return;
//     // const res = await processPayment({
//     //   vendorId: vendorData.vendorId,
//     //   planId: selectedPlan.id,
//     //   paymentMethod,
//     //   mobileNumber,
//     // }).unwrap();
//     // setTransactionId(res.transactionId);
//     setTransactionId("transactionId");
//     setPaymentRequested(true);
//   };

//   // When paymentStatus updates to "success", advance
//   useEffect(() => {
//     if (paymentRequested && paymentStatus?.status === "success") {
//       setStep(5);
//     }
//   }, [paymentRequested, paymentStatus]);

//   return (
//     <div className="my-[3rem] w-full slide-up">
//       <div className="max-w-3xl mx-auto p-6 border rounded shadow">
//         <h1 className="text-2xl font-bold mb-6">Vendor Registration</h1>
//         {message && <div className="mb-4 text-green-600">{message}</div>}

//         {step === 1 && (
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Create Your Account</h2>
//             {["fullName", "email", "phone", "address", "password"].map((f) => (
//               <div key={f} className="mb-3">
//                 <label className="block mb-1">{f}</label>
//                 <input
//                   name={f}
//                   type={f === "password" ? "password" : "text"}
//                   value={(accountData as any)[f]}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//             ))}
//             {regError && (
//               <div className="text-red-600 mb-2">{regError.data?.message}</div>
//             )}
//             <div className="flex justify-end">
//               <button
//                 onClick={handleAccountSubmit}
//                 disabled={regLoading}
//                 className="bg-blue-600 text-white p-2 rounded"
//               >
//                 {regLoading ? "Creating..." : "Next"}
//               </button>
//             </div>
//           </div>
//         )}

//         {step === 2 && (
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Vendor Profile Setup</h2>
//             {["businessName", "contactEmail", "phone", "address"].map((f) => (
//               <div key={f} className="mb-3">
//                 <label className="block mb-1">{f}</label>
//                 <input
//                   name={f}
//                   type="text"
//                   value={(vendorData as any)[f]}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//             ))}
//             <div className="flex justify-between">
//               <button
//                 type="button"
//                 onClick={prevStep}
//                 className="bg-gray-300 text-black p-2 rounded"
//               >
//                 Back
//               </button>
//               <button
//                 type="button"
//                 onClick={handleBusinessSubmit}
//                 disabled={isLoading === true}
//                 className="bg-blue-600 text-white p-2 rounded"
//               >
//                 {isLoading ? "Saving..." : "Next"}
//               </button>
//             </div>
//           </div>
//         )}

//         {step === 3 && (
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Choose a plan</h2>
//             <ul>
//               {plans.map((plan) => (
//                 <li
//                   key={plan.id}
//                   className="border p-4 mb-2 flex justify-between"
//                 >
//                   <div>
//                     <strong>{plan.name}</strong> — GHC{plan.price}/
//                     {plan.interval}
//                   </div>
//                   <div className="md:space-x-2 space-x-1 flex">
//                     <button
//                       onClick={() => openPlanDetails(plan)}
//                       className="px-3 py-1  rounded bg-gray-200"
//                     >
//                       Details
//                     </button>
//                     <button
//                       onClick={() => setSelectedPlan(plan)}
//                       className={`px-3 py-1 rounded ${
//                         selectedPlan?.id === plan.id
//                           ? "bg-green-600 text-white"
//                           : "bg-gray-200"
//                       }`}
//                     >
//                       {selectedPlan?.id === plan.id ? "Selected" : "Select"}
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//             <div className="flex justify-between mt-4">
//               <button
//                 onClick={() => setStep(4)}
//                 disabled={!selectedPlan}
//                 className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
//               >
//                 Proceed to Payment
//               </button>
//             </div>
//           </div>
//         )}

//         {step === 4 && selectedPlan && (
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Payment Subscription</h2>
//             <p>
//               <strong>Plan:</strong> {selectedPlan.name} — GHC
//               {selectedPlan.price}/{selectedPlan.interval}
//             </p>
//             <div className="mb-4">
//               <label htmlFor="paymentMethod" className="block mb-1">
//                 Payment Method
//               </label>
//               <select
//                 id="paymentMethod"
//                 name="paymentMethod"
//                 value={paymentMethod}
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//                 className="w-full p-2 border rounded"
//                 required
//               >
//                 <option value="">Select a Payment Method</option>
//                 <option value="mobile_money">Mobile Money</option>
//               </select>
//             </div>
//             {paymentMethod === "mobile_money" && (
//               <div className="mb-4">
//                 <label htmlFor="mobileNumber" className="block mb-1">
//                   Mobile Number
//                 </label>
//                 <input
//                   type="text"
//                   id="mobileNumber"
//                   name="mobileNumber"
//                   value={mobileNumber}
//                   onChange={(e) => setMobileNumber(e.target.value)}
//                   className="w-full p-2 border rounded"
//                   placeholder="000055555"
//                   required
//                 />
//               </div>
//             )}
//             <div className="mb-4">
//               <p className="text-sm text-gray-600">
//                 Please click "Process Payment" to send a payment request to your
//                 phone.
//               </p>
//             </div>
//             <div className="flex justify-between mb-4">
//               <button
//                 onClick={() => setStep(3)}
//                 className="bg-gray-300 px-4 py-2 rounded"
//               >
//                 Back
//               </button>
//               <button
//                 onClick={onProcessPayment}
//                 disabled={isProcessing || !paymentMethod || !mobileNumber}
//                 className="bg-blue-600 text-white px-4 py-2 rounded"
//               >
//                 {isProcessing ? "Processing…" : "Process Payment"}
//               </button>
//             </div>
//             {paymentRequested && (
//               <div className="mt-2">
//                 <p className="text-sm text-gray-600">
//                   Payment request sent. Once you receive the confirmation on
//                   your phone, click below to confirm.
//                 </p>
//                 <button
//                   // onClick={() => (paymentStatus ? null : void 0)}
//                   onClick={() => setStep(5)}
//                   // RTK Query auto‑fetches paymentStatus; useEffect will advance
//                   className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
//                 >
//                   Confirm Payment
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//         {step === 5 && (
//           <div>
//             <h2 className="text-xl mb-4">All Set!</h2>
//             <p>Redirecting you to the dashboard…</p>
//             <Navigate to={ADMIN_HOME} />
//           </div>
//         )}

//         <Modal
//           isOpen={showPlanModal}
//           title={selectedPlan?.name || ""}
//           onClose={() => setShowPlanModal(false)}
//         >
//           <p>
//             <strong>Price:</strong> ${selectedPlan?.price}/
//             {selectedPlan?.interval}
//           </p>
//           <p className="mt-2">{selectedPlan?.description}</p>
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default VendorAccount;
