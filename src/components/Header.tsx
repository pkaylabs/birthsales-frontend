import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faMagnifyingGlass,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaCircleUser } from "react-icons/fa6";
import { RiUser3Line } from "react-icons/ri";
import { FiShoppingBag } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import { IoIosStarOutline } from "react-icons/io";
import { BiLogOut } from "react-icons/bi";
import { Link } from "react-location";
import { CONTACT, HOME, SIGN_UP } from "@/constants";

const dropdownTabs = [
  {
    title: "Manage My Account",
    link: "#",
    icon: RiUser3Line,
  },
  {
    title: "My Order",
    link: "#",
    icon: FiShoppingBag,
  },
  {
    title: "My Cancellations",
    link: "#",
    icon: MdOutlineCancel,
  },
  {
    title: "My Reviews",
    link: "#",
    icon: IoIosStarOutline,
  },
  {
    title: "Logout",
    link: "#",
    icon: BiLogOut,
  },
];

const Header = () => {
  return (
    <div className=" bg-white h-[10vh] fixed shadow-sm  w-full z-50">
      <div className="flex justify-between items-center max-w-[80rem] pl-4 m-auto">
        {/* Logo text */}
        <h1 className="font-bold text-2xl">Exclusive</h1>
        {/* nav items */}
        <nav>
          <ul className="flex p-4 space-x-4 text-sm md:text-[1rem]">
            <Link to={HOME} className=" p-2">
              Home
            </Link>
            <Link to={CONTACT} className=" p-2">
              Contact
            </Link>
            <li className=" p-2">About</li>
            <Link to={SIGN_UP} className=" p-2">
              Sign Up
            </Link>
          </ul>
        </nav>
        {/* search input, wishlist and cart */}
        <div className="flex space-x-4 items-center">
          <div className="bg-gray-100">
            <input
              className="bg-gray-100 text-sm p-2 outline-none border-none"
              type="text"
              placeholder="what are you looking for?"
            />
            <button className="bg-gray-100 p-2 text-sm font-normal">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
          <button>
            <FontAwesomeIcon icon={faHeart} />
          </button>
          <button>
            <FontAwesomeIcon icon={faShoppingCart} />
          </button>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <MenuButton className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 focus:outline-hidden">
                <span className="sr-only">Open options</span>
                <FaCircleUser
                  aria-hidden="true"
                  className="size-8 text-[#DB4444] "
                />
              </MenuButton>
            </div>

            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-black/30 ring-1 shadow-lg ring-black/5 backdrop-blur-md transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <div className="py-1">
                {dropdownTabs.map((tab, index) => (
                  <MenuItem key={index}>
                    <Link
                      to={tab.link}
                      className="flex items-center space-x-2.5 px-4 py-2 text-sm text-white data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden hover:bg-black/10"
                    >
                      <tab.icon className="size-6" />
                      <span className=" text-sm ">{tab.title}</span>
                    </Link>
                  </MenuItem>
                ))}
              </div>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Header;
