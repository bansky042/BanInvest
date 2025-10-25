"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ContactPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen pt-28 pb-16 transition-colors duration-500 ${
        isDark ? "bg-[#090013] text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`text-4xl sm:text-5xl font-extrabold text-center bg-clip-text text-transparent ${
            isDark
              ? "bg-gradient-to-r from-purple-500 to-teal-400"
              : "bg-gradient-to-r from-purple-600 to-teal-500"
          }`}
        >
          Get in Touch
        </motion.h1>

        <p
          className={`text-center mt-4 text-lg ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Have questions or need support? We’re here to help you 24/7.
        </p>

        <div className="mt-16 grid md:grid-cols-2 gap-12">
          {/* Contact Info Section */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2
              className={`text-2xl font-semibold ${
                isDark ? "text-teal-400" : "text-teal-600"
              }`}
            >
              Contact Information
            </h2>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Mail
                  className={`${
                    isDark ? "text-purple-400" : "text-purple-600"
                  }`}
                />
                <span>banInvest@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone
                  className={`${
                    isDark ? "text-purple-400" : "text-purple-600"
                  }`}
                />
                <span>+234 916 461 2096</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin
                  className={`${
                    isDark ? "text-purple-400" : "text-purple-600"
                  }`}
                />
                <span>Lagos, Nigeria</span>
              </div>
            </div>

            <div
              className={`p-4 rounded-xl mt-8 border-l-4 ${
                isDark
                  ? "border-teal-500 bg-[#120024]"
                  : "border-teal-400 bg-teal-50"
              }`}
            >
              <p
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <strong>Note:</strong> Our support team typically responds within
                24 hours. For urgent matters, please use the phone line.
              </p>
            </div>
          </motion.div>

          {/* Contact Form Section */}
          <motion.form
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            onSubmit={(e) => e.preventDefault()}
            className={`p-8 rounded-2xl border shadow-lg transition-colors duration-500 ${
              isDark
                ? "bg-gradient-to-br from-purple-900/30 to-teal-900/20 border-purple-800/40"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="space-y-6">
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  required
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                    isDark
                      ? "bg-gray-900 border-gray-700 text-gray-200 focus:ring-teal-500"
                      : "bg-gray-100 border-gray-300 focus:ring-teal-400"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                    isDark
                      ? "bg-gray-900 border-gray-700 text-gray-200 focus:ring-teal-500"
                      : "bg-gray-100 border-gray-300 focus:ring-teal-400"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Message
                </label>
                <textarea
                  placeholder="How can we help you?"
                  rows={5}
                  required
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                    isDark
                      ? "bg-gray-900 border-gray-700 text-gray-200 focus:ring-teal-500"
                      : "bg-gray-100 border-gray-300 focus:ring-teal-400"
                  }`}
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-full font-semibold text-white transition-transform transform hover:scale-105 ${
                  isDark
                    ? "bg-gradient-to-r from-purple-600 to-teal-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                    : "bg-gradient-to-r from-purple-500 to-teal-500 shadow-md hover:shadow-lg"
                }`}
              >
                Send Message
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
