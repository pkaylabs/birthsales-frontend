import React from "react";
import { useAppSelector, useAppDispatch } from "@/redux";
import { Link, useNavigate } from "react-location";
import { FiTrash2 } from "react-icons/fi";
import { removeFromWishlist } from "@/redux/features/wishlist/wishlistSlice";
import { resolveProductImageUrl } from "@/utils/resolve-image-url";

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.wishlist.items);

  const handleRemove = (productId: number) => {
    dispatch(removeFromWishlist(productId));
  };

  if (!items.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-xl text-gray-600">Your wishlist is empty.</p>
        <button
          onClick={() => navigate({ to: "/" })}
          className="mt-6 inline-block bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-gray-500 text-sm mb-6" aria-label="Breadcrumb">
        <ol className="list-reset flex">
          <li><Link to="/" className="hover:underline">Home</Link></li>
          <li><span className="mx-2">/</span></li>
          <li className="text-gray-900 font-semibold">Wishlist</li>
        </ol>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center sm:text-left">
        My Wishlist
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map(({ product }) => (
          <div
            key={product.id}
            className="flex flex-col bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
          >
            {/* product image */}
            <div className="bg-gray-100 h-48 flex items-center justify-center">
              <img
                src={resolveProductImageUrl(product)}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* product info */}
            <div className="flex-1 p-4 flex flex-col">
              <h2
                className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 cursor-pointer hover:text-red-600"
                onClick={() =>
                  navigate({ to: `/product-details/${product.id}` })
                }
              >
                {product.name}
              </h2>
              <p className="mt-auto text-red-600 font-bold">
                GHC{product.price}
              </p>
            </div>
            {/* remove button */}
            <div className="p-2 border-t border-gray-200">
              <button
                onClick={() => handleRemove(Number(product.id))}
                className="flex items-center justify-center w-full text-red-600 hover:text-red-800"
              >
                <FiTrash2 className="mr-2" /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
