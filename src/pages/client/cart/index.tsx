import { CHECKOUT } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/redux";
import {
  clearCart,
  removeFromCart,
  updateQuantity,
} from "@/redux/features/cart/cartSlice";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-location";
import { toast } from "react-toastify";
import { resolveProductImageUrl } from "@/utils/resolve-image-url";

const CartPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector((s) => s.cart.items);

  const handleRemove = (productId: number) => {
    dispatch(removeFromCart(productId));
    toast.success("Removed item from cart");
  };

  const handleQuantityChange = (productId: number, qty: number) => {
    if (qty < 0) return;
    dispatch(updateQuantity({ productId, quantity: qty }));
    toast.info(`Quantity updated to ${qty}`);
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success("Cleared cart");
  };

  const subTotal = items.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Breadcrumb */}
      <nav className="text-gray-500 text-sm flex flex-wrap gap-1 mb-4">
        <span
          className="hover:underline cursor-pointer"
          onClick={() => navigate({ to: "/" })}
        >
          Home
        </span>
        <span>/</span>
        <span className="font-semibold">Cart</span>
      </nav>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-separate border-spacing-y-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-right hidden sm:table-cell">Price</th>
              <th className="p-3 text-center">Quantity</th>
              <th className="p-3 text-right">Subtotal</th>
              <th className="p-3 text-center">Remove</th>
            </tr>
          </thead>
          <tbody>
            {items.length ? items.map(({ product, quantity }) => (
              <tr key={product.id} className="even:bg-gray-50">
                <td className="p-3 flex items-center gap-2">
                  <img
                    src={resolveProductImageUrl(product)}
                    alt={product.name}
                    className="w-10 h-10 rounded-full object-cover hidden sm:block"
                  />
                  <span>{product.name}</span>
                </td>
                <td className="p-3 text-right hidden sm:table-cell">
                  GHC{Math.round(product.price)}
                </td>
                <td className="p-3 text-center">
                  <div className="inline-flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() =>
                        handleQuantityChange(Number(product.id), quantity - 1)
                      }
                      disabled={quantity === 0}
                      className="px-2 py-1 hover:bg-gray-200 disabled:opacity-50"
                    >
                      −
                    </button>
                    <span className="px-3">{quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(Number(product.id), quantity + 1)
                      }
                      className="px-2 py-1 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="p-3 text-right">
                  GHC{Math.round(product.price * quantity)}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleRemove(Number(product.id))}
                    aria-label={`Remove ${product.name} from cart`}
                    type="button"
                    className="p-1 rounded-full hover:bg-red-100"
                  >
                    <FaTrash className="text-red-600" />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  Your cart is empty.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={() => navigate({ to: "/" })}
          className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-800 hover:text-white transition"
        >
          Return to Shop
        </button>
        <button
          onClick={handleClearCart}
          className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-800 hover:text-white transition"
        >
          Clear Cart
        </button>
      </div>

      {/* Totals & Checkout */}
      <div className="mt-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="w-full lg:w-1/2 border-2 border-gray-300 rounded p-4">
          <h3 className="font-semibold mb-3">Cart Total</h3>
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>GHC{Math.round(subTotal)}</span>
          </div>
          <div className="border-t border-gray-300 my-2" />
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>GHC{Math.round(subTotal)}</span>
          </div>
        </div>
        <button
          onClick={() => navigate({ to: CHECKOUT, search: { total: subTotal } })}
          disabled={!items.length}
          className={`w-full lg:w-1/3 py-2 rounded text-white ${
            items.length
              ? "bg-[#DB4444] hover:bg-[#c33]"
              : "bg-gray-400 cursor-not-allowed"
          } transition`}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;

