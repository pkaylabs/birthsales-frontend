import { CONFIRM_ORDER } from "@/constants";
import React, { useState } from "react";
import { useNavigate } from "react-location";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "LCD Monitor",
    image:
      "https://plus.unsplash.com/premium_photo-1681816189679-fa02d1acd1de?q=80&w=1777&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 100,
  },
  {
    id: 2,
    name: "H1 GamePad",
    image:
      "https://images.unsplash.com/photo-1606318801954-d46d46d3360a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 650,
  },
];

const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [network, setNetwork] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const subTotal = products.reduce((sum, product) => {
    return sum + product.price;
  }, 0);

  return (
    <div className="max-w-[75rem] mx-auto slide-up  mb-[10rem]">
      {/* home / cart */}
      <div className="mt-6 flex items-center space-x-3 text-gray-400">
        <p>Account</p> <span>/</span> <p>My Account</p> <span>/</span>{" "}
        <p>Product</p> <span>/</span> <p>Cart</p> <span>/</span>{" "}
        <p className="text-black">Checkout</p>
      </div>
      {/* Payment and ordering */}
      <div className=" mt-[3rem] p-1 flex justify-between  gap-5 ">
        {/* Payment method */}
        <div className=" flex-1">
          <div className="flex flex-col justify-between gap-10">
            <h1 className="flex items-center text-2xl font-bold mb-1">
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
                  className="scale-150 accent-black"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="delivery" className="text-lg">
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
                  className="scale-150 accent-black"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="delivery" className="text-lg">
                  Pay with Mobile Money
                </label>
                <br />
              </div>
            </div>
            {paymentMethod === "mobileMoney" && (
              <div className="flex flex-col gap-2">
                <h1 className="font-bold mb-2">ADD PAYMENT DETAILS</h1>
                <div className="">
                  <select
                    name="network"
                    id="network"
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                    className="border border-gray-300 rounded-md mr-4  p-2 bg-[#F5F5F5] w-1/2"
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
                    className=" border border-gray-300  rounded-md mr-4 p-2 bg-[#F5F5F5] w-1/2"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {/* ordering */}

        <div className="rounded p-5 flex flex-col justify-between gap-5 mt-[3rem] flex-1 ">
          <div className="flex flex-col justify-between gap-2  overflow-y-auto flex-shrink-0 max-h-[150px] pr-2">
            {products.map((product) => {
              return (
                <div className="flex justify-between items-center">
                  <div className="flex items-center justify-start gap-2 ">
                    <img
                      src={product.image}
                      alt=""
                      className="object-cover w-10 h-10 rounded-full"
                    />
                    <p>{product.name}</p>
                  </div>
                  <p>${product.price}</p>
                </div>
              );
            })}
          </div>
          {/* subtotal */}
          <div className="flex flex-col justify-between gap-3">
            <div className="flex justify-between">
              <p>Subtotal:</p>
              <p>${subTotal}</p>
            </div>
            <div className=" border border-gray-300" />
            <div className="flex justify-between">
              <p>Shipping:</p>
              <p>Free</p>
            </div>
            <div className=" border border-gray-300" />
            <div className="flex justify-between">
              <p>GrandTotal:</p>
              <p className="font-bold pulse mx-2">${subTotal}</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={() => navigate({ to: CONFIRM_ORDER })}
              className="w-full h-[48px] rounded  bg-[#DB4444] text-white shadow-md hover:shadow-gray-400"
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
