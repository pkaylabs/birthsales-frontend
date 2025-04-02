import { m } from "framer-motion";
import React, { useState } from "react";

const VendorAccount = () => {
  // Steps:
  // 1 = Create Account, 2 = Vendor Profile, 3 = Payment Subscription, 4 = Review & Submit
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const [accountData, setAccountData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [vendorData, setVendorData] = useState({
    businessName: "",
    contactEmail: "",
    address: "",
    verificationDocument: null,
  });

  const [paymentData, setPaymentData] = useState({
    paymentMethod: "",
    cardNumber: "",
    mobileNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountData({
      ...accountData,
      [name]: value,
    });
  };

  const handleVendorChange = (e) => {
    const { name, value, files } = e.target;
    setVendorData({
      ...vendorData,
      [name]: files ? files[0] : value,
    });
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({
      ...paymentData,
      [name]: value,
    });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Final submission: create account, vendor profile, and process payment together.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare a combined form data object for submission
    const data = new FormData();
    // Account details
    data.append("fullName", accountData.fullName);
    data.append("email", accountData.email);
    data.append("password", accountData.password);
    // Vendor profile details
    data.append("businessName", vendorData.businessName);
    data.append("contactEmail", vendorData.contactEmail);
    data.append("address", vendorData.address);
    // data.append('verificationDocument', vendorData.verificationDocument);
    // Payment details
    data.append("paymentMethod", paymentData.paymentMethod);
    data.append("cardNumber", paymentData.cardNumber);
    data.append("expiry", paymentData.expiry);
    data.append("cvv", paymentData.cvv);

    try {
      // Replace with your backend API endpoint
      const response = await fetch("/api/vendor/register", {
        method: "POST",
        body: data,
      });
      if (response.ok) {
        setMessage(
          "Registration submitted successfully! Please verify your email and await admin approval."
        );
      } else {
        setMessage("Error during registration. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Network error. Please try again later.");
    }
  };

  return (
    <div className="my-[5rem] w-full slide-up">
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
                  Vendor Profile
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
              <div className="mb-4">
                <label htmlFor="verificationDocument" className="block mb-1">
                  Upload Verification Document
                </label>
                <input
                  type="file"
                  id="verificationDocument"
                  name="verificationDocument"
                  onChange={handleVendorChange}
                  className="w-full"
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
                  Payment
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
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
                  <option value="credit_card">Credit Card</option>
                  <option value="mobile_money">Mobile Money</option>
                </select>
              </div>
              {paymentData.paymentMethod === "credit_card" ? (
                <>
                  <div className="mb-4">
                    <label htmlFor="cardNumber" className="block mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={handlePaymentChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4 flex space-x-4">
                    <div className="flex-1">
                      <label htmlFor="expiry" className="block mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiry"
                        name="expiry"
                        placeholder="MM/YY"
                        value={paymentData.expiry}
                        onChange={handlePaymentChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="cvv" className="block mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={paymentData.cvv}
                        onChange={handlePaymentChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                  </div>
                </>
              ) : paymentData.paymentMethod === "mobile_money" ? (
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
              ) : null}
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
                  Review
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Review & Submit
              </h2>
              <div className="mb-4">
                <h3 className="font-bold">Account Details</h3>
                <p>
                  <strong>Full Name:</strong> {accountData.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {accountData.email}
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
                  <strong>Address:</strong> {vendorData.address}
                </p>
                <p>
                  <strong>Verification Document:</strong>{" "}
                  {vendorData.verificationDocument
                    ? vendorData.verificationDocument.name
                    : ""}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="font-bold">Payment Details</h3>
                <p>
                  <strong>Payment Method:</strong> {paymentData.paymentMethod}
                </p>
                {paymentData.paymentMethod === "credit_card" && (
                  <>
                    <p>
                      <strong>Card Number:</strong> **** **** ****{" "}
                      {paymentData.cardNumber.slice(-4)}
                    </p>
                    <p>
                      <strong>Expiry:</strong> {paymentData.expiry}
                    </p>
                  </>
                )}
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
