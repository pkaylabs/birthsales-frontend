import React, { useState, useEffect } from "react";
import { Link, useMatch, useNavigate } from "react-location";
import { LocationGenerics } from "@/router/location";
import { BASE_URL, CONFIRM_ORDER } from "@/constants";
import { useGetServicesQuery } from "@/redux/features/services/servicesApi";
import { TbTruckDelivery } from "react-icons/tb";
// import { GrPowerCycle } from "react-icons/gr";
import { motion } from "framer-motion";

const ServiceDetails: React.FC = () => {
  const { params } = useMatch<LocationGenerics>();
  const navigate = useNavigate();
  const { data: services = [], isLoading, isError } = useGetServicesQuery();
  const service = services.find((s) => s.id === Number(params.id));

  const [mainImage, setMainImage] = useState<string | undefined>(
    service ? `${BASE_URL}${service.image}` : undefined
  );

  // If service loads after query
  useEffect(() => {
    if (service) setMainImage(`${BASE_URL}${service.image}`);
  }, [service]);

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
          {/* repeat if multiple images */}
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
        <div className="flex-1 flex flex-col justify-between">
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

          {/* Actions */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate({ to: CONFIRM_ORDER })}
              className="w-full py-3 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition"
            >
              Book Now
            </button>
            <Link
              to="#"
              className="w-full py-3 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 transition"
            >
              <span className="mr-2">
                <TbTruckDelivery size={20} />
              </span>
              Delivery Info
            </Link>
          </div>
        </div>
      </div>

      {/* Extras */}
      {/* <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start space-x-4 p-4 border rounded-lg">
          <TbTruckDelivery size={24} className="text-gray-700" />
          <div>
            <h2 className="font-semibold">Free & Fast Delivery</h2>
            <p className="text-sm text-gray-600">Check availability by postal code.</p>
          </div>
        </div>
        <div className="flex items-start space-x-4 p-4 border rounded-lg">
          <GrPowerCycle size={24} className="text-gray-700" />
          <div>
            <h2 className="font-semibold">30-Day Returns</h2>
            <p className="text-sm text-gray-600">
              Easy returns within 30 days. <Link to="#" className="underline">Learn more</Link>
            </p>
          </div>
        </div>
      </div> */}
    </main>
  );
};

export default ServiceDetails;
