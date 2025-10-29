"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation"; // ✅ correct import

export default function ResetPassword() {
  const { theme } = useTheme();
  const router = useRouter(); // ✅ use hook instead of direct import

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Get the verified email saved after OTP verification
  const email =
    typeof window !== "undefined" ? localStorage.getItem("resetEmail") : null;

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return setMessage("Passwords do not match.");

    setLoading(true);
    try {
      const email = localStorage.getItem("resetEmail");
      if (!email) {
        setMessage("No email found. Please start reset again.");
        return;
      }

      const res = await fetch("/api/email/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");

      setMessage("✅ Password reset successful. Redirecting...");
      setTimeout(() => router.push("/auth/signin"), 2000); // ✅ now works correctly
    } catch (err: any) {
      console.error("Reset error:", err);
      setMessage("❌ Failed to reset password.");
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
          Reset Password
        </h1>

        {message && (
          <p className="text-center mb-4 text-sm text-teal-400">{message}</p>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
              theme === "dark"
                ? "bg-[#1A002D] border-purple-700/50 focus:ring-teal-400 text-white"
                : "bg-gray-100 border-gray-300 focus:ring-purple-400 text-gray-900"
            }`}
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
              theme === "dark"
                ? "bg-[#1A002D] border-purple-700/50 focus:ring-teal-400 text-white"
                : "bg-gray-100 border-gray-300 focus:ring-purple-400 text-gray-900"
            }`}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold shadow-lg transition-transform hover:scale-105 ${
              theme === "dark"
                ? "bg-gradient-to-r from-purple-600 to-teal-400 text-white"
                : "bg-gradient-to-r from-purple-500 to-teal-500 text-white"
            }`}
          >
            {loading ? "Please wait..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
