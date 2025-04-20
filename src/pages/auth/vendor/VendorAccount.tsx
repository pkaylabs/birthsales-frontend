import React, { ChangeEvent, useEffect, useState } from "react";
import { Modal } from "./VendorSubscriptionForm";
import { Navigate } from "react-location";

import { ADMIN_HOME } from "@/constants";


interface Plan {
  id: string;
  name: string;
  price: string;
  interval: string;
  description: string;
}

interface paymentStatus {
  status: string;
  message: string;
}

const VendorAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  // Steps:
  // 1 = Create Account, 2 = Vendor Profile, 3 = Payment Subscription, 4 = Review & Submit
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: "1",
      name: "Basic",
      price: "10",
      interval: "monthly",
      description: "Details here",
    },
    {
      id: "2",
      name: "Pro",
      price: "20",
      interval: "monthly",
      description: "Details here",
    },
    {
      id: "3",
      name: "Premium",
      price: "30",
      interval: "monthly",
      description: "Details here",
    },
  ]);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentRequested, setPaymentRequested] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<paymentStatus | null>(
    null
  );

  const [accountData, setAccountData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const [vendorData, setVendorData] = useState({
    businessName: "",
    contactEmail: "",
    phone: "",
    address: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (step === 1) setAccountData((prev) => ({ ...prev, [name]: value }));
    if (step === 2) setVendorData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Step 1: Create account
  const handleAccountSubmit = async () => {
    setIsLoading(true);
    try {
      // const user: User = await createAccount(accountData).unwrap();
      // store user.id somewhere (e.g. local state) for next step
      // setVendorData(prev => ({ ...prev, vendorId: user.id }));
      setIsLoading(false);
      nextStep();
    } catch (err: any) {
      setMessage(err.data?.message || "Account creation failed");
    }
  };

  // Step 2: Create business
  const handleBusinessSubmit = async () => {
    setIsLoading(true);
    try {
      // const business: Business = await createBusiness({
      //   vendorId: vendorData.vendorId!,
      //   businessName: vendorData.businessName,
      //   contactEmail: vendorData.contactEmail,
      //   phone: vendorData.phone,
      //   address: vendorData.address,
      // }).unwrap();
      setIsLoading(false);
      nextStep();
    } catch (err: any) {
      setMessage(err.data?.message || "Business creation failed");
    }
  };

  // Step 3: Show details in modal
  const openPlanDetails = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowPlanModal(true);
  };

  // Step 4: Process payment
  const onProcessPayment = async () => {
    if (!selectedPlan || !paymentMethod || !mobileNumber) return;
    // const res = await processPayment({
    //   vendorId: vendorData.vendorId,
    //   planId: selectedPlan.id,
    //   paymentMethod,
    //   mobileNumber,
    // }).unwrap();
    // setTransactionId(res.transactionId);
    setTransactionId("transactionId");
    setPaymentRequested(true);
  };

  // When paymentStatus updates to "success", advance
  useEffect(() => {
    if (paymentRequested && paymentStatus?.status === "success") {
      setStep(5);
    }
  }, [paymentRequested, paymentStatus]);

  return (
    <div className="my-[3rem] w-full slide-up">
      <div className="max-w-3xl mx-auto p-6 border rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Vendor Registration</h1>
        {message && <div className="mb-4 text-green-600">{message}</div>}

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
            <div className="flex justify-end">
              <button
                type="button"
                disabled={isLoading === true}
                onClick={handleAccountSubmit}
                className="bg-blue-600 text-white p-2 rounded"
              >
                {isLoading ? "Creating..." : "Next"}
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
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-300 text-black p-2 rounded"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleBusinessSubmit}
                disabled={isLoading === true}
                className="bg-blue-600 text-white p-2 rounded"
              >
                {isLoading ? "Saving..." : "Next"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Choose a plan</h2>
            <ul>
              {plans.map((plan) => (
                <li
                  key={plan.id}
                  className="border p-4 mb-2 flex justify-between"
                >
                  <div>
                    <strong>{plan.name}</strong> — GHC{plan.price}/{plan.interval}
                  </div>
                  <div className="md:space-x-2 space-x-1 flex">
                    <button
                      onClick={() => openPlanDetails(plan)}
                      className="px-3 py-1  rounded bg-gray-200"
                    >
                      Details
                    </button>
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
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-between mt-4">
             
              <button
                onClick={() => setStep(4)}
                disabled={!selectedPlan}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}

        {step === 4 && selectedPlan && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Payment Subscription</h2>
            <p>
              <strong>Plan:</strong> {selectedPlan.name} — GHC{selectedPlan.price}
              /{selectedPlan.interval}
            </p>
            <div className="mb-4">
              <label htmlFor="paymentMethod" className="block mb-1">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select a Payment Method</option>
                <option value="mobile_money">Mobile Money</option>
              </select>
            </div>
            {paymentMethod === "mobile_money" && (
              <div className="mb-4">
                <label htmlFor="mobileNumber" className="block mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="000055555"
                  required
                />
              </div>
            )}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Please click "Process Payment" to send a payment request to your
                phone.
              </p>
            </div>
            <div className="flex justify-between mb-4">
            <button
                onClick={() => setStep(3)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Back
              </button>
              <button
                onClick={onProcessPayment}
                disabled={isProcessing || !paymentMethod || !mobileNumber}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {isProcessing ? "Processing…" : "Process Payment"}
              </button>
              
            </div>
            {paymentRequested && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Payment request sent. Once you receive the confirmation on
                  your phone, click below to confirm.
                </p>
                <button
                  // onClick={() => (paymentStatus ? null : void 0)}
                  onClick={() => setStep(5)}
                  // RTK Query auto‑fetches paymentStatus; useEffect will advance
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
                >
                  Confirm Payment
                </button>
              </div>
            )}
          </div>
        )}
        {step === 5 && (
          <div>
            <h2 className="text-xl mb-4">All Set!</h2>
            <p>Redirecting you to the dashboard…</p>
             <Navigate to={ADMIN_HOME}/>
          </div>
        )}

        <Modal
          isOpen={showPlanModal}
          title={selectedPlan?.name || ""}
          onClose={() => setShowPlanModal(false)}
        >
          <p>
            <strong>Price:</strong> ${selectedPlan?.price}/
            {selectedPlan?.interval}
          </p>
          <p className="mt-2">{selectedPlan?.description}</p>
        </Modal>
      </div>
    </div>
  );
};

export default VendorAccount;

// import React, { useState, ChangeEvent, FormEvent } from "react";
// import VendorSubscriptionForm from "./VendorSubscriptionForm";

// interface AccountData {
//   fullName: string;
//   email: string;
//   phone: string;
//   address: string;
//   password: string;
// }

// interface VendorData {
//   businessName: string;
//   contactEmail: string;
//   phone: string;
//   address: string;
// }

// interface PaymentData {
//   paymentMethod: string;
//   mobileNumber: string;
// }

// const VendorAccount: React.FC = () => {
//   // Steps:
//   // 1 = Create Account, 2 = Vendor Profile, 3 = Subscription Plan, 4 = Payment Subscription, 5 = Review & Submit
//   const [step, setStep] = useState<number>(1);
//   const [message, setMessage] = useState<string>("");
//   const [subscriptionPlan, setSubscriptionPlan] = useState<string>("");
//   const [paymentVerified, setPaymentVerified] = useState<boolean>(false);
//   const [paymentProcessed, setPaymentProcessed] = useState<boolean>(false);

//   const [accountData, setAccountData] = useState<AccountData>({
//     fullName: "",
//     email: "",
//     phone: "",
//     address: "",
//     password: "",
//   });

//   const [vendorData, setVendorData] = useState<VendorData>({
//     businessName: "",
//     contactEmail: "",
//     phone: "",
//     address: "",
//   });

//   const [paymentData, setPaymentData] = useState<PaymentData>({
//     paymentMethod: "",
//     mobileNumber: "",
//   });

//   const handleAccountChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setAccountData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleVendorChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setVendorData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handlePaymentChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setPaymentData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Function to simulate processing the payment on the vendor's phone
//   const handleProcessPayment = async () => {
//     alert(
//       "Payment request sent to your phone. Please check your phone for the confirmation message."
//     );
//     setPaymentProcessed(true);
//   };

//   // Function to check payment status from the backend
//   const handleCheckPaymentStatus = async () => {
//     try {
//       // Replace with your actual API endpoint to check payment status
//       const response = await fetch("/api/vendor/payment-status", {
//         method: "GET",
//       });
//       if (response.ok) {
//         const data = await response.json();
//         if (data.status === "success") {
//           alert("Payment confirmed! Redirecting to your dashboard.");
//           setPaymentVerified(true);
//           nextStep(); // Proceed to review step
//         } else {
//           alert(
//             "Payment not confirmed yet. Please check your phone and try again."
//           );
//         }
//       } else {
//         alert("Error checking payment status. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error checking payment status:", error);
//       alert("Network error. Please try again later.");
//     }
//   };

//   const nextStep = () => setStep((prev) => prev + 1);
//   const prevStep = () => setStep((prev) => prev - 1);

//   // Final submission: combine all data and send to backend
//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     const data = new FormData();
//     // Append Account details
//     data.append("fullName", accountData.fullName);
//     data.append("email", accountData.email);
//     data.append("phone", accountData.phone);
//     data.append("address", accountData.address);
//     data.append("password", accountData.password);
//     // Append Vendor Profile details
//     data.append("businessName", vendorData.businessName);
//     data.append("contactEmail", vendorData.contactEmail);
//     data.append("phone", vendorData.phone);
//     data.append("address", vendorData.address);
//     // Append Payment details
//     data.append("paymentMethod", paymentData.paymentMethod);
//     data.append("mobileNumber", paymentData.mobileNumber);
//     // Append Subscription plan
//     data.append("subscriptionPlan", subscriptionPlan);

//     try {
//       // Replace with your backend API endpoint
//       const response = await fetch("/api/vendor/register", {
//         method: "POST",
//         body: data,
//       });
//       if (response.ok) {
//         setMessage(
//           "Registration submitted successfully! Please verify your email and await admin approval."
//         );
//       } else {
//         setMessage("Error during registration. Please try again.");
//       }
//     } catch (error) {
//       console.error(error);
//       setMessage("Network error. Please try again later.");
//     }
//   };

//   return (
//     <div className="my-[5rem] w-full slide-up">
//       <div className="max-w-3xl mx-auto p-6 border rounded shadow">
//         <h1 className="text-2xl font-bold mb-6">Vendor Registration</h1>
//         {message && <div className="mb-4 text-green-600">{message}</div>}
//         <form onSubmit={handleSubmit}>
//           {step === 1 && (
//             <div>
//               <h2 className="text-xl font-semibold mb-4">
//                 Create Your Account
//               </h2>
//               <div className="mb-4">
//                 <label htmlFor="fullName" className="block mb-1">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   id="fullName"
//                   name="fullName"
//                   value={accountData.fullName}
//                   onChange={handleAccountChange}
//                   className="w-full p-2 border rounded"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="email" className="block mb-1">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={accountData.email}
//                   onChange={handleAccountChange}
//                   className="w-full p-2 border rounded"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="phone" className="block mb-1">
//                   Phone
//                 </label>
//                 <input
//                   type="text"
//                   id="phone"
//                   name="phone"
//                   value={accountData.phone}
//                   onChange={handleAccountChange}
//                   className="w-full p-2 border rounded"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="address" className="block mb-1">
//                   Address
//                 </label>
//                 <input
//                   type="text"
//                   id="address"
//                   name="address"
//                   value={accountData.address}
//                   onChange={handleAccountChange}
//                   className="w-full p-2 border rounded"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="password" className="block mb-1">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   name="password"
//                   value={accountData.password}
//                   onChange={handleAccountChange}
//                   className="w-full p-2 border rounded"
//                   required
//                 />
//               </div>
//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   onClick={nextStep}
//                   className="bg-blue-600 text-white p-2 rounded"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}

//           {step === 2 && (
//             <div>
//               <h2 className="text-xl font-semibold mb-4">
//                 Vendor Profile Setup
//               </h2>
//               <div className="mb-4">
//                 <label htmlFor="businessName" className="block mb-1">
//                   Business Name
//                 </label>
//                 <input
//                   type="text"
//                   id="businessName"
//                   name="businessName"
//                   value={vendorData.businessName}
//                   onChange={handleVendorChange}
//                   className="w-full p-2 border rounded"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="contactEmail" className="block mb-1">
//                   Contact Email
//                 </label>
//                 <input
//                   type="email"
//                   id="contactEmail"
//                   name="contactEmail"
//                   value={vendorData.contactEmail}
//                   onChange={handleVendorChange}
//                   className="w-full p-2 border rounded"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="phone" className="block mb-1">
//                   Phone
//                 </label>
//                 <input
//                   type="text"
//                   id="phone"
//                   name="phone"
//                   value={vendorData.phone}
//                   onChange={handleVendorChange}
//                   className="w-full p-2 border rounded"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="address" className="block mb-1">
//                   Address
//                 </label>
//                 <input
//                   type="text"
//                   id="address"
//                   name="address"
//                   value={vendorData.address}
//                   onChange={handleVendorChange}
//                   className="w-full p-2 border rounded"
//                   required
//                 />
//               </div>
//               <div className="flex justify-between">
//                 <button
//                   type="button"
//                   onClick={prevStep}
//                   className="bg-gray-300 text-black p-2 rounded"
//                 >
//                   Back
//                 </button>
//                 <button
//                   type="button"
//                   onClick={nextStep}
//                   className="bg-blue-600 text-white p-2 rounded"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}

//           {step === 3 && (
//             <div>
//               <h2 className="text-xl font-semibold mb-4">
//                 Subscription Plan Selection
//               </h2>
//               <VendorSubscriptionForm
//                 onPlanSelect={(plan: string) => setSubscriptionPlan(plan)}
//               />
//               <div className="flex justify-between mt-4">
//                 <button
//                   type="button"
//                   onClick={prevStep}
//                   className="bg-gray-300 text-black p-2 rounded"
//                 >
//                   Back
//                 </button>
//                 <button
//                   type="button"
//                   onClick={nextStep}
//                   className="bg-blue-600 text-white p-2 rounded"
//                   disabled={!subscriptionPlan}
//                 >
//                   Proceed to Payment
//                 </button>
//               </div>
//             </div>
//           )}

//           {step === 4 && (
//             <div>
//               <h2 className="text-xl font-semibold mb-4">
//                 Payment Subscription
//               </h2>
//               <div className="mb-4">
//                 <label htmlFor="paymentMethod" className="block mb-1">
//                   Payment Method
//                 </label>
//                 <select
//                   id="paymentMethod"
//                   name="paymentMethod"
//                   value={paymentData.paymentMethod}
//                   onChange={handlePaymentChange}
//                   className="w-full p-2 border rounded"
//                   required
//                 >
//                   <option value="">Select a Payment Method</option>
//                   <option value="mobile_money">Mobile Money</option>
//                 </select>
//               </div>
//               {paymentData.paymentMethod === "mobile_money" && (
//                 <div className="mb-4">
//                   <label htmlFor="mobileNumber" className="block mb-1">
//                     Mobile Number
//                   </label>
//                   <input
//                     type="text"
//                     id="mobileNumber"
//                     name="mobileNumber"
//                     value={paymentData.mobileNumber}
//                     onChange={handlePaymentChange}
//                     className="w-full p-2 border rounded"
//                     required
//                   />
//                 </div>
//               )}
//               <div className="mb-4">
//                 <p className="text-sm text-gray-600">
//                   Please click "Process Payment" to send a payment request to your phone.
//                 </p>
//               </div>
//               <div className="flex justify-between mb-4">
//                 <button
//                   type="button"
//                   onClick={prevStep}
//                   className="bg-gray-300 text-black p-2 rounded"
//                 >
//                   Back
//                 </button>
//                 {!paymentProcessed && (
//                   <button
//                     type="button"
//                     onClick={handleProcessPayment}
//                     className="bg-blue-600 text-white p-2 rounded"
//                     disabled={
//                       !paymentData.paymentMethod || !paymentData.mobileNumber
//                     }
//                   >
//                     Process Payment
//                   </button>
//                 )}
//               </div>
//               {paymentProcessed && (
//                 <div className="mb-4">
//                   <p className="text-sm text-gray-600">
//                     Payment request sent. Once you receive the confirmation message on your phone, click below to confirm payment.
//                   </p>
//                   <div className="flex justify-end">
//                     <button
//                       type="button"
//                       onClick={handleCheckPaymentStatus}
//                       className="bg-blue-600 text-white p-2 rounded"
//                       disabled={
//                         !paymentData.paymentMethod || !paymentData.mobileNumber
//                       }
//                     >
//                       Payment Done: Check Payment Status
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {step === 5 && (
//             <div>
//               <h2 className="text-xl font-semibold mb-4">Review & Submit</h2>
//               <div className="mb-4">
//                 <h3 className="font-bold">Account Details</h3>
//                 <p>
//                   <strong>Full Name:</strong> {accountData.fullName}
//                 </p>
//                 <p>
//                   <strong>Email:</strong> {accountData.email}
//                 </p>
//                 <p>
//                   <strong>Phone:</strong> {accountData.phone}
//                 </p>
//                 <p>
//                   <strong>Address:</strong> {accountData.address}
//                 </p>
//               </div>
//               <div className="mb-4">
//                 <h3 className="font-bold">Vendor Profile</h3>
//                 <p>
//                   <strong>Business Name:</strong> {vendorData.businessName}
//                 </p>
//                 <p>
//                   <strong>Contact Email:</strong> {vendorData.contactEmail}
//                 </p>
//                 <p>
//                   <strong>Phone:</strong> {vendorData.phone}
//                 </p>
//                 <p>
//                   <strong>Address:</strong> {vendorData.address}
//                 </p>
//               </div>
//               <div className="mb-4">
//                 <h3 className="font-bold">Subscription Plan</h3>
//                 <p>
//                   <strong>Plan Selected:</strong>{" "}
//                   {subscriptionPlan.charAt(0).toUpperCase() +
//                     subscriptionPlan.slice(1)}
//                 </p>
//               </div>
//               <div className="mb-4">
//                 <h3 className="font-bold">Payment Details</h3>
//                 <p>
//                   <strong>Payment Method:</strong> {paymentData.paymentMethod}
//                 </p>
//                 {paymentData.paymentMethod === "mobile_money" && (
//                   <p>
//                     <strong>Mobile Number:</strong> {paymentData.mobileNumber}
//                   </p>
//                 )}
//               </div>
//               <div className="flex justify-between">
//                 <button
//                   type="button"
//                   onClick={() => setStep(4)}
//                   className="bg-gray-300 text-black p-2 rounded"
//                 >
//                   Back
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-green-600 text-white p-2 rounded"
//                 >
//                   Submit Registration
//                 </button>
//               </div>
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default VendorAccount;
