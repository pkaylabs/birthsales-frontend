import React from "react";
import { useNavigate } from "react-location";

const ServiceCard = ({
  service,
}: {
  service: {
    id: number;
    img: string;
    title: string;
    description: string;
    startPrice: number;
    endPrice: number;
  };
}) => {
  const navigate = useNavigate();

  const handleServiceClick = (id: number) => {
    navigate({
      to: `/services/${id}`,
      search: { service },
    });
  };

  return (
    <div
      onClick={() => handleServiceClick(service.id)}
      className="w-full   
                 flex flex-col justify-between mb-6 rounded-xl relative 
                 hover:scale-90 transform transition-transform duration-500 ease-in-out shadow-lg"
    >
      <img
        src={service.img}
        alt="thumbnails"
        className="w-full object-cover rounded-t-lg mb-3"
      />
      <div className="p-2">
        <h1 className="font-medium text-2xl text-gray-800">
          {service.title}
        </h1>
        <p className="font-normal mobile:text-sm tablet:text-base desktop:text-base large-screen:text-lg desktop-up:text-base text-gray-400">
          {service.description}
        </p>
        <p className="font-medium mobile:text-base tablet:text-lg desktop:text-lg large-screen:text-xl desktop-up:text-lg">
          ${service.startPrice} - ${service.endPrice}
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;

