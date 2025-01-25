import React, { useState } from "react";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
}

const CartPage = () => {
  const products: Product[] = [
    {
      id: 1,
      name: "LCD Monitor",
      image:
        "https://s3-alpha-sig.figma.com/img/5e63/4682/db5174aff99bb9337d2dc9598a0b44e4?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RnZBP6XHKL1eWojlZdtQ34ovsdqdutd59ypgeygnMWW7ausWWKwH46NASbMA03eD1k3Wl-cj6P20Y76~2wxqwIyZVqrFjnNpCbdyxGGQ3j9LhkxMieqmWhHCSltl2K1nSeRSi-GUU12S7UCGS0A9DFvIUL5ARDcCiGkDwMmz8HPQ5K7oj6zG49Q46ukHtTdvoYG4Vw0GqXxKoPTLxk1n9sRLM-YVJ87fpFE7svXGpPptgn7mLF--Sn7E9I4F9ZrS6Da6d8c-oKXBTCPjrOtWJ5Iz5QTmIVjSXWtevkWRirfKtCkoGAuce53VqWTDAYwU-HFaIrab7Pue4aiS1KRnZQ__",
      price: 100,
    },
    {
      id: 2,
      name: "H1 GamePad",
      image:
        "https://s3-alpha-sig.figma.com/img/5d5c/2e52/50752d55f8b60f2aa2923183dadbc135?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=czfunfCbXPnzsf0N7ax9wZEEIArT-LrnrkTRpAfZfeMsnw6SGIR38TJfJpt7iq6QCDSH3PCph3ABqoKD3aIKXmk3IbyOyfhaG4KhYEpAOJpUEHZsIG9fp6WpOPHNJXgJYUPUsnX3M4K4F4-TJ2rTTYeCCiTB9IXuARkBk9HITOaf5K9yQD9Wj2Eqh~n4anc4jO7RwGa01307bybciV7jQZIjJdOBlAV7mmQ6aA9KTPVXGtH2uBOlgrYWlsYMOUAoL2NbxgJ2fEMB72wKWhG7YLC4coNmDBgLyFs7GS5-G51FiJt9C9dBvdVjSMC1b1bF28AE7ESynB1N5rKMR-wdZQ__",
      price: 650,
    },
    {
      id: 3,
      name: "Game Pad",
      image:
        "https://s3-alpha-sig.figma.com/img/5d5c/2e52/50752d55f8b60f2aa2923183dadbc135?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=czfunfCbXPnzsf0N7ax9wZEEIArT-LrnrkTRpAfZfeMsnw6SGIR38TJfJpt7iq6QCDSH3PCph3ABqoKD3aIKXmk3IbyOyfhaG4KhYEpAOJpUEHZsIG9fp6WpOPHNJXgJYUPUsnX3M4K4F4-TJ2rTTYeCCiTB9IXuARkBk9HITOaf5K9yQD9Wj2Eqh~n4anc4jO7RwGa01307bybciV7jQZIjJdOBlAV7mmQ6aA9KTPVXGtH2uBOlgrYWlsYMOUAoL2NbxgJ2fEMB72wKWhG7YLC4coNmDBgLyFs7GS5-G51FiJt9C9dBvdVjSMC1b1bF28AE7ESynB1N5rKMR-wdZQ__",
      price: 230,
    },
    {
      id: 4,
      name: "Hisense TV",
      image:
        "https://s3-alpha-sig.figma.com/img/5e63/4682/db5174aff99bb9337d2dc9598a0b44e4?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RnZBP6XHKL1eWojlZdtQ34ovsdqdutd59ypgeygnMWW7ausWWKwH46NASbMA03eD1k3Wl-cj6P20Y76~2wxqwIyZVqrFjnNpCbdyxGGQ3j9LhkxMieqmWhHCSltl2K1nSeRSi-GUU12S7UCGS0A9DFvIUL5ARDcCiGkDwMmz8HPQ5K7oj6zG49Q46ukHtTdvoYG4Vw0GqXxKoPTLxk1n9sRLM-YVJ87fpFE7svXGpPptgn7mLF--Sn7E9I4F9ZrS6Da6d8c-oKXBTCPjrOtWJ5Iz5QTmIVjSXWtevkWRirfKtCkoGAuce53VqWTDAYwU-HFaIrab7Pue4aiS1KRnZQ__",
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
    <div className="max-w-[80rem] mx-auto">
      {/* home / cart */}
      <div className="mt-6 flex items-center space-x-3 text-gray-400">
        <p>Home</p> <span>/</span> <p className="text-black">Cart</p>
      </div>
      {/* cart table */}
      <div className="w-full mt-[3rem] ">
        {/* table */}
        <table className="w-full border-spacing-y-8 border-separate table-fixed">
          <tr className="rounded-md shadow-md  text-lg">
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
                className="rounded-md shadow-md font-normal text-base "
              >
                <td className="p-6  text-start">
                  <div className="flex items-center justify-start gap-2 ">
                    <img
                      src={product.image}
                      alt=""
                      width={"50px"}
                      height={"39px"}
                      className="object-contain"
                    />
                    <p>{product.name}</p>
                  </div>
                </td>
                <td className="p-6 ">{product.price}</td>
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
        <div className=" flex justify-between">
          <button className="w-[200px] h-[48px] rounded border border-gray-400">
            Return To Shop
          </button>
          <button className="w-[200px] h-[48px] rounded border border-gray-400">
            Update Cart
          </button>
        </div>
        <div className="flex justify-between mt-[5rem]">
          <div className="flex  gap-3">
            <input
              type="text"
              className="rounded-md text-base border border-gray-500 w-[250px] px-5 h-[48px] outline-none"
              placeholder="Coupon Code"
            />
            <button className="w-[200px] h-[48px] rounded border bg-[#DB4444] text-white">
              Apply Coupon
            </button>
          </div>
          <div className="w-[470px] border-[1.5px] border-gray-600 rounded p-5 flex flex-col justify-between gap-5">
            <h1 className="font-medium text-xl">Cart Total</h1>
            {/* subtotal */}
            <div className="flex flex-col justify-between gap-3">
              <div className="flex justify-between">
                <p>Subtotal:</p>
                <p>${subTotal}</p>
              </div>
              <div className=" border border-gray-300" />
              <div className="flex justify-between">
                <p>Shipping:</p>
                <p>Free</p>
              </div>
              <div className=" border border-gray-300" />
              <div className="flex justify-between">
                <p>GrandTotal:</p>
                <p>${subTotal + shippingFee}</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <button className="w-[200px] h-[48px] rounded border bg-[#DB4444] text-white">
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
