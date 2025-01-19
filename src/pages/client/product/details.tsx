import React, { useState } from "react";
import { Link, useSearch } from "react-location";
import mainPad from "@/assets/images/main-pad.png";
import pad1 from "@/assets/images/pad1.png";
import pad2 from "@/assets/images/pad2.png";
import pad3 from "@/assets/images/pad3.png";
import pad4 from "@/assets/images/pad4.png";
import { IoStar } from "react-icons/io5";
import SizePicker from "./components/size-picker";
import ColorSelector from "./components/colors-selector";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { GrPowerCycle } from "react-icons/gr";
import { motion } from "framer-motion";
import CardCarousel from "../home/components/cards-carousel";
import { productCards } from "../home";

const ProductDetails = () => {
  const search = useSearch<any>();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const [numberOfItems, setNumberOfItems] = useState(1);

  const [selectedImage, setSelectedImage] = useState<string>(mainPad);

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const images = [
    {
      id: 1,
      src: pad1,
    },
    {
      id: 2,
      src: pad2,
    },
    {
      id: 3,
      src: pad3,
    },
    {
      id: 4,
      src: pad4,
    },
  ];

  const sizes = [
    { name: "XS", value: "XS" },
    { name: "S", value: "S" },
    { name: "M", value: "M" },
    { name: "L", value: "L" },
    { name: "XL", value: "XL" },
  ];

  const colors = [
    { name: "bg-[#A0BCE0]", value: "#A0BCE0" },
    { name: "bg-[#E07575]", value: "#E07575" },
  ];

  return (
    <main className="w-full max-w-[80rem] mx-auto">
      <div className="mt-6 flex items-center space-x-3 text-gray-400">
        <p className="">Account</p> <span>/</span> <p className="">Category</p>{" "}
        <span>/</span> <p className="text-black">Product Name</p>
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
          <div className="pb-6 border-b border-black ">
            <h2 className="font-semibold text-2xl mb-2">
              Havic HV G-92 Gamepad
            </h2>
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
            <h4 className="text-2xl mb-4">$192.00</h4>
            <p className="text-sm max-w-[373px]">
              PlayStation 5 Controller Skin High quality vinyl with air channel
              adhesive for easy bubble free install & mess free removal Pressure
              sensitive.
            </p>
          </div>
          <div className="">
            <div className="flex items-center gap-4 mb-5">
              <p className="text-xl">Color:</p>
              <ColorSelector options={colors} onSelect={setSelectedColor} />
            </div>
            <div className="flex items-center gap-4 mb-5">
              <p className="text-xl">Size:</p>
              <SizePicker options={sizes} onSelect={setSelectedSize} />
            </div>
            <div className="flex justify-between items-center gap-6">
              <div className="flex-1 flex items-center select-none">
                <div
                  onClick={() =>
                    numberOfItems > 1 && setNumberOfItems(numberOfItems - 1)
                  }
                  className="w-10 h-11 flex justify-center items-center border border-black rounded-s text-2xl hover:bg-[#DB4444] hover:text-white hover:border-[#DB4444] transition-all duration-150 ease-in-out cursor-pointer"
                >
                  -
                </div>
                <div className="flex-1 h-11 flex justify-center items-center border-y border-black text-xl">
                  {numberOfItems}
                </div>
                <div
                  onClick={() => setNumberOfItems(numberOfItems + 1)}
                  className="w-10 h-11 flex justify-center items-center border border-black rounded-e text-2xl hover:bg-[#DB4444] hover:text-white hover:border-[#DB4444] transition-all duration-150 ease-in-out cursor-pointer"
                >
                  +
                </div>
              </div>
              <div className="flex-1">
                <button className="w-full h-11 flex justify-center items-center bg-[#DB4444] text-white rounded-md">
                  Buy Now
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
                  FREE AND FAST DELIVERY
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
        <CardCarousel
          type="Related Item"
          itemsPerView={4}
          title=""
          items={productCards}
        />
      </section>
    </main>
  );
};

export default ProductDetails;
