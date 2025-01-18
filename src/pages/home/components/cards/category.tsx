import React from "react";
import { IoPhonePortraitOutline } from "react-icons/io5";

const CategoryCard = () => {
  return (
    <div
      className="group w-44 h-36 border border-black hover:border-white hover:bg-[#DB4444] rounded-md
     flex flex-col space-y-5 justify-center items-center cursor-pointer transition-all duration-150 ease-in-out
      "
    >
      <IoPhonePortraitOutline
        className="size-10 group-hover:text-white transition-all duration-150 ease-in-out"
        aria-hidden="true"
      />
      <p className="text-base text-black group-hover:text-white transition-all duration-150 ease-in-out">
        HeadPhones
      </p>
    </div>
  );
};

export default CategoryCard;
