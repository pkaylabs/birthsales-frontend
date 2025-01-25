import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-12 w-full">
      <div className="flex flex-col gap-10">
        <div className="flex justify-around">
          {/* exclusive part */}
          <div className="flex flex-col justify-between">
            <h1 className="font-bold text-2xl text-white">Exclusive</h1>
            <p className="font-medium text-xl">Subscribe</p>
            <p className="font-normal text-base">
              Get 10% off your first order
            </p>
          </div>
          {/* address part */}
          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-xl text-white">Support</h1>
            <p className="font-normal text-base">Accra, Ghana</p>
            <p className="font-normal text-base">Email@gmail.com</p>
            <p className="font-normal text-base">0044744444</p>
          </div>
          {/* Account  */}
          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-xl text-white">Account</h1>
            <p className="font-normal text-base">My Account</p>
            <p className="font-normal text-base">Login / Register</p>
            <p className="font-normal text-base">Cart</p>
            <p className="font-normal text-base">WishList</p>
          </div>
          {/* Quick Links */}
          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-xl text-white">Quick Link</h1>
            <p className="font-normal text-base">Privacy Policy</p>
            <p className="font-normal text-base">Terms of Use</p>
            <p className="font-normal text-base">Contact</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <div className="w-full border border-gray-700"/>
          <div className="text-gray-500 font-normal text-base">Copyright pkay 2025. All right reserved</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
