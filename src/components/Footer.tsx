"use client";

import { Twitter, Send, MessageCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer
      className={`border-t transition-colors duration-500 ${
        isDark
          ? "border-purple-900/40 bg-[#090013] text-gray-400"
          : "border-gray-200 bg-white text-gray-700"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
        {/* Logo + Tagline */}
        <div className="text-center md:text-left">
          <h2
            className={`text-2xl font-extrabold text-transparent bg-clip-text ${
              isDark
                ? "bg-gradient-to-r from-purple-500 to-teal-400"
                : "bg-gradient-to-r from-purple-700 to-teal-600"
            }`}
          >
            BanInvest
          </h2>
          <p
            className={`text-sm mt-1 ${
              isDark ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Smart crypto investments. Secure. Profitable. Global.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex items-center space-x-6">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors duration-300 flex items-center gap-2 ${
              isDark ? "hover:text-teal-400" : "hover:text-teal-600"
            }`}
          >
            <Twitter size={18} />
            <span className="hidden sm:inline">Twitter</span>
          </a>

          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors duration-300 flex items-center gap-2 ${
              isDark ? "hover:text-teal-400" : "hover:text-teal-600"
            }`}
          >
            <Send size={18} />
            <span className="hidden sm:inline">Telegram</span>
          </a>

          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors duration-300 flex items-center gap-2 ${
              isDark ? "hover:text-teal-400" : "hover:text-teal-600"
            }`}
          >
            <MessageCircle size={18} />
            <span className="hidden sm:inline">Discord</span>
          </a>
        </div>
      </div>

      {/* Divider line */}
      <div
        className={`border-t transition-colors duration-500 ${
          isDark ? "border-purple-900/30" : "border-gray-200"
        }`}
      />

      {/* Copyright */}
      <div
        className={`py-5 text-center text-sm transition-colors duration-500 ${
          isDark ? "text-gray-500" : "text-gray-600"
        }`}
      >
        © {new Date().getFullYear()}{" "}
        <span
          className={`text-transparent bg-clip-text font-semibold ${
            isDark
              ? "bg-gradient-to-r from-purple-500 to-teal-400"
              : "bg-gradient-to-r from-purple-700 to-teal-600"
          }`}
        >
          BanInvest
        </span>
        . All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
