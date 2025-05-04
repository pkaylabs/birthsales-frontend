import React, { useEffect, useState } from "react";
import { Link, useMatch, useNavigate } from "react-location";
import { IoStar } from "react-icons/io5";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { GrPowerCycle } from "react-icons/gr";
import { motion } from "framer-motion";
import { useGetProductQuery } from "@/redux/features/products/productsApi";
import { Box, CircularProgress } from "@mui/material";
import { BASE_URL, CHECKOUT } from "@/constants";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { params } = useMatch();
  const prodId = Number(params.id);

  const { data: product, isLoading, isError } = useGetProductQuery(prodId);

  console.log("Product Details", product);

  const [gallery, setGallery] = useState<string[]>([]);
  // const [selectedSize, setSelectedSize] = useState<string | null>(null);
  // const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  // const sizes = product?.available_sizes ?? [];
  // const colors = product?.available_colors ?? [];

  useEffect(() => {
    if (!product) return;
    const imgs: string[] = Array.isArray(product.image)
      ? product.image
      : product.image
      ? [product.image]
      : [];
    setGallery(imgs);
    if (imgs.length) setSelectedImage(imgs[0]);
  }, [product]);

  // const images = [
  //   {
  //     id: 1,
  //     src: pad1,
  //   },
  //   {
  //     id: 2,
  //     src: pad2,
  //   },
  //   {
  //     id: 3,
  //     src: pad3,
  //   },
  //   {
  //     id: 4,
  //     src: pad4,
  //   },
  // ];

  // const sizes = [
  //   { name: "XS", value: "XS" },
  //   { name: "S", value: "S" },
  //   { name: "M", value: "M" },
  //   { name: "L", value: "L" },
  //   { name: "XL", value: "XL" },
  // ];

  // const colors = [
  //   { name: "bg-[#A0BCE0]", value: "#A0BCE0" },
  //   { name: "bg-[#E07575]", value: "#E07575" },
  // ];

  if (isLoading) {
    return (
      <Box className="p-8 flex justify-center">
        <CircularProgress />
      </Box>
    );
  }
  if (isError || !product) {
    return (
      <Box className="p-8 text-red-500">Unable to load product #{prodId}.</Box>
    );
  }

  return (
    <main className="w-full max-w-[80rem] mx-auto">
      <div className="mt-6 flex items-center space-x-3 text-gray-400">
        <p className="">Account</p> <span>/</span> <p className="">Category</p>{" "}
        <span>/</span> <p className="text-black">Product Name</p>
      </div>

      <div className="w-full md:h-[600px] mt-8 flex md:flex-row flex-col gap-8 items-center md:items-stretch">
        {/* Side Images */}
        <div className="md:w-[170px] md:flex md:flex-col w-full  hidden  justify-between gap-4">
          {gallery.map((image, index) => (
            <motion.div
              key={index}
              className="w-full h-full bg-[#F5F5F5] rounded flex justify-center items-center cursor-pointer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.9, rotate: -3 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={`${BASE_URL}${product.image}`}
                alt={`product-${index}`}
                className="w-full h-full object-cover rounded"
              />
            </motion.div>
          ))}
        </div>

        {/* Main Image */}
        <motion.div
          className="md:w-[500px] w-[270px] bg-[#F5F5F5] rounded flex justify-center items-center"
          key={selectedImage}
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <img
            src={`${BASE_URL}${product.image}`}
            alt={product.name}
            className="md:w-[446px] md:h-[315px] md:object-contain w-[250px]"
          />
        </motion.div>
        <div className="flex-1 px-14 flex flex-col justify-between ">
          <div className="pb-6 border-b border-black ">
            <h2 className="font-semibold md:text-2xl text-lg mb-2">
              {product.name}
            </h2>
            <div className="flex items-center space-x-3 my-2">
              <div className="flex items-center space-x-1.5">
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <IoStar
                    key={index}
                    className={`md:size-5 size-3  ${
                      index === 4 ? "text-gray-400 " : "text-[#FFAD33]"
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="font-medium text-base text-gray-400 ">
                ({product.reviews_count ?? 0}Reviews)
              </p>
              <span className="text-gray-400">|</span>
              <p className="font-medium text-base text-[#00FF66] ">
                {product.in_stock ? "In Stock" : "Out of Stock"}
              </p>
            </div>
            <h4 className="md:text-2xl text-xl mb-4">GHC{product.price}</h4>
            <p className="text-sm max-w-[373px]">
              {product.description ?? "No description available."}
            </p>
          </div>
          <div className="">
            {/* <div className="flex items-center gap-4 mb-5">
              <p className="md:text-xl text-lg">Color:</p>
              <ColorSelector options={colors} onSelect={setSelectedColor} />
            </div> */}
            {/* <div className="flex items-center gap-4 mb-5">
              <p className="md:text-xl text-lg">Size:</p>
              <SizePicker options={sizes} onSelect={setSelectedSize} />
            </div> */}
            <div className="flex md:flex-row justify-between items-center flex-col gap-6">
              <div className="flex-1 flex items-center select-none w-full">
                <div
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="w-10 h-11 flex justify-center items-center border border-black rounded-s text-2xl hover:bg-[#DB4444] hover:text-white hover:border-[#DB4444] transition-all duration-150 ease-in-out cursor-pointer"
                >
                  -
                </div>
                <div className="flex-1 h-11 flex justify-center items-center border-y border-black md:text-xl text-lg">
                  {quantity}
                </div>
                <div
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-11 flex justify-center items-center border border-black rounded-e text-2xl hover:bg-[#DB4444] hover:text-white hover:border-[#DB4444] transition-all duration-150 ease-in-out cursor-pointer"
                >
                  +
                </div>
              </div>
              <div className="flex-1 w-full">
                <button
                  className="w-full h-11 flex justify-center items-center bg-[#DB4444] text-white rounded-md"
                  onClick={() => {
                    navigate({ to: CHECKOUT });
                  }} // Add your add to cart logic here
                >
                  Buy Now
                </button>
              </div>
              <div className="w-10 h-11 md:flex items-center justify-center border border-black rounded cursor-pointer hidden">
                <MdOutlineFavoriteBorder
                  className="size-6"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
          <div className="border border-[#1C1B1F] rounded md:mt-0 mt-5">
            <div className="flex items-center gap-5 border-b border-[#1C1B1F] py-5 px-4">
              <TbTruckDelivery className="size-10 text-black" />
              <div className="">
                <h2 className=" font-medium md:text-base text-sm">
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
                <h2 className=" font-medium md:text-base text-sm">
                  Return Delivery
                </h2>
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

      {/* <section className="mt-20">
        <CardCarousel
          type="Related Item"
          itemsPerView={4}
          title=""
          items={productCards}
        />
      </section> */}
    </main>
  );
};

export default ProductDetails;
