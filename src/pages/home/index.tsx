import SwiperExample from "./components/custom-swiper";
import Dropdown from "./components/sidebar-dropdown";
import Carousel from "./components/swiper";

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

const images = [tilt, tilt, tilt, tilt, tilt];

const Home = () => {
  return (
    <main className="w-full max-w-[80rem] mx-auto ">
      <div className="w-full flex items-start">
        <div className="w-64 pt-5 pr-5 border-r-[0.5px] border-black ">
          <Dropdown items={sidebarLinks} />
        </div>
        <div className="w-full flex-1 pt-5 pl-5 ">
          <Carousel items={images} autoPlay={true} />
        </div>
      </div>

      <SwiperExample />
    </main>
  );
};

export default Home;
