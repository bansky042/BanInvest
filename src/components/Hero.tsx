"use client";

import { motion } from "framer-motion";
import React from "react";
import { useTheme } from "@/context/ThemeContext";

interface HeroProps {
  user?: { name?: string };
}

const Hero: React.FC<HeroProps> = ({ user }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      className={`relative flex flex-col items-center justify-center text-center overflow-hidden py-28 px-6 md:px-16 transition-colors duration-500 ${
        isDark ? "bg-[#080010] text-gray-100" : "bg-gradient-to-b from-white to-gray-50 text-gray-900"
      }`}
    >
      {/* Soft gradient overlay */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05),transparent_70%)]"
            : "bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.08),transparent_70%)]"
        }`}
      />

      {/* Main Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 relative z-10"
      >
        Grow Your Crypto{" "}
        <span
          className={`text-transparent bg-clip-text ${
            isDark
              ? "bg-gradient-to-r from-purple-500 via-teal-400 to-purple-500"
              : "bg-gradient-to-r from-purple-600 via-teal-500 to-purple-600"
          }`}
        >
          Smarter
        </span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className={`text-lg md:text-xl max-w-2xl mx-auto mb-12 relative z-10 ${
          isDark ? "text-gray-400" : "text-gray-700"
        }`}
      >
        Build wealth effortlessly with{" "}
        <span
          className={`font-semibold ${
            isDark ? "text-teal-400" : "text-teal-600"
          }`}
        >
          BanInvest
        </span>
        . Experience secure, automated, and transparent growth in the
        cryptocurrency market.
      </motion.p>

      {/* CTA Button */}
      <motion.a
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.96 }}
        href={user ? "/dashboard" : "/auth/signup"}
        className={`relative z-10 px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
          isDark
            ? "bg-gradient-to-r from-purple-600 to-teal-400 text-white shadow-[0_0_30px_rgba(56,189,248,0.25)] hover:shadow-[0_0_45px_rgba(56,189,248,0.4)]"
            : "bg-gradient-to-r from-purple-500 to-teal-500 text-white shadow-md hover:shadow-xl hover:shadow-teal-300/40"
        }`}
      >
        {user ? "Start Investing" : "Create Account"}
      </motion.a>

      {/* Decorative Glow Elements */}
      <div
        className={`absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] blur-[200px] rounded-full transition-all duration-700 ${
          isDark ? "bg-teal-500/30" : "bg-purple-300/30"
        }`}
      ></div>

      <div
        className={`absolute top-0 right-1/4 w-[300px] h-[300px] blur-[160px] rounded-full ${
          isDark ? "bg-purple-600/20" : "bg-teal-200/30"
        }`}
      ></div>
    </section>
  );
};

export default Hero;
