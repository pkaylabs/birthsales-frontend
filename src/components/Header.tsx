import React, { useState } from "react";
import { FaShoppingCart, FaHeart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/images/logo.jpg";
import { Link } from "react-location";
import { SIGN_UP_ROLE } from "@/constants";

const menuVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: 'auto', opacity: 1, transition: { duration: 0.3 } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.2 } },
};

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md fixed w-full z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Title */}
          <div className="flex items-center">
            <Link to="/">
              <motion.img
                src={logo}
                alt="Logo"
                className="h-10 w-auto rounded-md cursor-pointer"
                whileHover={{ scale: 1.1 }}
              />
            </Link>
            <Link to="/" className="ml-3 text-2xl font-bold text-gray-800 hover:text-rose-500 transition">
              BirthNon
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {['/', '/services', '/about', SIGN_UP_ROLE].map((path, idx) => (
              <Link
                key={idx}
                to={path}
                className="text-gray-700 hover:text-rose-500 transition"
              >
                {path === '/' ? 'Home' : path.replace('/', '').charAt(0).toUpperCase() + path.slice(2)}
              </Link>
            ))}
          </nav>

          {/* Icons + Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <Link to="/wish-list" className="hidden md:block">
              <FaHeart className="text-xl text-gray-700 hover:text-rose-500 transition" />
            </Link>
            <Link to="/cart" className="hidden md:block relative">
              <FaShoppingCart className="text-xl text-gray-700 hover:text-rose-500 transition" />
              <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                2
              </span>
            </Link>
            <Link to="/account" className="hidden md:block">
              <FaUser className="text-xl text-gray-700 hover:text-rose-500 transition" />
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 md:hidden focus:outline-none"
            >
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            className="md:hidden bg-white overflow-hidden shadow-inner"
          >
            <div className="px-4 pt-4 pb-2 space-y-2">
              {['Home', 'Services', 'About', 'Sign Up', 'Cart', 'Wishlist'].map((label, i) => {
                const to = label === 'Home' ? '/' : `/${label.toLowerCase().replace(' ', '-')}`;
                return (
                  <Link
                    key={i}
                    to={to === '/sign up' ? SIGN_UP_ROLE : to}
                    onClick={() => setMenuOpen(false)}
                    className="block text-lg text-gray-700 hover:text-rose-500 transition py-2"
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

