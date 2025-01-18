import CardCarousel from "./components/cards-carousel";
import CategoryCard from "./components/cards/category";
import ProductCard from "./components/cards/product";
import Countdown from "./components/countdown";
import SwiperExample from "./components/custom-swiper";
import Dropdown from "./components/sidebar-dropdown";
import Carousel from "./components/swiper";
import speaker from "@/assets/images/speaker.png";
import ps from "@/assets/images/ps5.png";
import woman from "@/assets/images/womanInHut.png";
import amazon from "@/assets/images/amazonSpeaker.png";
import pef from "@/assets/images/pef.png";
import BottomCards from "./components/bottom-cards";

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
      {
        title: "Dresses",
        to: "/",
      },
      {
        title: "Tops",
        to: "/",
      },
      {
        title: "Bottoms",
        to: "/",
      },
      {
        title: "Jackets",
        to: "/",
      },
      {
        title: "Shoes",
        to: "/",
      },
      {
        title: "Bags",
        to: "/",
      },
      {
        title: "Accessories",
        to: "/",
      },
    ],
  },
  {
    title: "Men’s Fashion",
    to: "/about",
    sublinks: [
      {
        title: "Shirts",
        to: "/",
      },
      {
        title: "Trousers",
        to: "/",
      },
      {
        title: "Jackets",
        to: "/",
      },
      {
        title: "Shoes",
        to: "/",
      },
      {
        title: "Bags",
        to: "/",
      },
      {
        title: "Accessories",
        to: "/",
      },
    ],
  },
  {
    title: "Electronics",
    to: "/contact",
  },
  {
    title: "Home & Lifestyle",
    to: "/contact",
  },
  {
    title: "Medicine",
    to: "/contact",
  },
  {
    title: "Sports & Outdoor",
    to: "/contact",
  },
  {
    title: "Baby’s & Toys",
    to: "/contact",
  },
  {
    title: "Groceries & Pets",
    to: "/contact",
  },
  {
    title: "Health & Beauty",
    to: "/contact",
  },
];

const tilt = (
  <div className="h-[22.5rem] bg-yellow-500 w-full flex justify-center items-center">
    <h2>rjkdfv</h2>
  </div>
);

const productCards = [
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
  CategoryCard,
  CategoryCard,
];

const Home = () => {
  return (
    <main className="w-full max-w-[80rem] mx-auto ">
      <header className="w-full flex items-start">
        <aside className="w-64 h-[23.7rem] pt-5 pr-5 border-r-[0.5px] border-black overflow-y-scroll">
          <Dropdown items={sidebarLinks} />
        </aside>
        <div className="w-full flex-1 pt-5 pl-5 ">
          <Carousel items={images} autoPlay={true} />
        </div>
      </header>

      {/* <SwiperExample /> */}
      <section className="mt-16">
        <CardCarousel
          type="Today's"
          itemsPerView={4}
          title="Flash Sales"
          showControls
          showCountdown
          items={productCards}
        />

        <div className="w-full flex justify-center items-center mt-12 pb-20 border-b-[0.5px] border-black ">
          <button className="font-medium w-64 h-12 flex justify-center items-center bg-[#DB4444] rounded-md text-white text-base">
            View All Products
          </button>
        </div>
      </section>

      <section className="mt-16 pb-20 border-b-[0.5px] border-black">
        <CardCarousel
          type="Categories"
          itemsPerView={6}
          title="Browse By Categories"
          showControls
          items={catCards}
        />
      </section>

      <section className="mt-16">
        <CardCarousel
          type="This Month"
          itemsPerView={4}
          title="Best Selling Products"
          showViewAll
          items={productCards}
        />
      </section>

      <section className="mt-16 p-8 bg-black flex justify-between items-center ">
        <div className="flex-1 flex flex-col space-y-10 justify-between">
          <p className="text-[#00FF66] ">Categories</p>
          <h1 className="font-semibold text-5xl text-white leading-[55px]">
            Enhance Your <br /> Music Experience
          </h1>

          <div className="">
            <Countdown showInCat endDateTime="2025-01-20T23:59:59" />
          </div>

          <button className="font-medium w-44 h-14 flex justify-center items-center bg-[#00FF66] rounded-md text-white text-base ">
            Buy Now!
          </button>
        </div>
        <div className="flex-1">
          <img src={speaker} alt="speaker" className="object-contain" />
        </div>
      </section>

      <section className="mt-16">
        <CardCarousel
          type="Our Products"
          itemsPerView={4}
          title="Explore Our Products"
          showControls
          items={productCards}
        />

        <div className="w-full flex justify-center items-center mt-12 ">
          <button className="font-medium w-64 h-12 flex justify-center items-center bg-[#DB4444] rounded-md text-white text-base">
            View All Products
          </button>
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-5 h-10 bg-[#DB4444] rounded-md " />
          <p className="font-semibold text-base text-[#DB4444] ">Featured</p>
        </div>
        <h2 className="font-semibold text-4xl text-balck ">New Arrival</h2>

        <div className="w-full h-[600px] mt-8 flex gap-8">
          <div className="relative flex-1 h-full bg-black flex items-end justify-center rounded overflow-hidden">
            <img
              src={ps}
              alt="ps-5"
              className="w-[511px] h-[511px] object-contain"
            />
            <div className="absolute z-10 inset-0 p-8 flex space-y-3.5 flex-col justify-end text-white">
              <h5 className="font-semibold text-2xl ">PlayStation 5</h5>
              <p className="text-sm max-w-60">
                Black and White version of the PS5 coming out on sale.
              </p>
              <button className="font-medium w-fit border-b border-white ">
                Shop Now
              </button>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-8 h-full">
            <div className="relative flex-1 flex justify-end bg-[#0D0D0D] rounded overflow-hidden">
              <img
                src={woman}
                alt="woman"
                className=" h-[286px] object-contain"
              />
              <div className="absolute z-10 inset-0 p-8 flex space-y-3.5 flex-col justify-end text-white">
                <h5 className="font-semibold text-2xl ">Women's Collections</h5>
                <p className="text-sm max-w-60">
                  Featured woman collections that give you another vibe.
                </p>
                <button className="font-medium w-fit border-b border-white ">
                  Shop Now
                </button>
              </div>
            </div>
            <div className="flex-1 flex gap-8 ">
              <div className="relative flex-1 flex justify-center items-center bg-black rounded overflow-hidden">
                <img
                  src={amazon}
                  alt="amazon speaker"
                  className="w-auto h-[221px] object-contain"
                />
                <div className="absolute z-10 inset-0 p-8 flex space-y-1 flex-col justify-end text-white">
                  <h5 className="font-semibold text-2xl ">Speakers</h5>
                  <p className="text-sm max-w-60">Amazon wireless speakers</p>
                  <button className="font-medium w-fit border-b border-white ">
                    Shop Now
                  </button>
                </div>
              </div>
              <div className="relative flex-1 flex justify-center items-center bg-black rounded overflow-hidden">
                <img
                  src={pef}
                  alt="pef"
                  className="w-auto h-[221px] object-contain"
                />
                <div className="absolute z-10 inset-0 p-8 flex space-y-1 flex-col justify-end text-white">
                  <h5 className="font-semibold text-2xl ">Perfume</h5>
                  <p className="text-sm max-w-60">GUCCI INTENSE OUD EDP</p>
                  <button className="font-medium w-fit border-b border-white ">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-24">
        <BottomCards />
      </section>
    </main>
  );
};

export default Home;
