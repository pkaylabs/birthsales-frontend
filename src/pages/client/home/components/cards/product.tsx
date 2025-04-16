import React from "react";
import { GrFavorite } from "react-icons/gr";
import { LuEye } from "react-icons/lu";
import pad from "@/assets/images/pad.png";
import { motion } from "framer-motion";
import { IoStar } from "react-icons/io5";
import { useNavigate } from "react-location";

const ProductCard = () => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate({
      to: `/product-details`,
      search: {
        id: 1,
      },
    });
  };

  return (
    <div className="flex-shrink-0 flex-1 px-2 box-border mobile:px-2 tablet:px-4 desktop:px-6">
      <motion.div className="relative w-full h-64 bg-gray-100 rounded-md p-4 overflow-hidden group mobile:h-40 mobile:p-2 tablet:h-56 tablet:p-3 desktop:h-64 desktop:p-4">
        <div className="w-fit px-4 py-2 rounded-md bg-[#DB4444] absolute top-4 left-4 mobile:px-2 mobile:py-1 tablet:px-3 tablet:py-1.5">
          <p className="text-white text-xs mobile:text-[8px] tablet:text-[10px] desktop:text-xs">-40%</p>
        </div>

        <div className="absolute right-3 top-4 mobile:right-2 mobile:top-2">
          <button className="w-9 h-9 rounded-full bg-white flex justify-center items-center cursor-pointer mb-2 shadow-sm mobile:w-6 mobile:h-6 mobile:mb-1 tablet:w-8 tablet:h-8 desktop:w-9 desktop:h-9">
            <GrFavorite className="size-5 mobile:size-3 tablet:size-4 desktop:size-5" aria-hidden="true" />
          </button>
          <button
            onClick={handleProductClick}
            className="w-9 h-9 rounded-full bg-white flex justify-center items-center cursor-pointer shadow-sm mobile:w-6 mobile:h-6 tablet:w-8 tablet:h-8 desktop:w-9 desktop:h-9" 
          >
            <LuEye className="size-5 mobile:size-3 tablet:size-4 desktop:size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="w-full flex justify-center items-center mobile:h-full">
          <div className="w-44 h-36 mobile:w-24 mobile:h-20 tablet:w-32 tablet:h-28 desktop:w-44 desktop:h-36">
            <img
              src={pad}
              alt="item-image"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <motion.button
          className="hidden absolute z-10 bottom-0 left-0 w-full bg-black h-11 group-hover:flex justify-center items-center mobile:h-5 tablet:h-9 desktop:h-11" 
          initial={{ y: "100%", opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          animate={{ y: "100%", opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="font-medium text-white text-base mobile:text-[12px] tablet:text-sm desktop:text-base">
            Add To Cart
          </p>
        </motion.button>
      </motion.div>

      <div className="mt-3 mobile:mt-2">
        <h4 className="font-medium text-base text-black mobile:text-[12px] tablet:text-sm desktop:text-base">
          HAVIT HV-G92 Gamepad
        </h4>
        <p className="font-medium text-base text-gray-400 mobile:text-[12px] tablet:text-sm desktop:text-base">
          <span className="text-[#DB4444] mr-3">$120</span>
          <span className="text-gray-400 line-through ">$120</span>
        </p>

        <div className="flex items-center space-x-4 mt-2 mobile:space-x-2 mobile:mt-1 tablet:space-x-3">
          <div className="flex items-center space-x-1.5 mobile:space-x-1 tablet:space-x-1.5">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <IoStar
                key={index}
                className={`size-5 mobile:size-3 tablet:size-4 desktop:size-5  ${
                  index === 4 ? "text-black" : "text-[#FFAD33]"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="font-medium text-base text-gray-400 mobile:text-[12px] tablet:text-sm desktop:text-base">
            (88)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
