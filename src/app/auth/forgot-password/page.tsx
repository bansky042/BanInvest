// src/app/auth/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function ForgotPassword() {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState<"request" | "verify">("request");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);

  // ✅ Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
  if (e) e.preventDefault();
  if (loading) return;

  if (!email) {
    setMessage("❗ Please enter your email address.");
    return;
  }

  if (resendDisabled) {
    setMessage("⏳ Please wait before requesting another OTP.");
    return;
  }

  setLoading(true);
  setMessage("");

  try {
    const res = await fetch("/api/email/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.error || "Failed to send OTP");

    console.log("✅ OTP email sent:", result);
    setMessage("✅ OTP sent successfully to your email!");
    setStage("verify"); // move to verification screen

    // Cooldown: prevent resending too soon
    setResendDisabled(true);
    setTimeout(() => setResendDisabled(false), 30000); // 30s cooldown
  } catch (err: any) {
    console.error("❌ OTP Send Error:", err);
    setMessage(err.message || "Unexpected error occurred. Try again later.");
  } finally {
    setLoading(false);
  }
};


  // ✅ Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/email/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const result = await res.json();
      if (!res.ok) {
        setMessage(result.error || "OTP verification failed.");
        return;
      }

      setMessage("✅ OTP verified successfully!");
      localStorage.setItem("resetEmail", email);
      window.location.href = "/auth/reset-password";
    } catch (err) {
      console.error("❌ OTP Verify Error:", err);
      setMessage("Unexpected error during verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 ${
        theme === "dark"
          ? "bg-[#090013] bg-gradient-to-b from-purple-900/30 to-teal-900/30 text-white"
          : "bg-gradient-to-b from-white via-gray-50 to-gray-200 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl p-8 border ${
          theme === "dark"
            ? "bg-[#0F001E]/80 border-purple-800/30"
            : "bg-white border-gray-300"
        }`}
      >
        <h1
          className={`text-2xl font-bold text-center mb-6 bg-clip-text text-transparent ${
            theme === "dark"
              ? "bg-gradient-to-r from-purple-400 to-teal-400"
              : "bg-gradient-to-r from-purple-600 to-teal-500"
          }`}
        >
          Forgot Password
        </h1>

        <p className="text-sm text-center mb-4">
          {stage === "request"
            ? "Enter your email to receive a 6-digit OTP."
            : "Enter the OTP sent to your email."}
        </p>

        {message && (
          <p
            className={`text-center mb-4 text-sm ${
              message.includes("✅") ? "text-teal-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        <form
          onSubmit={stage === "request" ? handleSendOtp : handleVerifyOtp}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={stage === "verify"}
            required
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
              theme === "dark"
                ? "bg-[#1A002D] border-purple-700/50 focus:ring-teal-400 text-white"
                : "bg-gray-100 border-gray-300 focus:ring-purple-400 text-gray-900"
            }`}
          />

          {stage === "verify" && (
            <input
              type="text"
              placeholder="Enter OTP"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                theme === "dark"
                  ? "bg-[#1A002D] border-purple-700/50 focus:ring-teal-400 text-white"
                  : "bg-gray-100 border-gray-300 focus:ring-purple-400 text-gray-900"
              }`}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold shadow-lg transition-transform hover:scale-105 ${
              theme === "dark"
                ? "bg-gradient-to-r from-purple-600 to-teal-400 text-white"
                : "bg-gradient-to-r from-purple-500 to-teal-500 text-white"
            }`}
          >
            {loading
              ? "Please wait..."
              : stage === "request"
              ? "Send OTP"
              : "Verify OTP"}
          </button>

          {stage === "verify" && (
            <button
              type="button"
              onClick={() => handleSendOtp()}
              disabled={resendDisabled || loading}
              className={`w-full py-2 text-sm mt-2 font-medium rounded-md ${
                resendDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:underline text-teal-400"
              }`}
            >
              {resendDisabled ? "Please wait..." : "Resend OTP"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
