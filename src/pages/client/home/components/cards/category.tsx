// src/components/cards/CategoryCard.tsx
import React from "react";
import { useNavigate } from "react-location";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { Category } from "@/redux/type";
import { CLIENT_CATEGORY_DETAILS } from "@/constants";

interface CategoryCardProps extends Category {}

const CategoryCard: React.FC<CategoryCardProps> = ({ id, name, image }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({
      to: CLIENT_CATEGORY_DETAILS.replace(":id", String(id)),
      search: { categoryName: name },
    });
  };

  return (
    <div
      onClick={handleClick}
      className="
        group 
        cursor-pointer 
        border border-gray-300 rounded-lg 
        p-4 sm:p-6 md:p-8 
        flex flex-col items-center justify-center 
        transition-transform transform hover:-translate-y-1 hover:shadow-lg
        bg-white mx-2
      "
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="
            mb-4 
            w-12 h-12 
            sm:w-16 sm:h-16 
            md:w-20 md:h-20
            object-contain
            group-hover:opacity-90
          "
        />
      ) : (
        <IoPhonePortraitOutline
          className="
            mb-4 
            text-gray-500 
            text-3xl 
            sm:text-4xl 
            md:text-5xl
            group-hover:text-rose-500
            transition-colors
          "
        />
      )}
      <span
        className="
        text-gray-800 
        text-sm sm:text-base md:text-lg 
        text-center 
        group-hover:text-rose-500
        transition-colors
      "
      >
        {name}
      </span>
    </div>
  );
};

export default CategoryCard;
