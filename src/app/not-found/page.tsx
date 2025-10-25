"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ✅ Prevent hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen transition-colors duration-500 ${
        theme === "dark"
          ? "bg-[#0A0018] text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
     

      {/* 🌀 404 Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-8xl font-extrabold mb-4 tracking-tight"
      >
        404
      </motion.h1>

      {/* 💬 Message */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-lg font-medium mb-8 text-center max-w-lg leading-relaxed"
      >
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </motion.p>

      {/* 🔙 Back Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          onClick={() => router.push("/dashboard")}
          className={`px-6 py-2 text-lg rounded-xl font-semibold shadow-md transition-all duration-300 ${
            theme === "dark"
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-blue-700 hover:bg-blue-800 text-white"
          }`}
        >
          Back to Dashboard
        </Button>
      </motion.div>

      {/* 🎨 Illustration */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-12"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-64 h-64 opacity-80"
          viewBox="0 0 1024 1024"
          fill="none"
        >
          <path
            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zM512 938.7C280.5 938.7 85.3 743.5 85.3 512S280.5 85.3 512 85.3 938.7 280.5 938.7 512 743.5 938.7 512 938.7z"
            fill={theme === "dark" ? "#3b82f6" : "#1e3a8a"}
          />
          <circle
            cx="512"
            cy="512"
            r="150"
            fill={theme === "dark" ? "#2563eb" : "#3b82f6"}
          />
          <path
            d="M512 350v162h162"
            stroke="#fff"
            strokeWidth="24"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}
