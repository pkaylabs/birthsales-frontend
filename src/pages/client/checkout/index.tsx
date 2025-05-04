import { BASE_URL, CONFIRM_ORDER } from "@/constants";
import { useAppSelector } from "@/redux";
import React, { useState } from "react";
import { useNavigate } from "react-location";

const Checkout = () => {
  const items = useAppSelector((state) => state.cart.items);

  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [network, setNetwork] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const subTotal = items.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  );

  return (
    <div className="max-w-[75rem]  slide-up  mb-[10rem] mx-5 md:mx-5 lg:mx-auto ">
      {/* Breadcrum */}
      <div className="mt-6 flex flex-row items-center  space-x-2 text-gray-400">
        <p className="text-base md:text-lg">Account</p>
        <span className="text-base md:text-lg">/</span>
        <p className="text-[14px] md:text-lg">My Account</p>
        <span className="text-base md:text-lg">/</span>
        <p className="text-base md:text-lg">Product</p>
        <span className="text-base md:text-lg">/</span>
        <p className="text-base md:text-lg cursor-pointer" onClick={() => navigate({to: '/cart'})}>Cart</p>
        <span className="text-base md:text-lg">/</span>
        <p className="text-black text-base md:text-lg">Checkout</p>
      </div>
      {/* Payment and ordering */}
      <div className="mt-[3rem] p-1 flex flex-col justify-between  gap-5 md:flex-row ">
        {/* Payment method */}
        <div className=" flex-1">
          <div className="flex flex-col justify-between gap-10">
            <h1 className="flex items-center text-base md:text-2xl font-bold mb-1">
              PAYMENT METHOD
            </h1>
            {/* Radio buttons */}
            <div>
              <div className="flex items-center gap-5 mb-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  id="delivery"
                  value="onDelivery"
                  className="scale-100 md:scale-150 accent-black"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="delivery" className="text-[14px] md:text-lg">
                  Pay on Delivery
                </label>
                <br />
              </div>
              <div className="flex items-center gap-5">
                <input
                  type="radio"
                  name="paymentMethod"
                  id="delivery"
                  value="mobileMoney"
                  className="scale-100 md:scale-150 accent-black"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="delivery" className="text-sm md:text-lg">
                  Pay with Mobile Money
                </label>
                <br />
              </div>
            </div>
            {paymentMethod === "mobileMoney" && (
              <div className="flex flex-col gap-2">
                <h1 className="text-base font-bold mb-2">
                  ADD PAYMENT DETAILS
                </h1>
                <div className="">
                  <select
                    name="network"
                    id="network"
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-md mr-4  p-2 bg-[#F5F5F5]  md:text-base lg:w-1/2"
                  >
                    <option value="" disabled>
                      -- Select Network --
                    </option>
                    <option value="MTN">MTN</option>
                    <option value="Vodafone">Vodafone</option>
                    <option value="AirtelTigo">AirtelTigo</option>
                  </select>
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Enter Phone Number"
                    className="w-full text-sm border border-gray-300  rounded-md mr-4 p-2 bg-[#F5F5F5]  md:text-base lg:w-1/2"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {/* ordering */}

        <div className="rounded  md:p-5 flex flex-col justify-between gap-5 mt-[3rem] flex-1 ">
          <div className="flex flex-col justify-between gap-2  overflow-y-auto flex-shrink-0 max-h-[150px] pr-2">
            {items.map((item) => {
              return (
                <div className="flex justify-between items-center">
                  <div className="flex items-center justify-start gap-2 ">
                    <img
                      src={`${BASE_URL}${item.product.image}`}
                      alt={item.product.name}
                      className="hidden md:flex lg:flex object-cover w-10 h-10 rounded-full"
                    />
                    <p className="">{item.product.name}</p>
                  </div>
                  <p className="">GHC{Math.round(item.product.price)}</p>
                </div>
              );
            })}
          </div>
          {/* subtotal */}
          <div className="flex flex-col justify-between gap-3">
            <div className="flex justify-between text-[12px] md:text-base">
              <p>Subtotal:</p>
              <p>GHC{Math.round(subTotal)}</p>
            </div>
            <div className=" border border-gray-300" />
            <div className="flex justify-between text-[12px] md:text-base">
              <p>Shipping:</p>
              <p>Free</p>
            </div>
            <div className=" border border-gray-300" />
            <div className="flex justify-between text-[12px] md:text-base">
              <p>GrandTotal:</p>
              <p className="font-bold pulse mx-2">GHC{Math.round(subTotal)}</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={() => navigate({ to: CONFIRM_ORDER })}
              className=" w-32 h-8 text-[12px]
                       md:w-48 md:h-10
                       lg:w-64 lg:h-12
                       xl:w-72 xl:h-14 xl:text-lg rounded-md  bg-[#DB4444] text-white shadow-md hover:shadow-gray-400"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
