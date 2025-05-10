// import React from "react";
// import { TbTruckDelivery } from "react-icons/tb";
// import { SlEarphonesAlt } from "react-icons/sl";
// import { RiShieldCheckLine } from "react-icons/ri";

// const elements = [
//   {
//     title: "FREE AND FAST DELIVERY",
//     description: "Free delivery for all orders over $140",
//     icon: TbTruckDelivery,
//   },
//   {
//     title: "24/7 CUSTOMER SERVICE",
//     description: "Friendly 24/7 customer support",
//     icon: SlEarphonesAlt,
//   },
//   {
//     title: "MONEY BACK GUARANTEE",
//     description: "We return money within 30 days",
//     icon: RiShieldCheckLine,
//   },
// ];

// const BottomCards = () => {
//   return (
//     <div className="w-full flex justify-center gap-8 md:gap-14">
//       {elements.map((element, index) => (
//         <div
//           key={index}
//           className="flex flex-col md:space-y-3 md:items-center md:justify-center items-center justify-center "
//         >
//           <div className="w-20 h-20 flex justify-center items-center rounded-full border-[14px] border-gray-300 bg-black mb-4 mobile:w-12 mobile:h-12 mobile:border-8">
//             <element.icon className="size-4 text-white md:size-7" />
//           </div>

//           <h2 className="text-lg font-semibold text-[10px] text-center md:text-base">
//             {element.title}
//           </h2>
//           <p className="text-center text-sm hidden md:flex md:text-base">{element.description}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default BottomCards;

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

const BottomCards: React.FC = () => (
  <div className="w-full max-w-4xl mx-auto px-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {elements.map(({ title, description, icon: Icon }, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center text-center space-y-3 p-4 bg-white rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-center rounded-full bg-black mb-2
                          w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
            <Icon className="text-white text-2xl sm:text-3xl md:text-4xl" />
          </div>
          <h3 className="font-semibold text-sm sm:text-base md:text-lg">
            {title}
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-gray-600">
            {description}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default BottomCards;
