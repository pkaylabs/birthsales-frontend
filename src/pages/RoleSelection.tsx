import { LOGIN, SIGN_UP } from "@/constants";
import React from "react";
import { Link } from "react-location";

const RoleSelection: React.FC = () => {
  return (
    <div className="flex flex-col items-center md:pt-[10%] pt-[20%] h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">
        Welcome to Our E-Commerce Platform
      </h1>
      <p className="mb-4">Please choose your role:</p>
      <div className="flex space-x-4">
        <Link
          to="/vendor-sign-up"
          className="bg-blue-600 text-white p-4 rounded hover:bg-blue-700"
        >
          I am a Vendor
        </Link>
        <Link
          to={SIGN_UP}
          className="bg-green-600 text-white p-4 rounded hover:bg-green-700"
        >
          I am a Client
        </Link>
      </div>
      <div className="mt-6">
        <p className="mb-2">Already have an account?</p>
        <div className="flex space-x-4">
          <Link
            to={LOGIN}
            className="text-blue-600 underline hover:text-blue-800"
          >
            Client Sign In
          </Link>
          {/* <Link
            to="/vendor/dashboard"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Vendor Sign In
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
