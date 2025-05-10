import React, { useState, useEffect } from "react";
import { Link, useMatch, useNavigate } from "react-location";
import { LocationGenerics } from "@/router/location";
import { BASE_URL } from "@/constants";
import {
  useBookServiceMutation,
  useGetServicesQuery,
} from "@/redux/features/services/servicesApi";
import { TbTruckDelivery } from "react-icons/tb";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { TextField } from "@mui/material";
import PaymentModal from "./components/PaymentModal";

const ServiceDetails: React.FC = () => {
  const { params } = useMatch<LocationGenerics>();
  const navigate = useNavigate();
  const { data: services = [], isLoading, isError } = useGetServicesQuery();
  const [bookService, { isLoading: booking }] = useBookServiceMutation();
  const service = services.find((s) => s.id === Number(params.id));

  const [bookingId, setBookingId] = useState<number | null>(null);
  const [payOpen, setPayOpen] = useState(false);

  // default to today
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("08:30");

  const [mainImage, setMainImage] = useState<string | undefined>(
    service ? `${BASE_URL}${service.image}` : undefined
  );

  // refresh mainImage if service loads later
  useEffect(() => {
    if (service) setMainImage(`${BASE_URL}${service.image}`);
  }, [service]);

  const handleBooking = async () => {
    if (!date || !time) {
      toast.error("Please select date and time");
      return;
    }
    try {
      const res = await bookService({
        service: Number(service?.id),
        date,
        time,
      }).unwrap();
      setBookingId(res.data.id);
      toast.success(res.message);
      setPayOpen(true);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to book");
    }
    
  };

  if (isLoading) return <p className="py-12 text-center">Loading…</p>;
  if (isError)
    return (
      <p className="py-12 text-center text-red-500">Error loading details.</p>
    );
  if (!service) return <p className="py-12 text-center">Service not found.</p>;

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
        <div className="hidden lg:flex flex-col gap-4 w-24">
          <motion.img
            src={`${BASE_URL}${service.image}`}
            alt={service.name}
            className="w-full h-24 object-cover rounded cursor-pointer border-2 border-gray-200"
            whileHover={{ scale: 1.05 }}
            onClick={() => setMainImage(`${BASE_URL}${service.image}`)}
          />
        </div>

        {/* Main Image */}
        <motion.div
          className="flex-shrink-0 w-full lg:w-2/5 bg-gray-100 rounded-lg overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={mainImage}
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
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          {/* Actions */}
          <div className="mt-6 grid grid-cols-1  gap-4 w-full">
            <button
              onClick={handleBooking}
              disabled={booking}
              className="w-full py-3 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition"
            >
              {booking ? "Booking…" : "Book & Pay"}
            </button>
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

      {/* Payment modal when booking succeeds */}
      {bookingId && (
        <PaymentModal
          open={payOpen}
          bookingId={bookingId}
          onClose={() => setPayOpen(false)}
        />
      )}
    </main>
  );
};

export default ServiceDetails;
