import { useResetPasswordMutation } from "@/features/api/authApi";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Reset = () => {
  const [email, setEmail] = useState(""); // Required
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const [resetPassword, { isLoading, isSuccess, isError, error }] =
    useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await resetPassword({
        email,
        otp,
        newPassword,
        confirmPassword,
      }).unwrap();
      alert("Password reset successful");
      navigate("/login");
    } catch (err) {
      console.error("Error resetting password:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1120] text-white px-4">
      <div className="w-full max-w-md bg-[#0F172A] rounded-md shadow-md p-6">
        <h2 className="text-xl font-semibold mb-1">Reset Password</h2>
        <p className="text-sm text-gray-400 mb-4">
          Enter the OTP sent to your email and set a new password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-[#1E293B] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="otp" className="block text-sm mb-1">
              OTP
            </label>
            <input
              id="otp"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-[#1E293B] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm mb-1">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-[#1E293B] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-[#1E293B] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Submit"}
          </button>
        </form>

        {isError && (
          <p className="text-red-400 text-sm mt-2">
            {error?.data?.message || "Something went wrong"}
          </p>
        )}
        {isSuccess && (
          <p className="text-green-400 text-sm mt-2">
            Password reset successful. Redirecting...
          </p>
        )}

        <div className="text-sm text-right mt-3">
          <a href="/login" className="text-blue-400 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Reset;
