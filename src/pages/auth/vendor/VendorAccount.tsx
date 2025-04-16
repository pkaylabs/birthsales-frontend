import React, { ChangeEvent, FormEvent, useState } from "react";
import VendorSubscriptionForm from "./VendorSubscriptionForm";
import { useNavigate } from "react-location";

const VendorAccount = () => {
  const navigate = useNavigate();
  // Steps:
  // 1 = Create Account, 2 = Vendor Profile, 3 = Payment Subscription, 4 = Review & Submit
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [subscriptionPlan, setSubscriptionPlan] = useState("");
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [paymentProcessed, setPaymentProcessed] = useState(false);

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

  const [paymentData, setPaymentData] = useState({
    paymentMethod: "",
    mobileNumber: "",
  });

  const handleAccountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountData({
      ...accountData,
      [name]: value,
    });
  };

  const handleVendorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVendorData({
      ...vendorData,
      [name]: value,
    });
  };

  const handlePaymentChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPaymentData({
      ...paymentData,
      [name]: value,
    });
  };

  // Function to simulate processing the payment on the vendor's phone
  const handleProcessPayment = async () => {
    // Simulate processing delay or API call here
    alert(
      "Payment request sent to your phone. Please check your phone for the confirmation message."
    );
    setPaymentProcessed(true);
  };

  // Function to check payment status from the backend
  const handleCheckPaymentStatus = async () => {
    try {
      // Replace with your actual API endpoint to check payment status
      const response = await fetch("/api/vendor/payment-status", {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          alert("Payment confirmed! Redirecting to your dashboard.");
          setPaymentVerified(true);
          nextStep(); // Move to the next step if payment is successful
        } else {
          alert(
            "Payment not confirmed yet. Please check your phone and try again."
          );
        }
      } else {
        alert("Error checking payment status. Please try again.");
      }
    } catch (error) {
      console.error(error);
      nextStep();
      alert("Network error. Please try again later.");
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Final submission: create account, vendor profile, and process payment together.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Prepare a combined form data object for submission
    const data = new FormData();
    // Account details
    data.append("fullName", accountData.fullName);
    data.append("email", accountData.email);
    data.append("phone", accountData.phone);
    data.append("address", accountData.address);
    data.append("password", accountData.password);
    // Vendor profile details
    data.append("businessName", vendorData.businessName);
    data.append("contactEmail", vendorData.contactEmail);
    data.append("phone", vendorData.phone);
    data.append("address", vendorData.address);
    // Payment details
    data.append("paymentMethod", paymentData.paymentMethod);
    data.append("mobileNumber", paymentData.mobileNumber);
    // Subscription plan
    data.append("subscriptionPlan", subscriptionPlan);

    try {
      // Replace with your backend API endpoint
      const response = await fetch("/api/vendor/register", {
        method: "POST",
        body: data,
      });
      navigate({ to: "/admin" });
      if (response.ok) {
        setMessage(
          "Registration submitted successfully! Redirecting to your dashboard"
        );
        // Redirect to the dashboard or another page after successful registration
        // navigate({ to: "/admin" });
      } else {
        setMessage("Error during registration. Please try again.");
      }
    } catch (error) {
      console.error(error);
      navigate({ to: "/admin" });
      setMessage("Network error. Please try again later.");
    }
  };

  return (
    <div className="my-[3rem] w-full slide-up">
      <div className="max-w-3xl mx-auto p-6 border rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Vendor Registration</h1>
        {message && <div className="mb-4 text-green-600">{message}</div>}
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Create Your Account
              </h2>
              <div className="mb-4">
                <label htmlFor="fullName" className="block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={accountData.fullName}
                  onChange={handleAccountChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={accountData.email}
                  onChange={handleAccountChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={accountData.phone}
                  onChange={handleAccountChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={accountData.address}
                  onChange={handleAccountChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={accountData.password}
                  onChange={handleAccountChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 text-white p-2 rounded"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Vendor Profile Setup
              </h2>
              <div className="mb-4">
                <label htmlFor="businessName" className="block mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={vendorData.businessName}
                  onChange={handleVendorChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="contactEmail" className="block mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={vendorData.contactEmail}
                  onChange={handleVendorChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={vendorData.phone}
                  onChange={handleVendorChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={vendorData.address}
                  onChange={handleVendorChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
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
                  onClick={nextStep}
                  className="bg-blue-600 text-white p-2 rounded"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Subscription Plan Selection
              </h2>
              <VendorSubscriptionForm
                onPlanSelect={(plan: string) => setSubscriptionPlan(plan)}
              />
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-300 text-black p-2 rounded"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 text-white p-2 rounded"
                  disabled={!subscriptionPlan}
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Payment Subscription
              </h2>
              <div className="mb-4">
                <label htmlFor="paymentMethod" className="block mb-1">
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={paymentData.paymentMethod}
                  onChange={handlePaymentChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select a Payment Method</option>
                  <option value="mobile_money">Mobile Money</option>
                </select>
              </div>
              {paymentData.paymentMethod === "mobile_money" && (
                <div className="mb-4">
                  <label htmlFor="mobileNumber" className="block mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={paymentData.mobileNumber}
                    onChange={handlePaymentChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              )}
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Please click "Process Payment" to send a payment request to
                  your phone.
                </p>
              </div>
              <div className="flex justify-between mb-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-300 text-black p-2 rounded"
                >
                  Back
                </button>
                {!paymentProcessed && (
                  <button
                    type="button"
                    onClick={handleProcessPayment}
                    className="bg-blue-600 text-white p-2 rounded"
                    disabled={
                      !paymentData.paymentMethod || !paymentData.mobileNumber
                    }
                  >
                    Process Payment
                  </button>
                )}
              </div>
              {paymentProcessed && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Payment request sent. Once you receive the confirmation
                    message on your phone, click below to confirm payment.
                  </p>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleCheckPaymentStatus}
                      className="bg-blue-600 text-white p-2 rounded"
                      disabled={
                        !paymentData.paymentMethod || !paymentData.mobileNumber
                      }
                    >
                      Payment Done: Check Payment Status
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {step === 5 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Review & Submit</h2>
              <div className="mb-4">
                <h3 className="font-bold">Account Details</h3>
                <p>
                  <strong>Full Name:</strong> {accountData.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {accountData.email}
                </p>
                <p>
                  <strong>Phone:</strong> {accountData.phone}
                </p>
                <p>
                  <strong>Address:</strong> {accountData.address}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="font-bold">Vendor Profile</h3>
                <p>
                  <strong>Business Name:</strong> {vendorData.businessName}
                </p>
                <p>
                  <strong>Contact Email:</strong> {vendorData.contactEmail}
                </p>
                <p>
                  <strong>Phone:</strong> {vendorData.phone}
                </p>
                <p>
                  <strong>Address:</strong> {vendorData.address}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="font-bold">Subscription Plan</h3>
                <p>
                  <strong>Plan Selected:</strong>{" "}
                  {subscriptionPlan.charAt(0).toUpperCase() +
                    subscriptionPlan.slice(1)}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="font-bold">Payment Details</h3>
                <p>
                  <strong>Payment Method:</strong> {paymentData.paymentMethod}
                </p>
                {paymentData.paymentMethod === "mobile_money" && (
                  <p>
                    <strong>Mobile Number:</strong> {paymentData.mobileNumber}
                  </p>
                )}
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="bg-gray-300 text-black p-2 rounded"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white p-2 rounded"
                >
                  Submit Registration
                </button>
              </div>
            </div>
          )}
        </form>
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
