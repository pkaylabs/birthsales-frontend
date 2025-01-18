import CardCarousel from "./components/cards-carousel";
import CategoryCard from "./components/cards/category";
import ProductCard from "./components/cards/product";
import Countdown from "./components/countdown";
import SwiperExample from "./components/custom-swiper";
import Dropdown from "./components/sidebar-dropdown";
import Carousel from "./components/swiper";
import speaker from "@/assets/images/speaker.png";

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
        <aside className="w-64 pt-5 pr-5 border-r-[0.5px] border-black ">
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
        <div className="flex items-center space-x-3">
          <div className="w-5 h-10 bg-[#DB4444] rounded-md " />
          <p className="font-semibold text-base text-[#DB4444] ">Featured</p>
        </div>
      </section>
    </main>
  );
};

export default Home;
