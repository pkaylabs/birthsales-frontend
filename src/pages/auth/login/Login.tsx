import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-location";
import { CLIENT_HOME } from "@/constants";

const Login = () => {
  const navigate = useNavigate()
  const { values, handleBlur, handleChange, errors, touched, handleSubmit } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },

      validationSchema: Yup.object().shape({
        email: Yup.string()
          .email("Please enter a valid email")
          .required("Email is required"),
        password: Yup.string()
          .min(8, "Password must be 8 characters or more")
          .required("Password is required"),
      }),

      onSubmit: (e, action) => {
        console.log('something')
        action.resetForm();
         navigate({ to: CLIENT_HOME, replace: true });
      },
    });

  return (
    <div className="mt-[5rem] w-full slide-up">
      <div className="flex  mb-20">
        {/* Image */}
        <div className="hidden lg:flex flex-[2]">
          <img
            alt="sign up image"
            src="https://plus.unsplash.com/premium_photo-1728224403721-a4affa8e30ff?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="object-contain"
          />
        </div>
        {/* form */}
        <div className=" flex flex-col justify-center  flex-1 px-5 py-5 md:px-32 md:py-20">
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            <div className="flex flex-col gap-2 items-center">
              <h1 className="font-medium text-xl leading-7 md:text-4xl">
                Login to Birthsales
              </h1>
              <p className="font-normal text-base">Enter your details below</p>
            </div>
            <div className="flex flex-col gap-5">
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
              <div className="w-full flex justify-between items-center">
                <button
                  type="submit"
                  className="bg-[#DB4444] py-2 px-5 w-36 rounded-md text-white text-center"
                >
                  Login
                </button>
                <p className="text-[#DB4444] cursor-pointer">Forget Password?</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
