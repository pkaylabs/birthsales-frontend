import React from "react";
import { GrFavorite } from "react-icons/gr";
import { LuEye } from "react-icons/lu";
import { motion } from "framer-motion";
import { IoStar } from "react-icons/io5";
import { useNavigate } from "react-location";
import { Product } from "@/redux/type";
import { useAppDispatch } from "@/redux";
import { addToCart } from "@/redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { addToWishlist } from "@/redux/features/wishlist/wishlistSlice";
import { resolveProductImageUrl } from "@/utils/resolve-image-url";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    id,
    name,
    price,
    original_price,
    rating,
    reviews_count,
    vendor_name,
  } = product;

  const imageSrc = resolveProductImageUrl(product);

  const handleView = () => {
    navigate({ to: `/product-details/${id}` });
  };

  const handleAddToCart = () => {
    const hasColors =
      Array.isArray(product.available_colors) &&
      product.available_colors.some((c) => (c ?? "").trim().length > 0);
    const hasSizes =
      Array.isArray(product.available_sizes) &&
      product.available_sizes.some((s) => (s ?? "").trim().length > 0);

    if (hasColors || hasSizes) {
      toast.info("Please select options before adding to cart");
      navigate({ to: `/product-details/${id}` });
      return;
    }

    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`Added “${name}” to cart`);
  };

  const handleAddToWishlist = () => {
    dispatch(addToWishlist(product));
    toast.success(`Added “${name}” to wishlist`);
  };

  return (
    <div className="px-5 sm:px-3 flex-shrink-0 w-full">
      <motion.div className="relative rounded-lg overflow-hidden sm:h-56 md:h-64 lg:h-64 h-72 group border-2 border-gray-100">
        <div className="absolute top-2 right-2 flex space-x-1 sm:space-x-2">
          <button
            onClick={handleAddToWishlist}
            aria-label={`Add ${name} to wishlist`}
            type="button"
            className="
              bg-white p-1 sm:p-2 rounded-full shadow
              hover:bg-gray-200 transition
            "
          >
            <GrFavorite className="text-lg sm:text-xl" />
          </button>
          <button
            onClick={handleView}
            aria-label={`View details for ${name}`}
            type="button"
            className="
              bg-white p-1 sm:p-2 rounded-full shadow
              hover:bg-gray-200 transition
            "
          >
            <LuEye className="text-lg sm:text-xl" />
          </button>
        </div>

        {/* Image */}

        <div className="flex items-center justify-center w-full h-full">
          <img
            src={imageSrc}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Add to Cart on hover */}
        <motion.button
          onClick={handleAddToCart}
          initial={{ y: "100%", opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          animate={{ y: "100%", opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="
            absolute bottom-0 left-0 w-full bg-black text-white
            py-3 sm:py-2 lg:py-3
            text-sm sm:text-base md:text-lg
            hidden group-hover:flex items-center justify-center
          "
        >
          Add to Cart
        </motion.button>
      </motion.div>

      {/* Info */}
      <div className="mt-2">
        <h4 className="font-medium text-base sm:text-lg md:text-xl text-gray-800">
          {name}
        </h4>
        <p className="mt-1">
          <span className="text-red-600 font-semibold text-base sm:text-lg">
            GHC{price}
          </span>
          {original_price && (
            <span className="ml-2 line-through text-gray-500 text-sm sm:text-base">
              GHC{original_price}
            </span>
          )}
        </p>
        <h4 className="font-medium text-base sm:text-lg md:text-xl text-gray-500">
          {vendor_name}
        </h4>
        <div className="mt-2 flex items-center space-x-2">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, idx) => (
              <IoStar
                key={idx}
                className={`text-sm sm:text-base md:text-lg ${
                  idx < Math.round(rating || 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-gray-600 text-sm sm:text-base">
            ({reviews_count ?? 0})
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
