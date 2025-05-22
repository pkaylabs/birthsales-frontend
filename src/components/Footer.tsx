import React from "react";
import { FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";
import { FaSnapchat, FaTiktok } from "react-icons/fa6";
import { Link } from "react-location";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="w-full max-w-[80rem] mx-auto px-4">
        {/* Mobile & Tablet Footer: visible on screens up to 1200px */}
        <div className="block desktop-up:hidden space-y-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">BirthNon</h3>
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
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Connect With Us
            </h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://www.facebook.com/share/1Aawp6gShp/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                <FiFacebook size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@birthnon?_t=ZM-8wZGJMDXoMY&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                <FaTiktok size={20} />
              </a>
              <a
                href="https://www.instagram.com/birth.non?igsh=ZHh2YmVxZ3lzZzR2&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                <FiInstagram size={20} />
              </a>
              <a
                href="https://www.snapchat.com/add/birthnon?share_id=Gfv-CCVaoV0&locale=en-US"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                <FaSnapchat size={20} />
              </a>
            </div>
            <div>
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

        {/* Desktop & Larger Footer: visible on screens 1201px and up */}
        <div className="hidden desktop-up:flex items-start justify-between gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">BirthNon</h3>
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
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Connect With Us
            </h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://www.facebook.com/share/1Aawp6gShp/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                <FiFacebook size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@birthnon?_t=ZM-8wZGJMDXoMY&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                <FaTiktok size={20} />
              </a>
              <a
                href="https://www.instagram.com/birth.non?igsh=ZHh2YmVxZ3lzZzR2&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                <FiInstagram size={20} />
              </a>
              <a
                href="https://www.snapchat.com/add/birthnon?share_id=Gfv-CCVaoV0&locale=en-US"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                <FaSnapchat size={20} />
              </a>
            </div>
            <div>
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
            &copy; {new Date().getFullYear()} BirthNon site. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
