import { BASE_URL, CONFIRM_ORDER, LOGIN } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/redux";
import { removeFromCart } from "@/redux/features/cart/cartSlice";
import { usePlaceOrderMutation } from "@/redux/features/orders/orderApiSlice";
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-location";
import { toast } from "react-toastify";

const Checkout = () => {
  const items = useAppSelector((state) => state.cart.items);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [network, setNetwork] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [placeOrder, { isLoading: placing }] = usePlaceOrderMutation();

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

    if (paymentMethod === "mobileMoney" && (!network || !phoneNumber)) {
      toast.error("Please select network and enter phone number");
      return;
    }

    const body = {
      items: items.map(({ product, quantity }) => ({
        product: Number(product.id),
        quantity,
      })),
    };

    try {
      const res = await placeOrder(body).unwrap();
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err.data.message || "Order failed");
    }

    // navigate({ to: CONFIRM_ORDER, search: { total: Math.round(subTotal) } });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
  {/* Breadcrumb */}
  <nav className="text-gray-500 text-sm flex flex-wrap gap-1">
    <span className="hover:underline cursor-pointer" onClick={() => navigate({to: "/"})}>Home</span>
    <span>/</span>
    <span className="hover:underline cursor-pointer" onClick={() => navigate({to: "/cart"})}>Cart</span>
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
            onChange={e => setPaymentMethod(e.target.value)}
          />
          Pay on Delivery
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="paymentMethod"
            value="mobileMoney"
            className="mr-2 accent-[#DB4444]"
            onChange={e => setPaymentMethod(e.target.value)}
          />
          Mobile Money
        </label>

        {paymentMethod === "mobileMoney" && (
          <div className="space-y-3">
            <select
              value={network}
              onChange={e => setNetwork(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
            >
              <option value="" disabled>-- Select Network --</option>
              <option value="MTN">MTN</option>
              <option value="Vodafone">Vodafone</option>
              <option value="AirtelTigo">AirtelTigo</option>
            </select>
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full border border-gray-300 rounded p-2"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
            />
          </div>
        )}
      </div>
    </section>

    {/* Right: Order Summary */}
    <section className="flex-1 bg-white p-6 rounded-lg shadow flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Your Items</h2>
      <div className="flex-1 space-y-4 overflow-auto mb-4">
        {items.length ? items.map(({ product, quantity }) => (
          <div key={product.id} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src={`${BASE_URL}${product.image}`}
                alt={product.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="font-medium">{product.name} × {quantity}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium">GHC{Math.round(product.price * quantity)}</span>
              <button
                onClick={() => handleRemove(Number(product.id))}
                className="p-1 text-red-600 hover:text-red-800"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        )) : (
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
        disabled={placing || items.length === 0}
        className={`mt-6 w-full py-2 rounded text-white 
          ${placing || items.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#DB4444] hover:bg-[#c33]"}`
        }
      >
        {placing ? "Placing Order…" : "Place Order"}
      </button>
    </section>
  </div>
</div>

  );
};

export default Checkout;