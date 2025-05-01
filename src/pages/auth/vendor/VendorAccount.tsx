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

  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   if (step === 1) setAccountData((prev) => ({ ...prev, [name]: value }));
  //   if (step === 2) setVendorData((prev) => ({ ...prev, [name]: value }));
  // };
  const handleAccountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountData(prev => ({ ...prev, [name]: value }));
  };

  const handleVendorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVendorData(prev => ({ ...prev, [name]: value }));
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
    if(!token) return;
    console.log('About to create business; token=', token);
    try {
      // map vendorData to CreateBusinessDto
      await createBusiness({
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
        await subscribePlan({ package: selectedPlan.id }).unwrap();
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
                  onChange={handleAccountChange}
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
            {["vendor_name", "vendor_email", "vendor_phone", "vendor_address"].map((f) => (
              <div key={f} className="mb-3">
                <label className="block mb-1">{f}</label>
                <input
                  name={f}
                  type="text"
                  value={(vendorData as any)[f]}
                  onChange={handleVendorChange}
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
                disabled={bizLoading || !token}
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
                      {'Monthly'}
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

// import React, { ChangeEvent, useState } from "react";
// import { Navigate } from "react-location";
// import { useRegisterMutation } from "@/redux/features/auth/authApiSlice";
// import {
//   useCreateBusinessMutation,
//   useSubscribePlanMutation,
// } from "@/redux/features/business/businessApiSlice";
// import { useGetPlansQuery } from "@/redux/features/plans/plansApi";
// import { ADMIN_HOME } from "@/constants";
// import type { Plan, User } from "@/redux/type";
// import { useAppSelector } from "@/redux";
// import { RootState } from "@/app/store";

// const VendorAccount: React.FC = () => {
//   const authUser: User | null = useAppSelector(
//     (state: RootState) => state.auth.user
//   );
//   const token = useAppSelector((state: RootState) => state.auth.token);
//   const [step, setStep] = useState(1);
//   const [accountData, setAccountData] = useState({ fullName: "", email: "", phone: "", address: "", password: "" });
//   const [vendorData, setVendorData] = useState({ vendor_name: "", vendor_email: "", vendor_phone: "", vendor_address: "" });
//   const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [mobileNumber, setMobileNumber] = useState("");

//   const [register, { isLoading: regLoading, error: regError }] = useRegisterMutation();
//   const [createBusiness, { isLoading: bizLoading, error: bizError }] = useCreateBusinessMutation();
//   const { data: plans = [], isLoading: plansLoading, error: plansError } = useGetPlansQuery(undefined, { skip: !token || step < 3 });
//   const [subscribePlan, { isLoading: subLoading, error: subError }] = useSubscribePlanMutation();

//   const handleAccountChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setAccountData(prev => ({ ...prev, [name]: value }));
//   };
//   const handleVendorChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setVendorData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAccountSubmit = async () => {
//     await register({
//       name: accountData.fullName,
//       email: accountData.email,
//       phone: accountData.phone,
//       address: accountData.address,
//       password: accountData.password,
//       user_type: "VENDOR",
//     }).unwrap();
//     setStep(2);
//   };
//   const handleBusinessSubmit = async () => {
//     await createBusiness(vendorData).unwrap();
//     setStep(3);
//   };
//   const handlePlanSubscribe = async () => {
//     if (!selectedPlan) return;
//     await subscribePlan({ package: selectedPlan.id }).unwrap();
//     setStep(5);
//   };

//   if (step === 5) return <Navigate to={ADMIN_HOME} />;

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//       <div className="w-full max-w-lg bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
//           <h2 className="text-xl font-semibold text-white text-center">Vendor Onboarding</h2>
//           <div className="flex mt-2 justify-center space-x-2">
//             {["Account","Profile","Plan","Payment"].map((label, idx) => (
//               <div key={idx} className={
//                 `px-3 py-1 rounded-full text-sm font-medium cursor-default ${step-1===idx ? 'bg-white text-blue-600' : 'bg-blue-200 text-blue-700'}`
//               }>{label}</div>
//             ))}
//           </div>
//         </div>
//         <div className="p-6 space-y-6">
//           {step === 1 && (
//             <div className="space-y-4">
//               {['fullName','email','phone','address','password'].map(f=> (
//                 <div key={f}>
//                   <label className="block text-sm font-medium text-gray-700 capitalize">{f.replace(/([A-Z])/g,' $1')}</label>
//                   <input name={f} type={f==='password'?'password':'text'} value={(accountData as any)[f] || ''} onChange={handleAccountChange}
//                     className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"/>
//                 </div>
//               ))}
//               {regError && <p className="text-red-600 text-sm">{(regError as any).data?.message}</p>}
//               <div className="text-right">
//                 <button onClick={handleAccountSubmit} disabled={regLoading}
//                   className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//           {step === 2 && (
//             <div className="space-y-4">
//               {['vendor_name','vendor_email','vendor_phone','vendor_address'].map(f=> (
//                 <div key={f}>
//                   <label className="block text-sm font-medium text-gray-700 uppercase">{f.replace('vendor_','')}</label>
//                   <input name={f} type="text" value={(vendorData as any)[f] || ''} onChange={handleVendorChange}
//                     className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"/>
//                 </div>
//               ))}
//               {bizError && <p className="text-red-600 text-sm">{(bizError as any).data?.message}</p>}
//               <div className="flex justify-between">
//                 <button onClick={()=>setStep(1)} className="px-4 py-2 bg-gray-300 rounded-md">Back</button>
//                 <button onClick={handleBusinessSubmit} disabled={bizLoading}
//                   className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//           {step === 3 && (
//             <div className="space-y-4">
//               {plansLoading && <p>Loading plans...</p>}
//               {plansError && <p className="text-red-600">Error loading plans</p>}
//               {!plansLoading && !plansError && plans.map(plan => (
//                 <div key={plan.id} className="flex justify-between items-center p-4 border rounded-md">
//                   <div>
//                     <p className="font-semibold">{plan.name}</p>
//                     <p className="text-sm text-gray-600">GHC{plan.price}/month</p>
//                   </div>
//                   <button onClick={()=>setSelectedPlan(plan)}
//                     className={`px-4 py-2 rounded-md ${selectedPlan?.id===plan.id?'bg-green-600 text-white':'bg-gray-200'}`}>
//                     {selectedPlan?.id===plan.id?'Selected':'Select'}
//                   </button>
//                 </div>
//               ))}
//               <div className="flex justify-between">
//                 <button onClick={()=>setStep(2)} className="px-4 py-2 bg-gray-300 rounded-md">Back</button>
//                 <button onClick={()=>setStep(4)} disabled={!selectedPlan}
//                   className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
//                   Proceed
//                 </button>
//               </div>
//             </div>
//           )}
//           {step === 4 && selectedPlan && (
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Payment Method</label>
//                 <select value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value)}
//                   className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
//                   <option value="">Select</option><option value="mobile_money">Mobile Money</option>
//                 </select>
//               </div>
//               {paymentMethod==='mobile_money' && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
//                   <input value={mobileNumber} onChange={e=>setMobileNumber(e.target.value)}
//                     className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"/>
//                 </div>
//               )}
//               <div className="flex justify-between">
//                 <button onClick={()=>setStep(3)} className="px-4 py-2 bg-gray-300 rounded-md">Back</button>
//                 <button onClick={handlePlanSubscribe} disabled={subLoading||!paymentMethod||!mobileNumber}
//                   className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
//                   {subLoading?'Processing..':'Pay & Finish'}
//                 </button>
//               </div>
//               {subError && <p className="text-red-600 text-sm">{(subError as any).data?.message}</p>}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VendorAccount;

