import React from "react";
import { TbTruckDelivery } from "react-icons/tb";
import { SlEarphonesAlt } from "react-icons/sl";
import { RiShieldCheckLine } from "react-icons/ri";

const elements = [
  {
    title: "FREE AND FAST DELIVERY",
    description: "Free delivery for all orders over $140",
    icon: TbTruckDelivery,
  },
  {
    title: "24/7 CUSTOMER SERVICE",
    description: "Friendly 24/7 customer support",
    icon: SlEarphonesAlt,
  },
  {
    title: "MONEY BACK GUARANTEE",
    description: "We return money within 30 days",
    icon: RiShieldCheckLine,
  },
];

const BottomCards = () => {
  return (
    <div className="w-full flex justify-center gap-8 md:gap-14">
      {elements.map((element, index) => (
        <div
          key={index}
          className="flex flex-col md:space-y-3 md:items-center md:justify-center items-center justify-center "
        >
          <div className="w-20 h-20 flex justify-center items-center rounded-full border-[14px] border-gray-300 bg-black mb-4 mobile:w-12 mobile:h-12 mobile:border-8">
            <element.icon className="size-4 text-white md:size-7" />
          </div>

          <h2 className="text-lg font-semibold text-[10px] text-center md:text-base">
            {element.title}
          </h2>
          <p className="text-center text-sm hidden md:flex md:text-base">{element.description}</p>
        </div>
      ))}
    </div>
  );
};

export default BottomCards;
