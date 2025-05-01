import { LOGIN, SIGN_UP } from "@/constants";
import React from "react";
import { Link } from "react-location";
import { FaUserTie, FaUser } from 'react-icons/fa';

const RoleSelection: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 p-4">
      <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-4">Welcome!</h1>
        <p className="text-center text-gray-600 mb-8">Select your role to continue</p>
        <div className="flex flex-col space-y-5">
          {/* Vendor Button */}
          <Link
            to="/vendor-sign-up"
            className="flex items-center justify-center gap-3 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md"
          >
            <FaUserTie className="w-6 h-6" />
            I am a Vendor
          </Link>
          {/* Customer Button */}
          <Link
            to={SIGN_UP}
            className="flex items-center justify-center gap-3 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md"
          >
            <FaUser className="w-6 h-6" />
            I am a Customer
          </Link>
        </div>
        <div className="mt-8 text-center">
          <span className="text-gray-600 mr-2">Already have an account?</span>
          <Link
            to={LOGIN}
            className="text-blue-600 font-medium hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;

