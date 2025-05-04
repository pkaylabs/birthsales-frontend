import React from "react";
import { GrFavorite } from "react-icons/gr";
import { LuEye } from "react-icons/lu";
import { motion } from "framer-motion";
import { IoStar } from "react-icons/io5";
import { useNavigate } from "react-location";
import { Product } from "@/redux/type";
import { BASE_URL } from "@/constants";
import { useAppDispatch } from "@/redux";
import { addToCart } from "@/redux/features/cart/cartSlice";
import { toast } from "react-toastify";

interface ProductCardProps {
  product: Product;
  /** Navigate to detail view */
  onView?: (id: number) => void;
  /** Add to favorites */
  onFavorite?: (id: number) => void;
  /** Add to cart */
  onAddToCart?: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onFavorite,
  onAddToCart,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    id,
    name,
    image,
    price,
    original_price,
    discount_percent,
    rating,
    reviews_count,
  } = product;
  const handleView = (id: number) => {
    navigate({ to: `/product-details/${id}` });
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      return onAddToCart(Number(id));
    }
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`Added "${product.name}" to cart`)
  };

  return (
    <div className="flex-shrink-0 flex-1 px-2 box-border mobile:px-2 tablet:px-4 desktop:px-6">
      <motion.div className="relative w-full h-64 bg-gray-100 rounded-md p-4 overflow-hidden group mobile:h-40 mobile:p-2 tablet:h-56 tablet:p-3 desktop:h-64 desktop:p-4">
        {discount_percent && (
          <div className="absolute top-3 left-3 bg-[#DB4444] text-white rounded-full px-2 py-1 text-xs font-medium mobile:top-2 mobile:left-2 tablet:top-2 tablet:left-2 desktop:top-3 desktop:left-3">
            {discount_percent}% OFF
          </div>
        )}

        <div className="absolute right-3 top-4 mobile:right-2 mobile:top-2">
          <button
            onClick={() => onFavorite?.(Number(id))}
            className="w-9 h-9 rounded-full bg-white flex justify-center items-center cursor-pointer mb-2 shadow-sm mobile:w-6 mobile:h-6 mobile:mb-1 tablet:w-8 tablet:h-8 desktop:w-9 desktop:h-9"
          >
            <GrFavorite
              className="size-5 mobile:size-3 tablet:size-4 desktop:size-5"
              aria-hidden="true"
            />
          </button>
          <button
            onClick={() => handleView(Number(id))}
            className="w-9 h-9 rounded-full bg-white flex justify-center items-center cursor-pointer shadow-sm mobile:w-6 mobile:h-6 tablet:w-8 tablet:h-8 desktop:w-9 desktop:h-9"
          >
            <LuEye
              className="size-5 mobile:size-3 tablet:size-4 desktop:size-5"
              aria-hidden="true"
            />
          </button>
        </div>

        {/* <div className="w-full flex justify-center items-center mobile:h-full">
          <div className="w-full h-36 mobile:w-24 mobile:h-20 tablet:w-32 tablet:h-28 desktop:w-44 desktop:h-36">
            <img
              src={`${BASE_URL}${image}`}
              alt={`${name}`}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        </div> */}
        <div className="w-full h-full flex justify-center items-center">
          <div className="w-44 h-60 mobile:w-20 mobile:h-20 tablet:w-28 tablet:h-28 desktop:w-36 desktop:h-36 flex items-center justify-center">
            <img
              src={`${BASE_URL}${image}`}
              alt={name}
              className="max-w-full max-h-full object-contain"
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
          onClick={handleAddToCart}
        >
          <p className="font-medium text-white text-base mobile:text-[12px] tablet:text-sm desktop:text-base">
            Add To Cart
          </p>
        </motion.button>
      </motion.div>

      <div className="mt-3 mobile:mt-2">
        <h4 className="font-medium text-base text-black mobile:text-[12px] tablet:text-sm desktop:text-base">
          {name}
        </h4>
        <p className="font-medium text-base text-gray-400 mobile:text-[12px] tablet:text-sm desktop:text-base">
          <span className="text-[#DB4444] mr-3">${price}</span>
          {original_price && (
            <span className="line-through text-sm text-gray-500">
              ${original_price}
            </span>
          )}
        </p>

        <div className="flex items-center space-x-4 mt-2 mobile:space-x-2 mobile:mt-1 tablet:space-x-3">
          <div className="flex items-center space-x-1.5 mobile:space-x-1 tablet:space-x-1.5">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <IoStar
                key={index}
                className={`size-5 mobile:size-3 tablet:size-4 desktop:size-5  ${
                  index < Math.round(rating!)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="font-medium text-base text-gray-400 mobile:text-[12px] tablet:text-sm desktop:text-base">
            ({reviews_count})
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
