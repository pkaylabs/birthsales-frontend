import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-9">
      <div className="lg:px-10 ">
        <hr className="h-px my-6 lg:mx-auto bg-zinc-600 border-none" />
        <div className="flex flex-wrap lg:flex-nowrap ">
          <div className=" w-full lg:w-1/4 lg:pr-6 mb-6 lg:mb-0 text-center lg:text-left">
            <div className="pl-4 lg:pl-10">
              <h1 className="text-white pt-5">EXCLUSIVE </h1>
              <h2
                className="text-white mt-2
              "
              >
                Subscribe{" "}
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Get 10% off your first order
              </p>
            </div>
          </div>

          <div className="w-full lg:flex-1 lg:pt-5">
            <div className="grid grid-cols-1 gap-6 text-center md:ml-[7rem] sm:ml-[10rem] lg:ml-0 sm:text-left sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8 lg:mt-0">
              <div>
                <h2 className="text-white font-bold">Support</h2>
                <p className="block mt-2 text-sm hover:text-white hover:underline">
                  111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.
                </p>
                <p>exclusive@gmail.com</p>
                <p className="block mt-2 text-sm hover:text-white hover:underline">
                  +88015-88888-9999
                </p>
              </div>

              <div>
                <h3 className="text-white font-bold">Account</h3>
                <p className="block mt-2 text-sm hover:text-white">
                  My Account
                </p>
                <p className="block mt-2 text-sm hover:text-white hover:underline">
                  Login/ Register
                </p>
                <p className="block mt-2 text-sm hover:text-white">Cart</p>
                <p className="block mt-2 text-sm hover:text-white">WishList</p>
                <p className="block mt-2 text-sm hover:text-white">Shop</p>
              </div>

              <div>
                <h3 className="text-white font-bold">Quick Link</h3>
                <p className="block mt-2 text-sm hover:text-white hover:underline">
                  Privacy Policy
                </p>
                <p className="block mt-2 text-sm hover:text-white hover:underline">
                  Terms Of Use
                </p>
                <p className="block mt-2 text-sm hover:text-white hover:underline">
                  FAQ
                </p>
                <p className="block mt-2 text-sm hover:text-white hover:underline">
                  Contact
                </p>
              </div>

              {/* <div>
                <h3 className="text-white font-bold uppercase">Download App</h3>
                <span className="block mt-2 text-sm hover:text-white">
                  +917249498769
                </span>
                <span className="block mt-2 text-sm hover:text-white">
                  amolsasane001@gmail.com
                </span>
              </div> */}
            </div>
          </div>
        </div>

        <hr className="h-px my-6 bg-zinc-600 border-none" />

        <div>
          <p className="text-center text-gray-400 text-sm lg:text-base">
            © Copyright Rimel 2022. All right reserved{" "}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
