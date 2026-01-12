"use client";
import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";

const VerifyUser = ({ length = 6, email, onVerified }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    let value = e.target.value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length !== length) {
      toast.error("Please enter complete OTP");
      return;
    }

    try {
      const res = await axios.post("/api/auth/verify-otp", {
        email,
        otp: otpValue,
      });

      toast.success(res.data.message);

      onVerified(); // 👈 YE DEKHO CALL KRA RHE HII NA.
    } catch (err) {
      console.log("OTP verify error:", err);
      toast.error(err?.response?.data?.message || "OTP verification failed");
    }
  };


  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center h-screen gap-6">
      <img src="/grozo.png" alt="logo" className="h-40" />
      <div className="flex gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputsRef.current[index] = el)}
            className="w-12 h-12 text-center border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        ))}
      </div>
      <button
        type="submit"
        className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer transition-all duration-300"
      >
        Verify OTP
      </button>
    </form>
  );
};

export default VerifyUser;
