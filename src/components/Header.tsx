
import React, { useState } from "react";
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import logo from "@/assets/images/logo.jpg";
import { Link } from "react-location";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center relative z-20">
      {/* Logo Section */}
      <div className="flex items-center">
        <img
          src={logo}
          alt="Logo"
          className="h-8 w-auto cursor-pointer rounded-md mr-3"
        />
        {/* On mobile, show only the logo. The text appears from tablet breakpoint onward */}
        <Link to="/" className="text-2xl font-bold text-gray-800 mobile:hidden tablet:flex desktop:flex large-screen:flex">
          BirthSales
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="tablet:hidden">
        <button
          className="text-gray-700 text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav
        className={`fixed inset-0 bg-white shadow-md transition-transform duration-300 ease-in-out transform ${
          menuOpen ? "translate-y-0" : "-translate-y-full"
        } tablet:static tablet:flex tablet:items-center tablet:space-x-6 tablet:translate-y-0 tablet:shadow-none`}
      >
        <div className="flex flex-col tablet:flex-row tablet:mt-0 mt-20 text-center">
          <Link
            to="/"
            className="block px-4 py-2 text-gray-700 hover:text-red-500"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/services"
            className="block px-4 py-2 text-gray-700 hover:text-red-500"
            onClick={() => setMenuOpen(false)}
          >
            Services
          </Link>
          <Link
            to="/about"
            className="block px-4 py-2 text-gray-700 hover:text-red-500"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/sign-up"
            className="block px-4 py-2 text-gray-700 hover:text-red-500"
            onClick={() => setMenuOpen(false)}
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Icons Section – visible from tablet breakpoint upward */}
      <div className="hidden tablet:flex items-center space-x-6">
        <Link to="/wish-list" className="relative">
          <FaHeart className="text-xl text-gray-700 hover:text-red-500" />
        </Link>
        <Link to="/cart" className="relative">
          <FaShoppingCart className="text-xl text-gray-700 hover:text-red-500" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            2
          </span>
        </Link>
        <Link to="/account" className="text-xl text-gray-700 hover:text-red-500">
          <FaUser />
        </Link>
      </div>
    </header>
  );
};

export default Header;

