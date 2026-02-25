import React, { useState, useEffect } from "react";
import { useMatch, useNavigate } from "react-location";
import { LocationGenerics } from "@/router/location";
import {
  useBookServiceMutation,
  useGetCustomerServiceQuery,
  useGetServiceImagesQuery,
} from "@/redux/features/services/servicesApi";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { CircularProgress, TextField } from "@mui/material";
import {
  usePaystackCheckStatusMutation,
  usePaystackInitializePaymentMutation,
} from "@/redux/features/orders/orderApiSlice";
import { resolveImageUrl } from "@/utils/resolve-image-url";

const LS_BOOKING_REF = "paystack_booking_reference";
const LS_BOOKING_URL = "paystack_booking_auth_url";

const ServiceDetails: React.FC = () => {
  const { params } = useMatch<LocationGenerics>();
  const serviceId = Number(params.id);
  const navigate = useNavigate();
  const {
    data: service,
    isLoading,
    isError,
  } = useGetCustomerServiceQuery(serviceId);
  const { data: serviceImages } = useGetServiceImagesQuery(serviceId, {
    skip: !Number.isFinite(serviceId) || serviceId <= 0,
  });
  const [bookService, { isLoading: booking }] = useBookServiceMutation();
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

  // default to today
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("08:30");
  const [location, setLocation] = useState("");

  const [gallery, setGallery] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const isRecord = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null;

  const extractErrorMessage = (err: unknown, fallback: string): string => {
    if (!err) return fallback;
    if (typeof err === "string") return err;

    if (isRecord(err)) {
      const data = err.data;
      if (typeof data === "string") return data;
      if (isRecord(data)) {
        const message = data.message;
        if (typeof message === "string") return message;
        const detail = data.detail;
        if (typeof detail === "string") return detail;
        const errorMessage = (data as any).error_message;
        if (typeof errorMessage === "string") return errorMessage;
      }
      const message = err.message;
      if (typeof message === "string") return message;
    }

    return fallback;
  };

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

  useEffect(() => {
    if (!service) return;

    const collectStrings = (v: unknown): string[] => {
      if (typeof v === "string") return [v];
      if (Array.isArray(v))
        return v.filter((x): x is string => typeof x === "string");
      return [];
    };

    const fromService = [
      ...collectStrings((service as unknown as { image?: unknown }).image),
      ...collectStrings((service as unknown as { images?: unknown }).images),
      ...collectStrings(
        (service as unknown as { extra_images?: unknown }).extra_images
      ),
      ...collectStrings(
        (service as unknown as { additionalImages?: unknown }).additionalImages
      ),
    ];

    const fromEndpoint = Array.isArray(serviceImages)
      ? serviceImages
          .flatMap((img) => {
            const rec = img as unknown as Record<string, unknown>;
            const url = rec["url"];
            const image = rec["image"];
            return [...collectStrings(url), ...collectStrings(image)];
          })
          .filter((s) => typeof s === "string")
      : [];

    const deduped = Array.from(
      new Set(
        [...fromService, ...fromEndpoint]
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      )
    );

    setGallery(deduped);
    setSelectedImage((prev) => {
      if (prev && deduped.includes(prev)) return prev;
      return deduped[0] ?? "";
    });
  }, [service, serviceImages]);

  const clearPendingPaystack = () => {
    localStorage.removeItem(LS_BOOKING_REF);
    localStorage.removeItem(LS_BOOKING_URL);
    setPendingPaystackRef(null);
    setPendingPaystackUrl(null);
  };

  // Auto-check booking payment status when Paystack redirects back.
  useEffect(() => {
    const ref = localStorage.getItem(LS_BOOKING_REF);
    const url = localStorage.getItem(LS_BOOKING_URL);
    if (!ref) return;

    setPendingPaystackRef(ref);
    if (url) setPendingPaystackUrl(url);

    (async () => {
      try {
        const res = await checkPaystackStatus({ reference: ref }).unwrap();
        if (res.status && isPaidStatus(res.status)) {
          clearPendingPaystack();
          toast.success("Payment confirmed");
          navigate({ to: "/" });
          return;
        }
        toast.info(res.message || `Payment status: ${res.status || "unknown"}`);
      } catch (err: unknown) {
        toast.error(extractErrorMessage(err, "Failed to check payment status"));
      }
    })();
  }, [checkPaystackStatus, navigate]);

  const handleBooking = async () => {
    if (pendingPaystackRef) {
      toast.info("A Paystack payment is already in progress.");
      return;
    }

    if (!date) {
      toast.error("Please select date");
      return;
    }
    if (!time) {
      toast.error("Please select time");
      return;
    }
    if (!location) {
      toast.error("Please enter your location");
      return;
    }

    try {
      const res = await bookService({
        service: Number(service?.id),
        date,
        time,
        location,
      }).unwrap();

      const bookingId = Number(res?.data?.id);
      if (!Number.isFinite(bookingId)) {
        toast.error("Booking created, but missing booking id");
        return;
      }

      const init = await initializePaystack({ booking: bookingId }).unwrap();
      if (init.status === "failed") {
        toast.error(init.message || "Payment initialization failed");
        return;
      }

      localStorage.setItem(LS_BOOKING_REF, init.reference);
      localStorage.setItem(LS_BOOKING_URL, init.authorization_url);
      window.location.assign(init.authorization_url);
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to book"));
    }
  };

  if (isLoading) return <p className="py-12 text-center">Loading…</p>;
  if (isError)
    return (
      <p className="py-12 text-center text-red-500">Error loading details.</p>
    );
  if (!service) return <p className="py-12 text-center">Service not found.</p>;

  const mainImageSrc = selectedImage
    ? resolveImageUrl(selectedImage)
    : resolveImageUrl((service as any).image);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-gray-500 text-sm mb-6" aria-label="Breadcrumb">
        <ol className="flex space-x-2">
          <li>
            <button
              onClick={() => navigate({ to: "/" })}
              className="hover:underline"
            >
              Home
            </button>
          </li>
          <li>/</li>
          <li>
            <button
              onClick={() => navigate({ to: "/services" })}
              className="hover:underline"
            >
              Services
            </button>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{service.name}</li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Thumbnails (hidden on small) */}
        {gallery.length > 1 && (
          <div className="hidden lg:flex flex-col gap-4 w-24">
            {gallery.map((img, idx) => (
              <motion.img
                key={idx}
                src={resolveImageUrl(img)}
                alt={service.name}
                className={`w-full h-24 object-cover rounded cursor-pointer border-2 ${
                  img === selectedImage
                    ? "border-rose-500"
                    : "border-gray-200"
                }`}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        )}

        {/* Main Image */}
        <motion.div
          className="flex-shrink-0 w-full lg:w-2/5 bg-gray-100 rounded-lg overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={mainImageSrc}
            alt={service.name}
            className="w-full h-auto object-contain"
          />
        </motion.div>

        {/* Details */}
        <div className="flex-1 flex flex-col justify-between w-full">
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {service.name}
            </h1>
            <p className="text-rose-600 text-xl font-semibold">
              GHC{Number(service.price)}
            </p>
            <p className="text-gray-600 leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Date & Time Pickers */}
          <div className="mt-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="Booking Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <TextField
              label="Booking Time"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <TextField
            label="Location"
            type="text"
            placeholder="Enter your location"
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          {/* Actions */}
          <div className="mt-6 grid grid-cols-1  gap-4 w-full">
            <button
              onClick={handleBooking}
              disabled={booking || initLoading || statusLoading || !!pendingPaystackRef}
              className="w-full py-3 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition"
            >
              {booking || initLoading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                "Book & Pay"
              )}
            </button>

            {pendingPaystackRef && (
              <div className="p-3 rounded border border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-700">
                  Paystack payment in progress. We'll check automatically when you return.
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
            {/* <Link
              to="#"
              className="w-full py-3 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 transition"
            >
              <span className="mr-2">
                <TbTruckDelivery size={20} />
              </span>
              Delivery Info
            </Link> */}
          </div>
        </div>
      </div>

    </main>
  );
};

export default ServiceDetails;
