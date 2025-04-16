import { CHECKOUT } from "@/constants";
import React, { useState } from "react";
import { useNavigate } from "react-location";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
}

const CartPage = () => {
  const navigate = useNavigate();
  const products: Product[] = [
    {
      id: 1,
      name: "LCD Monitor",
      image:
        "https://plus.unsplash.com/premium_photo-1681816189679-fa02d1acd1de?q=80&w=1777&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: 100,
    },
    {
      id: 2,
      name: "H1 GamePad",
      image:
        "https://images.unsplash.com/photo-1606318801954-d46d46d3360a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: 650,
    },
    {
      id: 3,
      name: "Hisense TV",
      image:
        "https://plus.unsplash.com/premium_photo-1682098177867-dfd0f0402428?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: 100,
    },
  ];

  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [shippingFee, setShippingFee] = useState(0);

  const handleChange = (id: number, value: string) => {
    if (Number(value) < 0) return;
    const quantity = parseInt(value, 10) || 0;
    setQuantities((prev) => ({
      ...prev,
      [id]: quantity,
    }));
  };

  const calculateTotal = (price: number, quantity: number): number =>
    price * quantity;

  const subTotal = products.reduce((sum, product) => {
    const quantity = quantities[product.id] || 0;
    return sum + calculateTotal(product.price, quantity);
  }, 0);

  return (
    <div className="max-w-[80rem] mx-5 md:mx-5 lg:mx-auto slide-up">
      {/* Breadcrum */}
      <div className="mt-6 flex flex-row items-center  space-x-2 text-gray-400">
        <p className="text-base md:text-lg">Home</p>
        <span className="text-base md:text-lg">/</span>
        <p className="text-black text-2xl md:text-xl">Cart</p>
      </div>
      {/* cart table */}
      <div className="w-full mt-[1rem]">
        {/* table */}
        <table className="w-full border-spacing-y-8 border-separate table-fixed">
          <tr className="rounded-md shadow-md text-base  md:text-lg">
            <th className="p-6 font-medium  text-start">Product</th>
            <th className="p-6 font-medium text-start">Price</th>
            <th className="p-6 font-medium text-start">Quantity</th>
            <th className="p-6 font-medium text-center">Subtotal</th>
          </tr>
          {products.map((product) => {
            const quantity = quantities[product.id] || 0;
            const total = calculateTotal(product.price, quantity);

            return (
              <tr
                key={product.id}
                className="rounded-md shadow-md font-normal text-[12px] md:text-base"
              >
                <td className="p-6  text-start">
                  <div className="flex items-center justify-start gap-2">
                    <img
                      src={product.image}
                      alt=""
                      className="hidden object-cover rounded-full w-10 h-10 md:block"
                    />
                    <p>{product.name}</p>
                  </div>
                </td>
                <td className="p-6 ">${product.price}</td>
                <td className="p-6">
                  <input
                    className="border-2 border-gray-400 w-[68px] h-[40px] rounded-md pl-3"
                    type="number"
                    placeholder="01"
                    value={quantity}
                    onChange={(e) => handleChange(product.id, e.target.value)}
                  />
                </td>
                <td className="p-6 text-center">${total}</td>
              </tr>
            );
          })}
        </table>
        <div className="flex justify-between gap-2">
          <button
            className=" w-32 h-8 text-[12px]
                       md:w-48 md:h-10
                       lg:w-64 lg:h-12
                       xl:w-72 xl:h-14 xl:text-lg rounded-md border border-gray-400 hover:bg-black hover:text-white"
          >
            Return To Shop
          </button>
          <button
            className=" w-32 h-8 text-[12px]
                       md:w-48 md:h-10
                       lg:w-64 lg:h-12
                       xl:w-72 xl:h-14 xl:text-lg rounded-md
                        border border-gray-400 hover:bg-black hover:text-white"
          >
            Update Cart
          </button>
        </div>
        <div className="flex flex-col gap-5 justify-between md:flex-row lg:flex-row mt-[5rem]">
          <div className="flex  gap-3">
            <input
              type="text"
              className="rounded-md text-[12px] border border-gray-500 w-32 px-5 h-8 outline-none md:w-48 md:h-10 lg:w-64 lg:h-12 xl:text-lg xl:h-14 xl:w-72"
              placeholder="Coupon Code"
            />
            <button
              className="  border bg-[#DB4444]  hover:opacity-75  text-white rounded-md
                       w-32 h-8 text-[12px]
                       md:w-48 md:h-10
                       lg:w-64 lg:h-12
                       xl:w-72 xl:h-14 xl:text-lg"
            >
              Apply Coupon
            </button>
          </div>
          <div className="w-full md:w-[470px] border-[1.5px] border-gray-600 rounded p-5 flex flex-col justify-between gap-5">
            <h1 className="font-medium text-base md:text-xl">Cart Total</h1>
            {/* subtotal */}
            <div className="flex flex-col justify-between gap-3">
              <div className="flex justify-between text-[12px] md:text-base">
                <p>Subtotal:</p>
                <p>${subTotal.toFixed(2)}</p>
              </div>
              <div className=" border border-gray-300" />
              <div className="flex justify-between text-[12px] md:text-base">
                <p>Shipping:</p>
                <p>Free</p>
              </div>
              <div className=" border border-gray-300" />
              <div className="flex justify-between text-[12px] md:text-base">
                <p>GrandTotal:</p>
                <p className="font-bold  pulse mx-2">
                  ${subTotal + shippingFee}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <button
                onClick={() =>
                  navigate({ to: CHECKOUT, search: { total: subTotal } })
                }
                className=" w-32 h-8 text-[12px]
                       md:w-48 md:h-10
                       lg:w-64 lg:h-12
                       xl:w-72 xl:h-14 xl:text-lg hover:opacity-75  rounded border bg-[#DB4444] text-white"
              >
                Proceed to checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
