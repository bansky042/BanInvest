"use client";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import React from "react";

const Testimonials = () => {
  const { theme } = useTheme();

  const testimonials = [
    { name: "Ada M.", text: "BanInvest changed my crypto journey — consistent profits and easy withdrawals!" },
    { name: "John D.", text: "Trusted platform with real results. The Premium plan is a game changer." },
    { name: "Sophia K.", text: "I love how transparent and beginner-friendly BanInvest is." },
  ];

  const isDark = theme === "dark";

  return (
    <section
      id="testimonials"
      className={`py-20 px-6 md:px-16 transition-colors duration-300 ${
        isDark ? "bg-[#090015] text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <h3 className="text-3xl font-bold text-center mb-12">What Our Investors Say</h3>
      <div className="grid md:grid-cols-3 gap-8 text-center">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className={`p-8 rounded-2xl border transition-all duration-300 ${
              isDark
                ? "bg-[#100020] border-purple-800"
                : "bg-white border-gray-200 shadow-md"
            }`}
          >
            <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>“{t.text}”</p>
            <h4 className={`font-semibold ${isDark ? "text-teal-400" : "text-teal-600"}`}>- {t.name}</h4>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
