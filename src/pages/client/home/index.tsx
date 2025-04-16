
import React from "react";
import CardCarousel from "./components/cards-carousel";
import CategoryCard from "./components/cards/category";
import ProductCard from "./components/cards/product";
import Countdown from "./components/countdown";
import Dropdown from "./components/sidebar-dropdown";
import ResponsiveAside from "./components/responsive-aside";
import Carousel from "./components/swiper";
import BottomCards from "./components/bottom-cards";
import speaker from "@/assets/images/speaker.png";
import ps from "@/assets/images/ps5.png";
import woman from "@/assets/images/womanInHut.png";
import amazon from "@/assets/images/amazonSpeaker.png";
import pef from "@/assets/images/pef.png";

interface DropdownItem {
  title: string;
  to?: string;
  sublinks?: DropdownItem[];
}

const sidebarLinks: DropdownItem[] = [
  {
    title: "Woman’s Fashion",
    to: "/",
    sublinks: [
      { title: "Dresses", to: "/" },
      { title: "Tops", to: "/" },
      { title: "Bottoms", to: "/" },
      { title: "Jackets", to: "/" },
      { title: "Shoes", to: "/" },
      { title: "Bags", to: "/" },
      { title: "Accessories", to: "/" },
    ],
  },
  {
    title: "Men’s Fashion",
    to: "/about",
    sublinks: [
      { title: "Shirts", to: "/" },
      { title: "Trousers", to: "/" },
      { title: "Jackets", to: "/" },
      { title: "Shoes", to: "/" },
      { title: "Bags", to: "/" },
      { title: "Accessories", to: "/" },
    ],
  },
  { title: "Electronics", to: "/contact" },
  { title: "Home & Lifestyle", to: "/contact" },
  { title: "Medicine", to: "/contact" },
  { title: "Sports & Outdoor", to: "/contact" },
  { title: "Baby’s & Toys", to: "/contact" },
  { title: "Groceries & Pets", to: "/contact" },
  { title: "Health & Beauty", to: "/contact" },
];

const tilt = (
  <div className="h-[22.5rem] bg-black w-full flex justify-center items-center mobile:h-[10rem]">
    <h2 className="text-white text-center">
      We will change this text later please.
    </h2>
  </div>
);

export const productCards = [
  ProductCard,
  ProductCard,
  ProductCard,
  ProductCard,
  ProductCard,
];

const images = [tilt, tilt, tilt, tilt, tilt];

const catCards = [
  CategoryCard,
  CategoryCard,
  CategoryCard,
  CategoryCard,
  CategoryCard,
];

const Home = () => {
  return (
    <main className="w-full max-w-[80rem] mx-auto px-4 large-screen:px-8">
      {/* HEADER SECTION */}
      <header className="flex mobile:flex-col desktop-up:flex-row">
        {/* Off-canvas Sidebar Toggle – Visible on screens below desktop-up */}
        {/* <div className="desktop-up:hidden">
          <ResponsiveAside items={sidebarLinks} />
        </div> */}
        {/* Inline Sidebar – Visible on desktop-up (>=1201px) */}
        {/* <aside className="hidden desktop-up:block w-1/5 pr-4 border-r border-black">
          <Dropdown items={sidebarLinks} />
        </aside> */}
        {/* Main Carousel – full width on mobile; 4/5 width on desktop-up */}
        <div className="w-full desktop-up:w-full">
          <Carousel items={images} autoPlay={true} />
        </div>
      </header>

      {/* FLASH SALES SECTION */}
      <section className="my-12">
        <CardCarousel
          type="Today's"
          title="Flash Sales"
          showControls
          showCountdown
          items={productCards}
        />
        <div className="mt-6 flex justify-center">
          <button
            className="bg-[#DB4444] text-white rounded-md
                       w-32 h-8 text-[12px]
                       md:w-48 md:h-10
                       lg:w-64 lg:h-12
                       xl:w-72 xl:h-14 xl:text-lg"
          >
            View All Products
          </button>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="my-12">
        <CardCarousel
          type="Categories"
          title="Browse By Categories"
          showControls
          items={catCards}
        />
      </section>

      {/* BEST SELLING PRODUCTS SECTION */}
      <section className="my-12">
        <CardCarousel
          type="This Month"
          title="Best Selling Products"
          showViewAll
          items={productCards}
        />
      </section>

      {/* PROMOTIONAL BANNER SECTION */}
      <section className="my-12 p-8 large-screen:p-12 bg-black flex mobile:flex-col tablet:flex-row large-screen:flex-row items-center gap-6">
        <div className="flex-1 flex flex-col space-y-10 tablet:space-y-8 large-screen:space-y-10">
          <p className="text-[#00FF66] uppercase">Categories</p>
          <h1
            className="font-semibold text-white 
                       text-4xl leading-[55px]
                       md:text-3xl lg:text-5xl xl:text-6xl"
          >
            Enhance Your <br /> Music Experience
          </h1>
          <div className="mobile:hidden tablet:block large-screen:block">
            <Countdown showInCat endDateTime="2025-01-20T23:59:59" />
          </div>
          <button
            className="bg-[#00FF66] text-white font-medium rounded-md
                       mobile:w-20 mobile:h-8 mobile:text-[12px]
                       tablet:w-32 tablet:h-10
                       desktop:w-44 desktop:h-14
                       large-screen:w-48 large-screen:h-16"
          >
            Buy Now!
          </button>
        </div>
        <div className="flex-1">
          <img
            src={speaker}
            alt="speaker"
            className="object-contain w-full h-auto"
          />
        </div>
      </section>

      {/* OUR PRODUCTS SECTION */}
      <section className="my-12">
        <CardCarousel
          type="Our Products"
          title="Explore Our Products"
          showControls
          items={productCards}
        />
        <div className="mt-6 flex justify-center">
          <button
            className="bg-[#DB4444] text-white rounded-md
                       w-32 h-8 text-[12px]
                       md:w-48 md:h-10
                       lg:w-64 lg:h-12
                       xl:w-72 xl:h-14 xl:text-lg"
          >
            View All Products
          </button>
        </div>
      </section>

      {/* NEW ARRIVAL SECTION */}
      <section className="my-12">
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-[#DB4444] rounded-md w-3 h-8 md:w-5 md:h-10"></div>
            <p className="font-semibold text-[#DB4444] text-base md:text-xl">
              Featured
            </p>
          </div>
          <h2 className="font-semibold text-balck text-xl md:text-2xl lg:text-3xl xl:text-4xl">
            New Arrival
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
          {/* Featured Item – Hidden on mobile */}
          <div className="relative bg-black rounded overflow-hidden hidden md:block  md:h-[400px] xl:block xl:h-[500px]">
            <img src={ps} alt="ps-5" className="w-full h-full object-contain" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
              <h5 className="font-semibold text-2xl">PlayStation 5</h5>
              <p className="text-sm">
                Black and White version of the PS5 coming out on sale.
              </p>
              <button className="mt-2 border-b border-white">Shop Now</button>
            </div>
          </div>
          <div className="md:col-span-2 grid lg:grid-rows-2 gap-4">
            <div className="relative bg-gray-800 rounded overflow-hidden md:h-[400px] lg:h-[500px]">
              <img
                src={woman}
                alt="woman"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <h5 className="font-semibold text-2xl">Women's Collections</h5>
                <p className="text-sm">
                  Featured woman collections that give you another vibe.
                </p>
                <button className="mt-2 border-b border-white">Shop Now</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              <div className="relative bg-black rounded overflow-hidden md:h-[200px] lg:h-[250px]">
                <img
                  src={amazon}
                  alt="amazon speaker"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <h5 className="font-semibold text-2xl">Speakers</h5>
                  <p className="text-sm">Amazon wireless speakers</p>
                  <button className="mt-2 border-b border-white">
                    Shop Now
                  </button>
                </div>
              </div>
              <div className="relative bg-black rounded overflow-hidden md:h-[200px] lg:h-[250px]">
                <img
                  src={pef}
                  alt="pef"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <h5 className="font-semibold text-2xl">Perfume</h5>
                  <p className="text-sm">Gucci intense oud edp</p>
                  <button className="mt-2 border-b border-white">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CARDS SECTION */}
      <section className="my-8">
        <BottomCards />
      </section>
    </main>
  );
};

export default Home;
