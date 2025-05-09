import { BASE_URL } from "@/constants";
import { Service } from "@/redux/type";
import React from "react";
import { useNavigate } from "react-location";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate({ to: `/services/${service.id}` })}
      className="
        cursor-pointer
        transform hover:-translate-y-1 hover:shadow-2xl transition
        duration-300 ease-in-out
        flex flex-col bg-white rounded-lg overflow-hidden shadow-md
      "
    >
      {/* Image */}
      <div className="bg-gray-100 flex items-center justify-center h-48 sm:h-56 md:h-64">
        <img
          src={`${BASE_URL}${service.image}`}
          alt={service.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
          {service.name}
        </h2>
        <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-3">
          {service.description}
        </p>
        <span className="mt-auto text-lg md:text-xl font-bold text-rose-600">
          GHC{Math.round(service.price)}
        </span>
      </div>
    </div>
  );
};

export default ServiceCard;

