import React from "react";
import CardCarousel from "./components/cards-carousel";
import CategoryCard from "./components/cards/category";
import ProductCard from "./components/cards/product";
import Countdown from "./components/countdown";
import Dropdown from "./components/sidebar-dropdown";
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
      {/* Header Section */}
      <header className="flex flex-col desktop:flex-row large-screen:flex-row items-start gap-4 py-4">
        {/* Sidebar (visible on tablet, desktop, and large-screen) */}
        <aside className="hidden mobile:hidden tablet:block desktop:block large-screen:block tablet:w-1/4 large-screen:w-1/5 pr-4 border-r border-black">
          <Dropdown items={sidebarLinks} />
        </aside>
        {/* Main Carousel */}
        <div className="w-full desktop:w-3/4 large-screen:w-4/5">
          <Carousel items={images} autoPlay={true} />
        </div>
      </header>

      {/* Flash Sales Section */}
      <section className="my-12">
        <CardCarousel
          type="Today's"
          title="Flash Sales"
          showControls
          showCountdown
          items={productCards}
        />
        <div className="mt-6 flex justify-center">
          <button className="w-64 h-12 mobile:w-32 mobile:h-8 mobile:text-[12px] tablet:w-48 tablet:h-10 desktop:w-64 desktop:h-12 large-screen:w-72 large-screen:h-14 large-screen:text-lg bg-[#DB4444] text-white rounded-md">
            View All Products
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="my-12">
        <CardCarousel
          type="Categories"
          title="Browse By Categories"
          showControls
          items={catCards}
        />
      </section>

      {/* Best Selling Products Section */}
      <section className="my-12">
        <CardCarousel
          type="This Month"
          title="Best Selling Products"
          showViewAll
          items={productCards}
        />
      </section>

      {/* Promotional Banner Section */}
      <section className="my-12 p-8 large-screen:p-12 bg-black flex flex-col tablet:flex-row large-screen:flex-row items-center gap-6">
        <div className="flex-1 flex flex-col space-y-10 tablet:space-y-8 large-screen:space-y-10">
          <p className="text-[#00FF66] uppercase">Categories</p>
          <h1 className="font-semibold text-5xl text-white leading-[55px] mobile:text-xl mobile:leading-[35px] tablet:text-3xl desktop:text-5xl large-screen:text-6xl">
            Enhance Your <br /> Music Experience
          </h1>
          <div className="mobile:hidden tablet:block large-screen:block">
            <Countdown showInCat endDateTime="2025-01-20T23:59:59" />
          </div>
          <button className="w-44 h-14 mobile:w-20 mobile:h-8 mobile:text-[12px] tablet:w-32 tablet:h-10 desktop:w-44 desktop:h-14 large-screen:w-48 large-screen:h-16 bg-[#00FF66] text-white font-medium rounded-md">
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

      {/* Our Products Section */}
      <section className="my-12">
        <CardCarousel
          type="Our Products"
          title="Explore Our Products"
          showControls
          items={productCards}
        />
        <div className="mt-6 flex justify-center">
          <button className="w-64 h-12 mobile:w-32 mobile:h-8 mobile:text-[12px] tablet:w-48 tablet:h-10 desktop:w-64 desktop:h-12 large-screen:w-72 large-screen:h-14 large-screen:text-lg bg-[#DB4444] text-white rounded-md">
            View All Products
          </button>
        </div>
      </section>

      {/* New Arrival Section */}
      <section className="my-12">
  <div className="mb-6">
    <div className="flex items-center space-x-3">
      <div className="w-5 h-10 bg-[#DB4444] rounded-md mobile:w-3 mobile:h-8"></div>
      <p className="font-semibold text-base text-[#DB4444] mobile:text-[12px]">
        Featured
      </p>
    </div>
    <h2 className="font-semibold text-4xl text-black mobile:text-xl large-screen:text-5xl">
      New Arrival
    </h2>
  </div>
  <div className="grid grid-cols-1 tablet:grid-cols-3 gap-4">
    {/* Featured Item (hidden on mobile) */}
    <div className="relative bg-black rounded overflow-hidden hidden mobile:hidden tablet:block large-screen:block tablet:h-[400px] large-screen:h-[500px]">
      <img src={ps} alt="ps-5" className="w-full h-full object-contain" />
      <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
        <h5 className="font-semibold text-2xl">PlayStation 5</h5>
        <p className="text-sm">
          Black and White version of the PS5 coming out on sale.
        </p>
        <button className="mt-2 border-b border-white">Shop Now</button>
      </div>
    </div>
    <div className="tablet:col-span-2 grid grid-rows-2 gap-4">
      <div className="relative bg-gray-800 rounded overflow-hidden tablet:h-[400px] large-screen:h-[500px]">
        <img src={woman} alt="woman" className="w-full h-full object-cover" />
        <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
          <h5 className="font-semibold text-2xl">Women's Collections</h5>
          <p className="text-sm">
            Featured woman collections that give you another vibe.
          </p>
          <button className="mt-2 border-b border-white">Shop Now</button>
        </div>
      </div>
      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
        <div className="relative bg-black rounded overflow-hidden tablet:h-[200px] large-screen:h-[250px]">
          <img src={amazon} alt="amazon speaker" className="w-full h-full object-contain" />
          <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
            <h5 className="font-semibold text-2xl">Speakers</h5>
            <p className="text-sm">Amazon wireless speakers</p>
            <button className="mt-2 border-b border-white">Shop Now</button>
          </div>
        </div>
        <div className="relative bg-black rounded overflow-hidden tablet:h-[200px] large-screen:h-[250px]">
          <img src={pef} alt="pef" className="w-full h-full object-contain" />
          <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
            <h5 className="font-semibold text-2xl">Perfume</h5>
            <p className="text-sm">GUCCI INTENSE OUD EDP</p>
            <button className="mt-2 border-b border-white">Shop Now</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Bottom Cards Section */}
      <section className="my-12">
        <BottomCards />
      </section>
    </main>
  );
};

export default Home;
