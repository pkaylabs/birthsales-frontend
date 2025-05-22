import React from "react";
import { BsTelephone } from "react-icons/bs";
import { GoMail } from "react-icons/go";

const Contact = () => {
  return (
    <main className="w-full max-w-[80rem] mx-auto slide-up">
      <div className="mt-6 flex items-center space-x-3 text-gray-400">
        <p className="">Home</p> <span>/</span>{" "}
        <p className="text-black">Contact</p>
      </div>

      <section className="mt-16 flex justify-between space-x-10">
        <div className="w-[25rem] shadow-lg rounded px-5 py-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full flex justify-center items-center bg-[#DB4444] ">
              <BsTelephone className="text-white size-5" aria-hidden="true" />
            </div>
            <p className="font-medium text-base text-black">Call To Us</p>
          </div>
          <p className="font-medium text-base text-black mt-4">
            We are available 24/7, 7 days a week.
          </p>
          <p className="font-medium text-base text-black mt-5 pb-8 border-b border-black ">
            Phone: +233592331108
          </p>

          <div className="flex items-center gap-4 mt-8">
            <div className="w-10 h-10 rounded-full flex justify-center items-center bg-[#DB4444] ">
              <GoMail className="text-white size-5" aria-hidden="true" />
            </div>
            <p className="font-medium text-base text-black">Write To US</p>
          </div>
          <p className="font-medium text-base text-[#1C1B1F] mt-5">
            Fill out our form and we will contact you within 24 hours.
          </p>
          <p className="font-medium text-base text-[#1C1B1F] mt-5  ">
            Emails: birthnon@gmail.com
          </p>
        </div>
        <div className="flex-1 flex flex-col justify-between shadow-lg rounded px-5 py-12">
          <div className="flex justify-between items-center gap-4">
            <input
              type="text"
              className="rounded h-12 bg-[#F5F5F5] px-4 flex-1"
              placeholder="Your Name"
            />
            <input
              type="email"
              className="rounded h-12 bg-[#F5F5F5] px-4 flex-1"
              placeholder="Your Email"
            />
            <input
              type="tel"
              className="rounded h-12 bg-[#F5F5F5] px-4 flex-1"
              placeholder="Your Phone"
            />
          </div>
          <textarea
            className="rounded h-52 bg-[#F5F5F5] py-2 px-4 w-full mt-4"
            placeholder="Your Message"
          ></textarea>
          <div className="flex justify-end">
            <button className="font-medium bg-[#DB4444] text-white w-52 h-14 flex justify-center items-center rounded mt-4">
              Send Message
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
