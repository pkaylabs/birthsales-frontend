import React from "react";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";
import { Link } from "react-location";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="w-full max-w-[80rem] mx-auto px-4">
        {/* Responsive grid: 1 column on mobile, 2 on tablet, 4 on desktop/large-screen */}
        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 large-screen:grid-cols-4 gap-8 ">
          {/* Company Info */}
          <div className="mobile:hidden">
            <h3 className="text-white text-lg font-semibold mb-4">
              BirthSales
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Information
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div className="">
            <h3 className="text-white text-lg font-semibold mb-4">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              <Link
                to="https://facebook.com"
                className="hover:text-white transition"
              >
                <FiFacebook size={20} />
              </Link>
              <Link
                to="https://twitter.com"
                className="hover:text-white transition"
              >
                <FiTwitter size={20} />
              </Link>
              <Link
                to="https://instagram.com"
                className="hover:text-white transition"
              >
                <FiInstagram size={20} />
              </Link>
              <Link
                to="https://linkedin.com"
                className="hover:text-white transition mobile:hidden"
              >
                <FiLinkedin size={20} />
              </Link>
            </div>
            <div className="mt-4">
              <h4 className="text-white font-semibold mb-2">
                Subscribe to our Newsletter
              </h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-2 rounded-l-md focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#DB4444] p-2 rounded-r-md hover:bg-red-600 transition"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} BirthSales site. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
