import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-location";
import { HOME, ADMIN_HOME, LOGIN_BG } from "@/constants";
import { useLoginMutation } from "@/redux/features/auth/authApiSlice";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Must be at least 8 characters")
        .required("Password is required"),
    }),
    onSubmit: async (vals) => {
      try {
        const { user } = await login(vals).unwrap();
        toast.success("Login Successful!");
        navigate({
          to: user.user_type === "DELIVERY" ? HOME : ADMIN_HOME,
          replace: true,
        });
      } catch (err: any) {
        const errMessage = err?.data?.detail || "Login Failed";
        toast.error(errMessage);
      }
    },
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 animate-fade-in"
      style={{ backgroundImage: `url(${LOGIN_BG})`, backgroundSize: "cover" }}
    >
      <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg max-w-md w-full p-8 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-xl">
            <CircularProgress />
          </div>
        )}
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Welcome Back
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-5">
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
              placeholder="someone@example.com"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-xs text-rose-500">
                {formik.errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              disabled={isLoading}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
              placeholder="••••••••"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-xs text-rose-500">
                {formik.errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-rose-500 hover:bg-rose-600 text-white font-medium py-2 rounded-lg transition-colors"
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Login"
            )}
          </button>

          {error && (
            <div className="text-center text-sm text-rose-600">
              {(error as any).data?.detail || "Login failed"}
            </div>
          )}

          <div className="flex justify-between text-sm">
            <button
              type="button"
              onClick={() => {
                /* TODO: forgot password flow */
              }}
              disabled={isLoading}
              className="text-rose-500 hover:underline"
            >
              Forgot password?
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              disabled={isLoading}
              className="text-gray-500 hover:underline"
            >
              Back to home
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
