import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-location";
import { HOME, ADMIN_HOME, LOGIN_BG } from "@/constants";
import {
  useGetOtpMutation,
  useLoginMutation,
  useResetPasswordMutation,
  useVerifyOtpMutation,
} from "@/redux/features/auth/authApiSlice";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();

  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [getOtp, { isLoading: gettingOtp }] = useGetOtpMutation();

  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();

  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
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
        const errMessage = err?.data?.error_message || "Login Failed";
        toast.error(errMessage);
      }
    },
  });

  const handleGetOtp = async () => {
    if (!phone) return toast.error("Please enter your phone number");
    try {
      const res = await getOtp({ phone }).unwrap();
      toast.success(res?.message || "OTP sent!");
      setStep(2);
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await verifyOtp({ phone, otp }).unwrap();
      toast.success(res?.message || "OTP verified!");
      setStep(3);
    } catch (e: any) {
      toast.error(e.data?.message || "Invalid OTP");
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords must match");
    }
    try {
      await resetPassword({
        phone,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }).unwrap();
      toast.success("Password reset successful");
      setStep(0);
    } catch (e: any) {
      toast.error(e.data?.message || "Reset failed");
    }
  };

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
              onClick={() => setStep(1)}
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
      <Dialog open={step > 0} onClose={() => setStep(0)}>
        <DialogTitle>
          {step === 1 && "Enter your Phone"}
          {step === 2 && "Enter the OTP"}
          {step === 3 && "Reset your password"}
        </DialogTitle>
        <DialogContent dividers>
          {step === 1 && (
            <TextField
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
            />
          )}
          {step === 2 && (
            <TextField
              label="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              fullWidth
            />
          )}
          {step === 3 && (
            <>
              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                margin="dense"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStep(0)}>Cancel</Button>
          {step === 1 && (
            <Button onClick={handleGetOtp} disabled={!phone || gettingOtp}>
              {gettingOtp ? <CircularProgress size={20} /> : "Get Otp"}
            </Button>
          )}
          {step === 2 && (
            <Button onClick={handleVerifyOtp} disabled={!otp || verifying}>
              {verifying ? <CircularProgress size={20} /> : "Verify Otp"}
            </Button>
          )}
          {step === 3 && (
            <Button
              onClick={handleResetPassword}
              disabled={!newPassword || !confirmPassword || resetting}
            >
              {resetting ? <CircularProgress size={20} /> : "Reset Password"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Login;
