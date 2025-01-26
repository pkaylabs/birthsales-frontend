import React from "react";

const ServiceCard = ({
  img,
  title,
  description,
  startPrice,
  endPrice,
}: {
  img: string;
  title: string;
  description: string;
  startPrice: number;
  endPrice: number;
}) => {
  return (
    <div className="w-[300px] flex flex-col justify-between p-4 mb-6 rounded-xl relative hover:scale-90 tranform transition-transform duration-500 ease-in-out shadow-lg">
      <div className="rounded-xl h-2/3 bg-slate-100">
        <img
          src={img}
          alt="thumbnails"
          className="w-full object-contain h-full rounded-xl"
        />
      </div>
      <div className="flex flex-col ">
        <div>
          <h1 className="font-medium text-xl">{title}</h1>
        </div>
        {/* a faint line */}

        <div className="">
          <p className="font-normal text-base text-gray-400">{description}</p>
        </div>
        <div className="">
          <p className="font-medium">
            ${startPrice} - ${endPrice}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
