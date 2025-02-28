import React, { useState } from "react";
import { FaShoppingCart, FaHeart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import logo from "@/assets/images/logo.jpg";
import { Link } from "react-location";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md relative">
      {/* Mobile & Tablet Header: visible only on screens below 1201px */}
      <div className="block desktop-up:hidden">
        <div className="flex items-center justify-between py-4 px-6">
          <img
            src={logo}
            alt="Logo"
            className="h-8 w-auto cursor-pointer rounded-md"
          />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 text-2xl focus:outline-none"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        {menuOpen && (
          <nav className="flex flex-col items-center space-y-4 py-4 border-t border-gray-200">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="text-xl text-gray-700 hover:text-red-500"
            >
              Home
            </Link>
            <Link
              to="/services"
              onClick={() => setMenuOpen(false)}
              className="text-xl text-gray-700 hover:text-red-500"
            >
              Services
            </Link>
            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="text-xl text-gray-700 hover:text-red-500"
            >
              About
            </Link>
            <Link
              to="/sign-up"
              onClick={() => setMenuOpen(false)}
              className="text-xl text-gray-700 hover:text-red-500"
            >
              Sign Up
            </Link>
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="text-xl text-gray-700 hover:text-red-500"
            >
              Cart
            </Link>
            <Link
              to="/wish-list"
              onClick={() => setMenuOpen(false)}
              className="text-xl text-gray-700 hover:text-red-500"
            >
              Wishlist
            </Link>
          </nav>
        )}
      </div>

      {/* Desktop & Larger Header: visible only on screens 1201px and up */}
      <div className="hidden desktop-up:flex items-center justify-between py-4 px-6">
        <div className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className="h-8 w-auto cursor-pointer rounded-md mr-3"
          />
          <Link to="/" className="text-2xl font-bold text-gray-800">
            BirthSales
          </Link>
        </div>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-red-500 text-lg">
            Home
          </Link>
          <Link to="/services" className="text-gray-700 hover:text-red-500 text-lg">
            Services
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-red-500 text-lg">
            About
          </Link>
          <Link to="/sign-up" className="text-gray-700 hover:text-red-500 text-lg">
            Sign Up
          </Link>
        </nav>
        <div className="flex items-center space-x-6">
          <Link to="/wish-list">
            <FaHeart className="text-xl text-gray-700 hover:text-red-500" />
          </Link>
          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-xl text-gray-700 hover:text-red-500" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              2
            </span>
          </Link>
          <Link to="/account">
            <FaUser className="text-xl text-gray-700 hover:text-red-500" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

