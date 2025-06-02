import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-location";
import { HOME, LOGIN, LOGIN_BG, VERIFY_OTP } from "@/constants";
import {
  useRegisterMutation,
  type AuthCredentials,
} from "@/redux/features/auth/authApiSlice";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const ghanaPhoneRegex = /^(?:0|233)(?:24|25|54|55|20|26|27|50|56|57|28)\d{7}$/;

const SignUp = () => {
  const navigate = useNavigate();
  const [register, { isLoading, error }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik<AuthCredentials>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      user_type: "DELIVERY",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Name must be atleast two characters")
        .max(50, "Name can be atmost 50 characters")
        .required("Name is required"),
      email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Must be at least 8 characters")
        .matches(/[A-Z]/, "Must contain at least one uppercase letter")
        .matches(/[a-z]/, "Must contain at least one lowercase letter")
        .matches(/\d/, "Must contain at least one number")
        .matches(
          /[!@#$%^&*(),.?":{}|<>]/,
          "Must contain at least one special character"
        )
        .required("Password is required"),
      phone: Yup.string()
        .matches(
          ghanaPhoneRegex,
          "Enter a valid number (e.g. 0546573849 or 233546573849)"
        )
        .required("Phone is required"),
      address: Yup.string().min(5, "Too short").required("Address is required"),
    }),
    onSubmit: async (vals) => {
      try {
        await register(vals).unwrap();
        toast.success(
          "Registration successful! An OTP has been sent to your phone."
        );
        // Redirect to OTP verification page
        navigate({ to: VERIFY_OTP });
      } catch (err: any) {
        const errMessage = err?.data?.detail || "Failed to create account";
        toast.error(errMessage);
      }
    },
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 animate-fade-in"
      style={{ backgroundImage: `url(${LOGIN_BG})`, backgroundSize: "cover" }}
    >
      <div className="relative bg-white/90 backdrop-blur-lg rounded-xl shadow-lg max-w-md w-full p-8">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-xl">
            <CircularProgress />
          </div>
        )}
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Create an Account
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/** Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              disabled={isLoading}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
              placeholder="Your full name"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="mt-1 text-xs text-rose-500">{formik.errors.name}</p>
            )}
          </div>

          {/** Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              disabled={isLoading}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
              placeholder="you@example.com"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-xs text-rose-500">
                {formik.errors.email}
              </p>
            )}
          </div>

          {/** Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              maxLength={10}
              disabled={isLoading}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
              placeholder="0546573849"
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="mt-1 text-xs text-rose-500">
                {formik.errors.phone}
              </p>
            )}
          </div>

          {/** Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              disabled={isLoading}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
              placeholder="Your address"
            />
            {formik.touched.address && formik.errors.address && (
              <p className="mt-1 text-xs text-rose-500">
                {formik.errors.address}
              </p>
            )}
          </div>

          {/** Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              disabled={isLoading}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-2 flex items-center pl-2 pt-6"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-xs text-rose-500">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/** Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-rose-500 hover:bg-rose-600 text-white font-medium py-2 rounded-lg transition-colors"
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign Up"
            )}
          </button>

          {error && (
            <div className="text-center text-sm text-rose-600">
              {(error as any).data?.detail || "Registration failed"}
            </div>
          )}

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link to={LOGIN} className="text-rose-500 hover:underline">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
