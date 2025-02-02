import React, { useState } from "react";
import { Link, useMatch, useNavigate, useSearch } from "react-location";
import { IoStar } from "react-icons/io5";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { GrPowerCycle } from "react-icons/gr";
import { motion } from "framer-motion";
import { LocationGenerics } from "@/router/location";
import ServiceCard from "./components/ServiceCard";
import { CONFIRM_ORDER } from "@/constants";

const ServiceDetails = () => {
  const { params } = useMatch<LocationGenerics>();
 
  const navigate = useNavigate()

  const search = useSearch<any>();

  const [numberOfItems, setNumberOfItems] = useState(1);

  const [selectedImage, setSelectedImage] = useState<string>(search.img);

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const images = [
    {
      id: 1,
      src: search.img,
    },
    {
      id: 2,
      src: search.img,
    },
    {
      id: 3,
      src: search.img,
    },
    {
      id: 4,
      src: search.img,
    },
  ];


  return (
    <main className="w-full max-w-[80rem] mx-auto">
      <div className="mt-6 flex items-center space-x-3 text-gray-400">
        <p className="">Home</p> <span>/</span> <p className="">Service</p>{" "}
        <span>/</span> <p className="text-black">Service Detail</p>
      </div>

      <div className="w-full h-[600px] mt-8 flex gap-8">
        {/* Side Images */}
        <div className="w-[170px] flex flex-col justify-between gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="w-full h-[170px] bg-[#F5F5F5] rounded flex justify-center items-center cursor-pointer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.9, rotate: -3 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => handleImageClick(image.src)}
            >
              <img
                src={image.src}
                alt={`product-${index}`}
                className="w-32 h-28 object-contain"
              />
            </motion.div>
          ))}
        </div>

        {/* Main Image */}
        <motion.div
          className="w-[500px] bg-[#F5F5F5] rounded flex justify-center items-center"
          key={selectedImage}
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <img
            src={selectedImage}
            alt="main-product"
            className="w-[446px] h-[315px] object-contain"
          />
        </motion.div>
        <div className="flex-1 pl-14 flex flex-col justify-between">
          <div className="pb-10 border-b border-black ">
            <h2 className="font-semibold text-2xl mb-2">{search.title}</h2>
            <div className="flex items-center space-x-3 my-2">
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
              <span className="text-gray-400">|</span>
              <p className="font-medium text-base text-[#00FF66] ">In Stock</p>
            </div>
            <h4 className="text-2xl mb-4">
              ${search.startPrice} - ${search.endPrice}
            </h4>
            <p className="text-sm max-w-[373px]">{search.description}</p>
          </div>
          <div className="">
            <div className="flex justify-between items-center gap-6">
              <div className="flex-1">
                <button onClick={() => navigate({to: CONFIRM_ORDER})} className="w-full h-11 flex justify-center items-center bg-[#DB4444] text-white rounded-md">
                  Book Now
                </button>
              </div>
              <div className="w-10 h-11 flex items-center justify-center border border-black rounded cursor-pointer">
                <MdOutlineFavoriteBorder
                  className="size-6"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
          <div className="border border-[#1C1B1F] rounded ">
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
        <div className="flex justify-between items-center">
          <ServiceCard
            id={6}
            img={
              "https://s3-alpha-sig.figma.com/img/04a1/915f/d6cedd7c8b1073685c5f1be1b50e1ac6?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=EtgMC9jiFrs0EcWRDmVWwGT6gLVeThTBS~80pL1XCZYPuH-W71vSgj7sirtDajsg8NRNWEZyaDxq0xWcB8lA0uHgLzAclnfHNRbwRHFdzFkbNgfZGApPJy2VHl0ftm07LOa68Ulomu3etHonG864xn9TmuXMt1OhM3Ym2DjCn7VkISiwh4N7SXXjupIN3XcF~gMH~JWxzOTucGx-YFssWW4PiDqhxp0eDgEEJ1YvSnehX5sDpXyZYpEnB689udpVMNTfHyJJZLGWidT2zeo0KYloHKzBTQKnwr-AH0ZwXh6B5MJ33XFlWYwXX5zGxPtCxC4ui66ez0CcbCp6x08SrQ__"
            }
            title="Shirts"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={100}
            endPrice={600}
          />
          <ServiceCard
            id={7}
            img={
              "https://s3-alpha-sig.figma.com/img/e59d/9f34/8cc24eeff489863523b63971c3ff8e4a?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=FSE78Tz65VlRUa-zDh5rc5FzVbnlnot2ZPm4CpqwvLMcskCBZX0xYfv-9PsAv2n-NjX6Qe8IUh9hGtMtwkXpDGpzE25i6LQpOFx0dHwu~l5iTH1WnHQo3W9hJSEXqKtqJ~KQyqpOKGvJ32pTcQNLZuOfZiSW6adSC5YkodQs9243pOEohF6YyJdhQeqAIk36pv36de0o~A8QR1ATC5x644aj6SVMazXC7sSElN38avZc2cAq8yZ7bhiPyEVvL0MYpxEuiP9RpAsgyVnHisow9hXhnuL7YYMte6Bfnr1RfXlxZNVAxz9ROMQUeh~RbJHunSVDLFXBztmKZm9pL9ClgA__"
            }
            title="Keyboards"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={100}
            endPrice={600}
          />
          <ServiceCard
            id={7}
            img={
              "https://s3-alpha-sig.figma.com/img/e59d/9f34/8cc24eeff489863523b63971c3ff8e4a?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=FSE78Tz65VlRUa-zDh5rc5FzVbnlnot2ZPm4CpqwvLMcskCBZX0xYfv-9PsAv2n-NjX6Qe8IUh9hGtMtwkXpDGpzE25i6LQpOFx0dHwu~l5iTH1WnHQo3W9hJSEXqKtqJ~KQyqpOKGvJ32pTcQNLZuOfZiSW6adSC5YkodQs9243pOEohF6YyJdhQeqAIk36pv36de0o~A8QR1ATC5x644aj6SVMazXC7sSElN38avZc2cAq8yZ7bhiPyEVvL0MYpxEuiP9RpAsgyVnHisow9hXhnuL7YYMte6Bfnr1RfXlxZNVAxz9ROMQUeh~RbJHunSVDLFXBztmKZm9pL9ClgA__"
            }
            title="Keyboards"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={100}
            endPrice={600}
          />
          <ServiceCard
            id={7}
            img={
              "https://s3-alpha-sig.figma.com/img/e59d/9f34/8cc24eeff489863523b63971c3ff8e4a?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=FSE78Tz65VlRUa-zDh5rc5FzVbnlnot2ZPm4CpqwvLMcskCBZX0xYfv-9PsAv2n-NjX6Qe8IUh9hGtMtwkXpDGpzE25i6LQpOFx0dHwu~l5iTH1WnHQo3W9hJSEXqKtqJ~KQyqpOKGvJ32pTcQNLZuOfZiSW6adSC5YkodQs9243pOEohF6YyJdhQeqAIk36pv36de0o~A8QR1ATC5x644aj6SVMazXC7sSElN38avZc2cAq8yZ7bhiPyEVvL0MYpxEuiP9RpAsgyVnHisow9hXhnuL7YYMte6Bfnr1RfXlxZNVAxz9ROMQUeh~RbJHunSVDLFXBztmKZm9pL9ClgA__"
            }
            title="Keyboards"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={100}
            endPrice={600}
          />
        </div>
      </section>
    </main>
  );
};

export default ServiceDetails;
