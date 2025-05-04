import { BASE_URL, CHECKOUT } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/redux";
import {
  clearCart,
  removeFromCart,
  updateQuantity,
} from "@/redux/features/cart/cartSlice";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-location";
import { toast } from "react-toastify";

const CartPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector((s) => s.cart.items);

  const handleRemove = (productId: number) => {
    dispatch(removeFromCart(productId));
    toast.success("Removed item from cart");
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
    toast.info(`Quantity updated to ${quantity}`);
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success("Removed all items from cart");
  };

  const subTotal = items.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  );

  return (
    <div className="max-w-[80rem] mx-auto p-4 slide-up">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-gray-400 mb-4">
        <p className="cursor-pointer" onClick={() => navigate({ to: "/" })}>
          Home
        </p>
        <span>/</span>
        <p className="text-black font-semibold">Cart</p>
      </div>

      {/* make table scrollable on xs */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-separate border-spacing-y-8">
          <thead>
            <tr className="rounded-md shadow-md text-base md:text-lg">
              <th className="p-6 text-start">Product</th>
              <th className="p-6 text-end">Price</th>
              <th className="p-6 text-center">Quantity</th>
              <th className="p-6 text-end">Subtotal</th>
              <th className="p-6 text-center">Remove</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ product, quantity }) => (
              <tr
                key={product.id}
                className="rounded-md shadow-md text-[12px] md:text-base"
              >
                <td className="p-6 text-start">
                  <div className="flex items-center gap-2">
                    <img
                      src={`${BASE_URL}${product.image}`}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-full hidden md:block"
                    />
                    <span>{product.name}</span>
                  </div>
                </td>
                <td className="p-6 text-end">GHC{Math.round(product.price)}</td>
                <td className="p-6 text-center">
                  <div className="inline-flex items-center border border-gray-400 rounded-md overflow-hidden">
                    <button
                      onClick={() =>
                        handleQuantityChange(Number(product.id), quantity - 1)
                      }
                      className="px-2 py-1 hover:bg-gray-200 disabled:opacity-50"
                      disabled={quantity === 0}
                    >
                      –
                    </button>
                    <span className="px-4">{quantity}</span>
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
                <td className="p-6 text-end">
                  GHC{Math.round(product.price * quantity)}
                </td>
                <td className="p-6 text-center">
                  <button
                    className="p-2 rounded-full hover:bg-red-100 focus:outline-none"
                    aria-label="Remove from cart"
                    onClick={() => handleRemove(Number(product.id))}
                  >
                    <FaTrash className="text-red-600" size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center">
                  Your cart is empty.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row justify-between mt-6 gap-4">
        <button
          className="w-32 h-10 rounded-md border border-gray-400 hover:bg-black hover:text-white transition"
          onClick={() => navigate({ to: "/" })}
        >
          Return to Shop
        </button>
        <button
          className="w-32 h-10 rounded-md border border-gray-400 hover:bg-black hover:text-white transition"
          onClick={handleClearCart}
        >
          Clear Cart
        </button>
      </div>

      {/* Totals */}
      <div className="mt-8 flex flex-col md:flex-row justify-between gap-6">
        {/* Coupon */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Coupon Code"
            className="w-32 md:w-48 h-10 rounded-md border border-gray-500 px-3"
          />
          <button className="bg-[#DB4444] text-white h-10 w-32 md:w-48 rounded-md hover:opacity-80 transition">
            Apply Coupon
          </button>
        </div>

        {/* Summary Box */}
        <div className="w-full md:w-[470px] border-2 border-gray-600 rounded-md p-5 flex flex-col gap-4">
          <h2 className="font-medium text-lg">Cart Total</h2>
          <div className="flex justify-between text-base">
            <span>Subtotal:</span>
            <span>GHC{Math.round(subTotal)}</span>
          </div>
          <div className="border-t border-gray-300" />
          <div className="flex justify-between text-base">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="border-t border-gray-300" />
          <div className="flex justify-between text-base font-semibold">
            <span>Total:</span>
            <span>GHC{Math.round(subTotal)}</span>
          </div>
          <button
            className="bg-[#DB4444] text-white py-2 rounded-md hover:opacity-80 transition"
            onClick={() =>
              navigate({ to: CHECKOUT, search: { total: subTotal } })
            }
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
