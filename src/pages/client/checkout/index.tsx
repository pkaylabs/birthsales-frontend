import { CONFIRM_ORDER } from "@/constants";
import React, { useState } from "react";
import { useNavigate } from "react-location";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
}

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

    // {
    //   id: 3,
    //   name: "Game Pad",
    //   image:
    //     "https://s3-alpha-sig.figma.com/img/5d5c/2e52/50752d55f8b60f2aa2923183dadbc135?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=czfunfCbXPnzsf0N7ax9wZEEIArT-LrnrkTRpAfZfeMsnw6SGIR38TJfJpt7iq6QCDSH3PCph3ABqoKD3aIKXmk3IbyOyfhaG4KhYEpAOJpUEHZsIG9fp6WpOPHNJXgJYUPUsnX3M4K4F4-TJ2rTTYeCCiTB9IXuARkBk9HITOaf5K9yQD9Wj2Eqh~n4anc4jO7RwGa01307bybciV7jQZIjJdOBlAV7mmQ6aA9KTPVXGtH2uBOlgrYWlsYMOUAoL2NbxgJ2fEMB72wKWhG7YLC4coNmDBgLyFs7GS5-G51FiJt9C9dBvdVjSMC1b1bF28AE7ESynB1N5rKMR-wdZQ__",
    //   price: 230,
    // },
    // {
    //   id: 4,
    //   name: "Hisense TV",
    //   image:
    //     "https://s3-alpha-sig.figma.com/img/5e63/4682/db5174aff99bb9337d2dc9598a0b44e4?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RnZBP6XHKL1eWojlZdtQ34ovsdqdutd59ypgeygnMWW7ausWWKwH46NASbMA03eD1k3Wl-cj6P20Y76~2wxqwIyZVqrFjnNpCbdyxGGQ3j9LhkxMieqmWhHCSltl2K1nSeRSi-GUU12S7UCGS0A9DFvIUL5ARDcCiGkDwMmz8HPQ5K7oj6zG49Q46ukHtTdvoYG4Vw0GqXxKoPTLxk1n9sRLM-YVJ87fpFE7svXGpPptgn7mLF--Sn7E9I4F9ZrS6Da6d8c-oKXBTCPjrOtWJ5Iz5QTmIVjSXWtevkWRirfKtCkoGAuce53VqWTDAYwU-HFaIrab7Pue4aiS1KRnZQ__",
    //   price: 100,
    // },
  //   {
  //     id: 5,
  //     name: "Hisense TV",
  //     image:
  //       "https://s3-alpha-sig.figma.com/img/5e63/4682/db5174aff99bb9337d2dc9598a0b44e4?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RnZBP6XHKL1eWojlZdtQ34ovsdqdutd59ypgeygnMWW7ausWWKwH46NASbMA03eD1k3Wl-cj6P20Y76~2wxqwIyZVqrFjnNpCbdyxGGQ3j9LhkxMieqmWhHCSltl2K1nSeRSi-GUU12S7UCGS0A9DFvIUL5ARDcCiGkDwMmz8HPQ5K7oj6zG49Q46ukHtTdvoYG4Vw0GqXxKoPTLxk1n9sRLM-YVJ87fpFE7svXGpPptgn7mLF--Sn7E9I4F9ZrS6Da6d8c-oKXBTCPjrOtWJ5Iz5QTmIVjSXWtevkWRirfKtCkoGAuce53VqWTDAYwU-HFaIrab7Pue4aiS1KRnZQ__",
  //     price: 100,
  //   },
  //   {
  //     id: 6,
  //     name: "Hisense TV",
  //     image:
  //       "https://s3-alpha-sig.figma.com/img/5e63/4682/db5174aff99bb9337d2dc9598a0b44e4?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RnZBP6XHKL1eWojlZdtQ34ovsdqdutd59ypgeygnMWW7ausWWKwH46NASbMA03eD1k3Wl-cj6P20Y76~2wxqwIyZVqrFjnNpCbdyxGGQ3j9LhkxMieqmWhHCSltl2K1nSeRSi-GUU12S7UCGS0A9DFvIUL5ARDcCiGkDwMmz8HPQ5K7oj6zG49Q46ukHtTdvoYG4Vw0GqXxKoPTLxk1n9sRLM-YVJ87fpFE7svXGpPptgn7mLF--Sn7E9I4F9ZrS6Da6d8c-oKXBTCPjrOtWJ5Iz5QTmIVjSXWtevkWRirfKtCkoGAuce53VqWTDAYwU-HFaIrab7Pue4aiS1KRnZQ__",
  //     price: 100,
  //   },
  //   {
  //     id: 7,
  //     name: "Hisense TV",
  //     image:
  //       "https://s3-alpha-sig.figma.com/img/5e63/4682/db5174aff99bb9337d2dc9598a0b44e4?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RnZBP6XHKL1eWojlZdtQ34ovsdqdutd59ypgeygnMWW7ausWWKwH46NASbMA03eD1k3Wl-cj6P20Y76~2wxqwIyZVqrFjnNpCbdyxGGQ3j9LhkxMieqmWhHCSltl2K1nSeRSi-GUU12S7UCGS0A9DFvIUL5ARDcCiGkDwMmz8HPQ5K7oj6zG49Q46ukHtTdvoYG4Vw0GqXxKoPTLxk1n9sRLM-YVJ87fpFE7svXGpPptgn7mLF--Sn7E9I4F9ZrS6Da6d8c-oKXBTCPjrOtWJ5Iz5QTmIVjSXWtevkWRirfKtCkoGAuce53VqWTDAYwU-HFaIrab7Pue4aiS1KRnZQ__",
  //     price: 100,
  //   },
];

const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [network, setNetwork] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);

  const subTotal = products.reduce((sum, product) => {
    return sum + product.price;
  }, 0);

  return (
    <div className="max-w-[75rem] mx-auto slide-up  mb-[10rem]">
      {/* home / cart */}
      <div className="mt-6 flex items-center space-x-3 text-gray-400">
        <p>Account</p> <span>/</span> <p>My Account</p> <span>/</span>{" "}
        <p>Product</p> <span>/</span> <p>Cart</p> <span>/</span>{" "}
        <p className="text-black">Checkout</p>
      </div>
      {/* Payment and ordering */}
      <div className=" mt-[3rem] p-1 flex justify-between  gap-5 ">
        {/* Payment method */}
        <div className=" flex-1">
          <div className="flex flex-col justify-between gap-10">
            <h1 className="flex items-center text-2xl font-bold mb-1">
              PAYMENT METHOD
            </h1>
            {/* Radio buttons */}
            <div>
              <div className="flex items-center gap-5 mb-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  id="delivery"
                  value="onDelivery"
                  className="scale-150 accent-black"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="delivery" className="text-lg">
                  Pay on Delivery
                </label>
                <br />
              </div>
              <div className="flex items-center gap-5">
                <input
                  type="radio"
                  name="paymentMethod"
                  id="delivery"
                  value="mobileMoney"
                  className="scale-150 accent-black"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="delivery" className="text-lg">
                  Pay with Mobile Money
                </label>
                <br />
              </div>
            </div>
            {paymentMethod === "mobileMoney" && (
              <div className="flex flex-col gap-2">
                <h1 className="font-bold mb-2">ADD PAYMENT DETAILS</h1>
                <div className="">
                  <select
                    name="network"
                    id="network"
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                    className="border border-gray-300 rounded-md mr-4  p-2 bg-[#F5F5F5] w-1/2"
                  >
                    <option value="" disabled>
                      -- Select Network --
                    </option>
                    <option value="MTN">MTN</option>
                    <option value="Vodafone">Vodafone</option>
                    <option value="AirtelTigo">AirtelTigo</option>
                  </select>
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Enter Phone Number"
                    className=" border border-gray-300  rounded-md mr-4 p-2 bg-[#F5F5F5] w-1/2"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div className="mt-[2rem]">
                  <label className="flex items-center text-base">
                    <input
                      type="checkbox"
                      className="mr-2 accent-[#DB4444] scale-150"
                      checked={saveInfo}
                      onChange={(e) => setSaveInfo(e.target.checked)}
                    />
                    Save this information for faster checkout next time
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* ordering */}

        <div className="rounded p-5 flex flex-col justify-between gap-5 mt-[3rem] flex-1 ">
          <div className="flex flex-col justify-between gap-2  overflow-y-auto flex-shrink-0 max-h-[150px] pr-2">
            {products.map((product) => {
              return (
                <div className="flex justify-between items-center">
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
                  <p>${product.price}</p>
                </div>
              );
            })}
          </div>
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
              <p className="font-bold pulse mx-2">${subTotal}</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={() => navigate({ to: CONFIRM_ORDER })}
              className="w-full h-[48px] rounded  bg-[#DB4444] text-white shadow-md hover:shadow-gray-400"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
