import { useAppSelector } from "@/redux";
import { useVerifyOtpMutation } from "@/redux/features/auth/authApiSlice";
import { Button, CircularProgress, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-location";
import { toast } from "react-toastify";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const user = useAppSelector((state) => state.auth.user);
  const phone = user?.phone || "your phone number";

  useEffect(() => {
    if (!phone) navigate({ to: "/sign-up", replace: true });
  }, [phone, navigate]);

  const handleVerify = async () => {
    try {
      await verifyOtp({ phone, otp }).unwrap();
      toast.success("Phone verified!");
      navigate({ to: "/", replace: true });
    } catch (err: any) {
      toast.error(err.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl w-full max-w-sm p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Verify Your Account
        </h2>
        <p className="text-gray-600 text-sm text-center">
          Please enter the one‑time code sent to{" "}
          <span className="font-medium text-gray-900">{phone}</span>
        </p>

        <TextField
          label="One‑Time Code"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, "")); // Allow only digits
          }}
          onKeyPress={(e) => {
            // block any non‑digit key
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
          fullWidth
          disabled={isLoading}
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*", // For mobile numeric keyboard
            maxLength: 4, // Assuming OTP is 6 digits
          }}
        />

        <Button
          onClick={handleVerify}
          disabled={!otp || isLoading}
          variant="contained"
          fullWidth
          className="mt-2"
        >
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Verify"
          )}
        </Button>
      </div>
    </div>
  );
};

export default VerifyOtp;
