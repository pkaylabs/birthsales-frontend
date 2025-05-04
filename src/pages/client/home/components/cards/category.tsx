import { Category } from "@/redux/type";
import React from "react";
import { IoPhonePortraitOutline } from "react-icons/io5";
// import { IoPhonePortraitOutline } from "react-icons/io5";

interface CategoryCardProps extends Category {
  onClick?: (id: number) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  name,
  image,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick?.(Number(id))}
      className="group w-full h-full border border-gray-300 rounded-md transition-all duration-150 ease-in-out cursor-pointer
      flex flex-col items-center justify-center p-4 hover:bg-[#DB4444] hover:border-transparent"
    >
      {/* <IoPhonePortraitOutline
        className="transition-all duration-150 ease-in-out text-gray-700 group-hover:text-white text-5xl
          mobile:text-2xl tablets:text-4xl desktop:text-5xl"
        aria-hidden="true"
      /> */}
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-16 h-16 object-contain mb-2 group-hover:opacity-90"
        />
      ) : (
        // <div className="w-16 h-16 bg-gray-100 mb-2 rounded-full" />
        <IoPhonePortraitOutline
          className="transition-all duration-150 ease-in-out text-gray-700 group-hover:text-white text-5xl
          mobile:text-2xl tablets:text-4xl desktop:text-5xl"
          aria-hidden="true"
        />
      )}
      <span
        className="mt-2 text-center transition-all duration-150 ease-in-out text-gray-700 group-hover:text-white
          mobile:text-sm tablets:text-base desktop:text-lg"
      >
        {name}
      </span>
    </div>
  );
};

export default CategoryCard;
