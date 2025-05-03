import React, { useState } from "react";
import { Link, useMatch, useNavigate } from "react-location";
// import { IoStar } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { GrPowerCycle } from "react-icons/gr";
import { motion } from "framer-motion";
import { LocationGenerics } from "@/router/location";
import { BASE_URL, CONFIRM_ORDER } from "@/constants";
import { useGetServicesQuery } from "@/redux/features/services/servicesApi";

const ServiceDetails = () => {
  const { params } = useMatch<LocationGenerics>();
  const { data: services, isLoading, isError } = useGetServicesQuery();

  const service = services?.find((service) => service.id === Number(params.id));

  console.log("params", params);

  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    `${BASE_URL}${service?.image}`
  );

  const handleImageClick = (imageSrc: string | undefined) => {
    setSelectedImage(imageSrc);
  };

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }
  if (isError) {
    return <div className="text-center">Error loading service details</div>;
  }
  if (!service) {
    return <div className="text-center">Service not found</div>;
  }

  return (
    <main className="max-w-[80rem] mx-5 md:mx-5 lg:mx-auto slide-up">
      {/* Breadcrum */}
      <div className="mt-6 flex flex-row items-center  space-x-2 text-gray-400">
        <p className="text-base md:text-lg">Home</p>
        <span className="text-base md:text-lg">/</span>
        <p
          className="text-base md:text-lg cursor-pointer"
          onClick={() => navigate({ to: "/services" })}
        >
          Service
        </p>
        <span className="text-base md:text-lg">/</span>
        <p className="text-black text-xl md:text-xl">Service Detail</p>
      </div>

      <div className="w-full md:h-[600px] mt-8 flex gap-8 md:flex-row flex-col">
        {/* Side Images */}
        <div className="md:w-[170px] md:flex md:flex-col  hidden  justify-between md:gap-4">
          <motion.div
            className="w-full aspect-square overflow-hidden rounded-lg  bg-gray-100 flex justify-center items-center cursor-pointer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.9, rotate: -3 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => handleImageClick(`${BASE_URL}${service?.image}`)}
          >
            <img
              src={`${BASE_URL}${service?.image}`}
              alt={`product-${service?.id}`}
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>
        </div>

        {/* Main Image */}
        <motion.div
          className="flex-1 aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center"
          key={selectedImage}
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <img
            src={`${BASE_URL}${service?.image}`}
            alt="main-product"
            className="max-w-full max-h-full object-contain"
          />
        </motion.div>
        <div className="md:flex-1 px-14 flex flex-col w-full justify-between">
          <div className="pb-10 border-b border-black ">
            <h2 className="font-semibold md:text-2xl text-lg mb-2">
              {service?.name}
            </h2>
            {/* <div className="flex items-center space-x-3 my-2">
              <div className="flex items-center space-x-1.5">
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <IoStar
                    key={index}
                    className={`size-5  ${
                      index === 4 ? "text-gray-400 " : "text-[#FFAD33]"
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="font-medium text-base text-gray-400 ">
                (150 Reviews)
              </p>
            </div> */}
            <h4 className="md:text-2xl text-xl mb-4">${service?.price} </h4>
            <p className="text-sm max-w-[373px]">{service?.description}</p>
          </div>
          <div className="">
            <div className="flex justify-between items-center ">
              <div className="flex-1 ">
                <button
                  onClick={() => navigate({ to: CONFIRM_ORDER })}
                  className="w-full h-11 flex justify-center items-center bg-[#DB4444] text-white rounded-md"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
          <div className="border border-[#1C1B1F] rounded md:mt-0 mt-5">
            <div className="flex items-center gap-5 border-b border-[#1C1B1F] py-5 px-4">
              <TbTruckDelivery className="size-10 text-black" />
              <div className="">
                <h2 className=" font-medium text-base">
                  FREE AND FAST SERVICE DELIVERY
                </h2>
                <p className="text-sm underline">
                  Enter your postal code for Delivery Availability
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5 py-5 px-4">
              <GrPowerCycle className="size-10 text-black" />
              <div className="">
                <h2 className=" font-medium text-base">Return Delivery</h2>
                <p className="text-sm ">
                  Free 30 Days Delivery Returns.{" "}
                  <Link to={"#"} className="underline">
                    Details
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <h1 className="font-semibold text-2xl mb-2">Related Services</h1>
        <div className="flex items-center gap-4"></div>
      </section>
    </main>
  );
};

export default ServiceDetails;
