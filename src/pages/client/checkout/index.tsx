import { BASE_URL, LOGIN } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/redux";
import { clearCart, removeFromCart } from "@/redux/features/cart/cartSlice";
import {
  useMobilePaymentMutation,
  usePlaceOrderMutation,
} from "@/redux/features/orders/orderApiSlice";
import { CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-location";
import { toast } from "react-toastify";

const GH_PHONE = /^(?:0|233)(?:24|25|54|55|20|26|27|50|56|57|28)\d{7}$/;

const Checkout = () => {
  const items = useAppSelector((state) => state.cart.items);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [network, setNetwork] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [customerPhone, setcustomerPhone] = useState("");

  const [placeOrder, { isLoading: placing }] = usePlaceOrderMutation();
  const [payment, { isLoading: paying }] = useMobilePaymentMutation();

  const subTotal = items.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  );

  const handleRemove = (productId: number) => {
    dispatch(removeFromCart(productId));
    toast.success("Removed item from cart");
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("You must be logged in to place an order");
      navigate({ to: LOGIN });
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (!location) {
      toast.error("Please enter your delivery location");
      return;
    }

    let orderId: number;
    try {
      const { data } = await placeOrder({
        items: items.map(({ product, quantity }) => ({
          product: Number(product.id),
          quantity,
        })),
        location,
        customer_phone: customerPhone,
      }).unwrap();
      setcustomerPhone("");
      setLocation("");
      dispatch(clearCart());
      navigate({ to: "/" });
      orderId = data.id;
    } catch (err: any) {
      toast.error(err.data[0] || "Failed to place order");
      return;
    }

    if (paymentMethod === "onDelivery") {
      toast.success("Order placed! Pay on delivery when the rider arrives.");
      return;
    }

    if (paymentMethod === "mobileMoney") {
      if (!network || !phoneNumber) {
        toast.error("Please select network and enter your phone number");
        return;
      }
      if (!GH_PHONE.test(phoneNumber)) {
        toast.error("Please enter a valid phone number");
        return;
      }
      try {
        await payment({
          order: orderId,
          network,
          phone: phoneNumber,
        }).unwrap();
        toast.success("Payment successful! Thank you for your purchase.");
        dispatch(clearCart());
        navigate({ to: "/" });
      } catch (err: any) {
        toast.error(err?.data?.message || "Payment failed");
        return;
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-gray-500 text-sm flex flex-wrap gap-1">
        <span
          className="hover:underline cursor-pointer"
          onClick={() => navigate({ to: "/" })}
        >
          Home
        </span>
        <span>/</span>
        <span
          className="hover:underline cursor-pointer"
          onClick={() => navigate({ to: "/cart" })}
        >
          Cart
        </span>
        <span>/</span>
        <span className="font-semibold text-black">Checkout</span>
      </nav>

      {/* Main Content */}
      <div className="mt-6 flex flex-col lg:flex-row gap-8">
        {/* Left: Payment Method */}
        <section className="flex-1 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="onDelivery"
                className="mr-2 accent-[#DB4444]"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Pay on Delivery
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="mobileMoney"
                className="mr-2 accent-[#DB4444]"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Mobile Money
            </label>

            {paymentMethod === "mobileMoney" && (
              <div className="space-y-3">
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2"
                >
                  <option value="" disabled>
                    -- Select Network --
                  </option>
                  <option value="MTN">MTN</option>
                  <option value="Vodafone">Vodafone</option>
                  <option value="AirtelTigo">AirtelTigo</option>
                </select>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full border border-gray-300 rounded p-2"
                  value={phoneNumber}
                  maxLength={10}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value.replace(/\D/g, ""));
                  }}
                  onKeyDown={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                <p className="text-gray-400">
                  Payment will be done through this number
                </p>
              </div>
            )}
          </div>
          {paymentMethod === "mobileMoney" && <hr className="border mt-4 " />}
          <div className="my-5">
            <input
              type="tel"
              placeholder="Delivery phone number"
              className="w-full border border-gray-300 rounded p-2"
              value={customerPhone}
              onChange={(e) => setcustomerPhone(e.target.value)}
            />
            <p className="text-gray-400">
              The vendor will call you on this number
            </p>
          </div>
          <div className="my-5">
            <textarea
              className="w-full border border-gray-300 rounded p-2"
              placeholder="Enter location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </section>

        {/* Right: Order Summary */}
        <section className="flex-1 bg-white p-6 rounded-lg shadow flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Your Items</h2>
          <div className="flex-1 space-y-4 overflow-auto mb-4">
            {items.length ? (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`${BASE_URL}${product.image}`}
                      alt={product.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <span className="font-medium">
                      {product.name} × {quantity}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">
                      GHC{Math.round(product.price * quantity)}
                    </span>
                    <button
                      onClick={() => handleRemove(Number(product.id))}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Your cart is empty.</p>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>GHC{Math.round(subTotal)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>GHC{Math.round(subTotal)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={paying || items.length === 0}
            className={`mt-6 w-full py-2 rounded text-white 
          ${
            placing || items.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#DB4444] hover:bg-[#c33]"
          }`}
          >
            {paymentMethod === "onDelivery" ? (
              "Place Order"
            ) : paying ? (
              <CircularProgress size={24} />
            ) : (
              "Make Payment"
            )}
          </button>
        </section>
      </div>
    </div>
  );
};

export default Checkout;
