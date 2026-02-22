import { LOGIN } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/redux";
import { clearCart, removeFromCart } from "@/redux/features/cart/cartSlice";
import { useGetLocationsQuery } from "@/redux/features/locations/locationsApi";
import {
  usePaystackCheckStatusMutation,
  usePaystackInitializePaymentMutation,
  usePlaceOrderMutation,
} from "@/redux/features/orders/orderApiSlice";
import type { Location } from "@/redux/type";
import { CircularProgress } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-location";
import { toast } from "react-toastify";
import { resolveProductImageUrl } from "@/utils/resolve-image-url";

const GH_PHONE = /^(?:0|233)(?:24|25|54|55|20|26|27|50|56|57|28)\d{7}$/;

const LS_ORDER_IDS = "paystack_order_pending_order_ids";
const LS_ORDER_INDEX = "paystack_order_pending_index";
const LS_ORDER_REF = "paystack_order_reference";
const LS_ORDER_URL = "paystack_order_auth_url";

const isPaidStatus = (status: string): boolean => {
  const s = status.toLowerCase();
  return (
    s === "success" ||
    s === "successful" ||
    s === "paid" ||
    s === "completed" ||
    s === "complete"
  );
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const extractErrorMessage = (err: unknown, fallback: string): string => {
  if (!err) return fallback;
  if (typeof err === "string") return err;

  if (isRecord(err)) {
    const data = err.data;
    if (typeof data === "string") return data;
    if (Array.isArray(data) && typeof data[0] === "string") return data[0];
    if (isRecord(data)) {
      const message = data.message;
      if (typeof message === "string") return message;
      const detail = data.detail;
      if (typeof detail === "string") return detail;
      const errorMessage = data["error_message"];
      if (typeof errorMessage === "string") return errorMessage;
    }
    const message = err.message;
    if (typeof message === "string") return message;
  }

  return fallback;
};

const extractOrderIds = (payload: unknown): number[] => {
  if (!payload) return [];

  const getId = (v: unknown): number | null => {
    if (!isRecord(v)) return null;
    const rawId = v.id;
    const id = Number(rawId);
    return Number.isFinite(id) ? id : null;
  };

  if (Array.isArray(payload)) {
    return payload
      .map(getId)
      .filter((id): id is number => typeof id === "number");
  }

  if (isRecord(payload)) {
    const orders = payload["orders"];
    const data = payload["data"];
    const maybeList = Array.isArray(orders) ? orders : Array.isArray(data) ? data : null;
    if (maybeList) {
      return maybeList
        .map(getId)
        .filter((id): id is number => typeof id === "number");
    }

    const id = getId(payload);
    if (id != null) return [id];

    if (isRecord(data)) {
      const nestedId = getId(data);
      if (nestedId != null) return [nestedId];
    }
  }

  return [];
};

const Checkout = () => {
  const items = useAppSelector((state) => state.cart.items);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [locationId, setLocationId] = useState("");
  const [customerPhone, setcustomerPhone] = useState("");

  const { data: locationsData, isLoading: locationsLoading } =
    useGetLocationsQuery();

  const [placeOrder, { isLoading: placing }] = usePlaceOrderMutation();
  const [initializePaystack, { isLoading: initLoading }] =
    usePaystackInitializePaymentMutation();
  const [checkPaystackStatus, { isLoading: statusLoading }] =
    usePaystackCheckStatusMutation();

  const [pendingPaystackRef, setPendingPaystackRef] = useState<string | null>(
    null
  );
  const [pendingPaystackUrl, setPendingPaystackUrl] = useState<string | null>(
    null
  );
  const autoCheckRanRef = useRef(false);

  const subTotal = items.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  );

  const locations: Location[] = locationsData ?? [];
  const selectedLocation = locations.find((l) => String(l.id) === locationId);
  const deliveryFee = selectedLocation?.delivery_fee_price ?? 0;
  const total = subTotal + deliveryFee;

  const startPaystackForOrderIds = useCallback(
    async (orderIds: number[], index: number) => {
      const orderId = orderIds[index];
      const init = await initializePaystack({ order: orderId }).unwrap();
      if (init.status === "failed") {
        throw new Error(init.message || "Payment initialization failed");
      }

      localStorage.setItem(LS_ORDER_IDS, JSON.stringify(orderIds));
      localStorage.setItem(LS_ORDER_INDEX, String(index));
      localStorage.setItem(LS_ORDER_REF, init.reference);
      localStorage.setItem(LS_ORDER_URL, init.authorization_url);

      window.location.assign(init.authorization_url);
    },
    [initializePaystack]
  );

  const clearPendingPaystack = () => {
    localStorage.removeItem(LS_ORDER_IDS);
    localStorage.removeItem(LS_ORDER_INDEX);
    localStorage.removeItem(LS_ORDER_REF);
    localStorage.removeItem(LS_ORDER_URL);
    setPendingPaystackRef(null);
    setPendingPaystackUrl(null);
  };

  // Auto-check payment status when Paystack redirects back.
  useEffect(() => {
    if (autoCheckRanRef.current) return;
    autoCheckRanRef.current = true;

    const ref = localStorage.getItem(LS_ORDER_REF);
    const url = localStorage.getItem(LS_ORDER_URL);
    const idsJson = localStorage.getItem(LS_ORDER_IDS);
    const idxStr = localStorage.getItem(LS_ORDER_INDEX);

    if (!ref || !idsJson) return;

    setPendingPaystackRef(ref);
    if (url) setPendingPaystackUrl(url);

    let orderIds: number[] = [];
    try {
      orderIds = JSON.parse(idsJson);
      if (!Array.isArray(orderIds)) orderIds = [];
    } catch {
      orderIds = [];
    }
    const index = Number(idxStr ?? "0");
    const safeIndex = Number.isFinite(index) ? index : 0;

    (async () => {
      try {
        const res = await checkPaystackStatus({ reference: ref }).unwrap();
        if (!res.status || !isPaidStatus(res.status)) {
          toast.info(res.message || `Payment status: ${res.status || "unknown"}`);
          return;
        }

        // Current payment confirmed.
        const nextIndex = safeIndex + 1;
        if (orderIds.length > 0 && nextIndex < orderIds.length) {
          toast.success("Payment confirmed. Continuing to next order...");
          await startPaystackForOrderIds(orderIds, nextIndex);
          return;
        }

        // All done.
        clearPendingPaystack();
        toast.success("Payment successful! Thank you for your purchase.");
        setcustomerPhone("");
        setLocationId("");
        dispatch(clearCart());
        navigate({ to: "/" });
      } catch (err: unknown) {
        toast.error(extractErrorMessage(err, "Failed to check payment status"));
      }
    })();
  }, [checkPaystackStatus, dispatch, navigate, startPaystackForOrderIds]);

  const handleRemove = (key: string) => {
    dispatch(removeFromCart(key));
    toast.success("Removed item from cart");
  };

  const handlePlaceOrder = async () => {
    if (pendingPaystackRef) {
      toast.info("A Paystack payment is already in progress.");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to place an order");
      navigate({ to: LOGIN });
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (!locationId) {
      toast.error("Please select your delivery location");
      return;
    }

    if (customerPhone && !GH_PHONE.test(customerPhone)) {
      toast.error("Please enter a valid Ghana phone number");
      return;
    }

    let orderIds: number[] = [];
    try {
      const res = await placeOrder({
        items: items.map(({ product, quantity, color, size }) => ({
          product: Number(product.id),
          quantity,
          color,
          size,
        })),
        location: locationId,
        customer_phone: customerPhone,
      }).unwrap();

      orderIds = extractOrderIds(res?.data);
      if (orderIds.length === 0) {
        throw new Error("Unexpected order response");
      }
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to place order"));
      return;
    }

    if (paymentMethod === "onDelivery") {
      toast.success("Order placed! Pay on delivery when the rider arrives.");
      setcustomerPhone("");
      setLocationId("");
      dispatch(clearCart());
      navigate({ to: "/" });
      return;
    }

    if (paymentMethod === "paystack") {
      try {
        await startPaystackForOrderIds(orderIds, 0);
      } catch (err: unknown) {
        toast.error(extractErrorMessage(err, "Payment initialization failed"));
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

          {pendingPaystackRef && (
            <div className="mb-4 p-3 rounded border border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-700">
                Paystack payment in progress. When you return here, we'll check automatically.
              </p>
              {pendingPaystackUrl && (
                <button
                  className="mt-2 text-blue-600 underline break-all"
                  onClick={() => window.location.assign(pendingPaystackUrl)}
                >
                  Continue payment
                </button>
              )}
              <div className="mt-2 flex gap-2">
                <button
                  className="px-3 py-1 text-sm border rounded"
                  disabled={statusLoading}
                  onClick={async () => {
                    const ref = pendingPaystackRef;
                    if (!ref) return;
                    try {
                      const res = await checkPaystackStatus({ reference: ref }).unwrap();
                      if (res.status && isPaidStatus(res.status)) {
                        // Re-run auto-check logic by reloading.
                        window.location.reload();
                        return;
                      }
                      toast.info(res.message || `Payment status: ${res.status || "unknown"}`);
                    } catch (err: unknown) {
                      toast.error(extractErrorMessage(err, "Failed to check payment status"));
                    }
                  }}
                >
                  {statusLoading ? "Checking..." : "Check status"}
                </button>
                <button
                  className="px-3 py-1 text-sm border rounded"
                  onClick={clearPendingPaystack}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

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
                value="paystack"
                className="mr-2 accent-[#DB4444]"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Paystack
            </label>

            {paymentMethod === "paystack" && (
              <p className="text-gray-500 text-sm">
                You'll be redirected to Paystack to complete payment.
              </p>
            )}
          </div>

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
        </section>

        {/* Right: Order Summary */}
        <section className="flex-1 bg-white p-6 rounded-lg shadow flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Your Items</h2>
          <div className="flex-1 space-y-4 overflow-auto mb-4">
            {items.length ? (
              items.map(({ key, product, quantity, color, size }) => (
                <div
                  key={key}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={resolveProductImageUrl(product)}
                      alt={product.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium">
                        {product.name} × {quantity}
                      </div>
                      {(color || size) && (
                        <div className="text-xs text-gray-500">
                          {color ? `Color: ${color}` : ""}
                          {color && size ? " • " : ""}
                          {size ? `Size: ${size}` : ""}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">
                      GHC{Math.round(product.price * quantity)}
                    </span>
                    <button
                      onClick={() => handleRemove(key)}
                      aria-label={`Remove ${product.name} from cart`}
                      type="button"
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

          <div className="border-t border-gray-200 pt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Location
              </label>
              <select
                className="w-full border border-gray-300 rounded p-2"
                aria-label="Delivery Location"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                disabled={locationsLoading}
              >
                <option value="">
                  {locationsLoading ? "Loading locations..." : "Select location"}
                </option>
                {locations.map((l) => (
                  <option key={String(l.id)} value={String(l.id)}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>GHC{Math.round(subTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery fee</span>
                <span>GHC{Math.round(deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>GHC{Math.round(total)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={
              placing ||
              initLoading ||
              statusLoading ||
              items.length === 0 ||
              !!pendingPaystackRef
            }
            className={`mt-6 w-full py-2 rounded text-white 
          ${
            placing ||
            initLoading ||
            statusLoading ||
            items.length === 0 ||
            !!pendingPaystackRef
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#DB4444] hover:bg-[#c33]"
          }`}
          >
            {paymentMethod === "onDelivery" ? (
              "Place Order"
            ) : placing || initLoading ? (
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
