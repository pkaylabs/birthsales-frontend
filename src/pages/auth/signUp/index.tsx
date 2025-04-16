import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-location";
import { CLIENT_HOME, LOGIN } from "@/constants";

const SignUp = () => {
  const navigate = useNavigate();
  const { values, handleBlur, handleChange, errors, touched, handleSubmit } =
    useFormik({
      initialValues: {
        name: "",
        email: "",
        password: "",
      },

      validationSchema: Yup.object().shape({
        name: Yup.string()
          .min(2, "Too Short!")
          .max(50, "Too Long!")
          .required("Name is required"),
        email: Yup.string()
          .email("Please enter a valid email")
          .required("Email is required"),
        password: Yup.string()
          .min(8, "Password must be 8 characters or more")
          .required("Password is required"),
      }),

      onSubmit: (e, action) => {
        action.resetForm();
        navigate({to: CLIENT_HOME, replace: true});
      },
    });

  return (
    <div className="mt-[5rem] w-full slide-up">
      <div className="flex mb-20">
        {/* Image */}
        <div className="hidden flex-[2] lg:flex">
          <img
            alt="sign up image"
            src="https://plus.unsplash.com/premium_photo-1728224403721-a4affa8e30ff?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="object-contain w-full"
          />
        </div>
        {/* form */}
        <div className=" flex flex-col px-5 py-5  flex-1 md:py-20 md:px-32">
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            <div className="flex flex-col gap-2 items-center">
              <h1 className="font-medium text-xl leading-7 md:text-4xl">
                Create an account
              </h1>
              <p className="font-normal text-base">Enter your details below</p>
            </div>
            <div className="flex flex-col gap-5">
              <input
                type="text"
                name="name"
                id="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className="p-2 border-b border-gray-500 w-full outline-none"
                placeholder="Name"
              />
              {errors.name && touched.name ? (
                <p className="text-rose-400">{errors.name}</p>
              ) : (
                ""
              )}
              <input
                type="email"
                name="email"
                id="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="p-2 border-b border-gray-500 w-full outline-none"
                placeholder="Email"
              />
              {errors.email && touched.email ? (
                <p className="text-rose-400">{errors.email}</p>
              ) : (
                ""
              )}
              <input
                type="password"
                name="password"
                id="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className="p-2 border-b border-gray-500 w-full outline-none"
                placeholder="Password"
              />
              {errors.password && touched.password ? (
                <p className="text-rose-400">{errors.password}</p>
              ) : (
                ""
              )}
              <button
                type="submit"
                className="bg-[#DB4444] p-2 rounded-md w-full text-white text-center"
              >
                Create Account
              </button>

              <button className="flex items-center justify-center gap-2 rounded-md p-2 border border-gray-500 w-full">
                <FcGoogle className="text-lg items-center" />
                <span>Sign up with Google</span>
              </button>
            </div>
          </form>
          <p className="mt-5 flex items-center justify-center">
            Already have an account?
            <Link to={LOGIN} className="ml-1 active:text-rose-300">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
