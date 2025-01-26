import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const Login = () => {
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
      },
    });

  return (
    <div className="mt-[6rem] w-full slide-up">
      <div className="flex  mb-20">
        {/* Image */}
        <div className="w-[805px]">
          <img
            alt="sign up image"
            src="https://s3-alpha-sig.figma.com/img/75f3/94c0/a1c7dc5b68a42239311e510f54d8cd59?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=nV9ZtiMyfHw~oGBA2bAdQQhJRoDiX3SjhvUS31oEqYzU4hUmZ9VLGWmHEjtU18F4kBu4fSoZJ7OP3ubaKPbOzuTlzhcS8bpuf8hGgzxmBh4lS5m2PtGUF4MqEoNNrQKh6KUoIv0-nSDr~oVp4N-0JtdrFGM6j7AKZ7Hvl~shXPQUojth3jrO9GIhqqTiGfjUz4-QBk3F45leNpdREHtUkyl7UM8ogCjXT~e740kL9TA~MCAumyy~IpVMp-zSFTrdIAoSY-sFcrDORYmvOKXjErqJsu0PxRS8eeF~oHOq2HBnn679xsX~ZOIYC3VyePfI-bDy5OaygWONaM-F1xywaQ__"
            className="object-contain"
          />
        </div>
        {/* form */}
        <div className=" flex flex-col justify-center  flex-1 px-32 py-20">
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h1 className="font-medium text-4xl leading-7">
                Login to Exclusive
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
