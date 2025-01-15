import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faMagnifyingGlass,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  return (
    <div className="bg-white h-[10vh] fixed shadow-lg  w-full">
      <div className="flex justify-between items-center max-w-[80rem] pl-4 m-auto">
        {/* Logo text */}
        <h1 className="font-bold text-2xl">Exclusive</h1>
        {/* nav items */}
        <nav>
          <ul className="flex p-4 space-x-4 text-sm md:text-[1rem]">
            <li className=" p-2">Home</li>
            <li className=" p-2">Contact</li>
            <li className=" p-2">About</li>
            <li className=" p-2">Sign Up</li>
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
        </div>
      </div>
    </div>
  );
};

export default Header;
