import { useForgotPasswordMutation } from "@/features/api/authApi";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading, isSuccess, isError, error }] =
    useForgotPasswordMutation();
   const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await forgotPassword({ email }).unwrap();
      console.log("OTP sent successfully:", res.message); 
    } catch (err) {
      console.error("Error sending OTP:", err); 
    }
  };
    useEffect(() => {
    if (isSuccess) {
      navigate("/reset");
    }
  }, [isSuccess, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1120] text-white px-4">
      <div className="w-full max-w-md bg-[#0F172A] rounded-md shadow-md p-6">
        <h2 className="text-xl font-semibold mb-1">Forget Password</h2>
        <p className="text-sm text-gray-400 mb-4">
          Enter your email and we’ll send you a otp to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 rounded-md bg-[#1E293B] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="karankum790941@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition"
            disabled={isLoading}
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
        {isSuccess && (
          <p className="text-green-400 text-sm mt-2">
            OTP sent successfully to your email.
          </p>
        )}
        {isError && (
          <p className="text-red-400 text-sm mt-2">
            {error?.data?.message || "Something went wrong."}
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

export default Forgot;
