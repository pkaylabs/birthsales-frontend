import { BASE_URL } from "@/constants";
import { Service } from "@/redux/type";
import React from "react";
import { useNavigate } from "react-location";

interface ServiceCardProps {
  service: Service;
  /** Navigate to detail view */
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const navigate = useNavigate();

  const handleServiceClick = (id: number) => {
    navigate({
      to: `/services/${id}`,
    });
  };

  return (
    <div
      onClick={() => handleServiceClick(Number(service.id))}
      className="w-full   
                 flex flex-col justify-between mb-6 rounded-xl relative 
                 hover:scale-90 transform transition-transform duration-500 ease-in-out shadow-lg"
    >
      <div className="w-full h-48 overflow-hidden rounded-t-xl flex items-center justify-center bg-gray-100">
        <img
          src={`${BASE_URL}${service.image}`}
          alt={service.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="p-2">
        <h1 className="font-medium text-2xl text-gray-800">{service.name}</h1>
        <p className="font-normal mobile:text-sm tablet:text-base desktop:text-base large-screen:text-lg desktop-up:text-base text-gray-400">
          {service.description}
        </p>
        <p className="font-medium mobile:text-base tablet:text-lg desktop:text-lg large-screen:text-xl desktop-up:text-lg">
          ${service.price}
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;
