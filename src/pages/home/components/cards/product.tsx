import React from "react";
import { GrFavorite } from "react-icons/gr";
import { LuEye } from "react-icons/lu";
import pad from "@/assets/images/pad.png";
import { motion } from "framer-motion";
import { IoStar } from "react-icons/io5";

const ProductCard = () => {
  return (
    <div
      className="flex-shrink-0 w-1/4 px-2 box-border "
      style={{ maxWidth: "25%" }}
    >
      <motion.div className="relative w-full h-64 bg-gray-100 rounded-md p-4 overflow-hidden group">
        <div className="w-fit px-4 py-2 rounded-md bg-[#DB4444]">
          <p className="text-white text-xs">-40%</p>
        </div>

        <div className="absolute right-3 top-4">
          <div className="w-9 h-9 rounded-full bg-white flex justify-center items-center cursor-pointer mb-2">
            <GrFavorite className="size-5" aria-hidden="true" />
          </div>
          <div className="w-9 h-9 rounded-full bg-white flex justify-center items-center cursor-pointer">
            <LuEye className="size-5" aria-hidden="true" />
          </div>
        </div>

        <div className="w-full flex justify-center">
          <div className="w-44 h-36">
            <img
              src={pad}
              alt="item-image"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <motion.button
          className="hidden absolute z-10 bottom-0 left-0 w-full bg-black h-11 group-hover:flex justify-center items-center"
          initial={{ y: "100%", opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          animate={{ y: "100%", opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="font-medium text-white text-base">Add To Cart</p>
        </motion.button>
      </motion.div>

      <div className="mt-3">
        <h4 className="font-medium text-base text-black ">
          HAVIT HV-G92 Gamepad
        </h4>
        <p className="font-medium text-base">
          <span className="text-[#DB4444] mr-3">$120</span>
          <span className="text-gray-400 line-through ">$120</span>
        </p>

        <div className="flex items-center space-x-4 mt-2">
          <div className="flex items-center space-x-1.5">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <IoStar
                key={index}
                className={`size-5  ${
                  index === 4 ? "text-black" : "text-[#FFAD33]"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="font-medium text-base text-gray-400 ">(88)</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
