"use client";

import { motion } from "framer-motion";
import { Shield, BarChart3, Headphones, Wallet, Zap, Clock } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Features = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const features = [
    {
      title: "Secure Transactions",
      desc: "Your assets are protected with bank-grade encryption and blockchain-level security.",
      icon: <Shield size={36} />,
    },
    {
      title: "Automated Profits",
      desc: "Our AI-powered system calculates and credits your profits automatically in real time.",
      icon: <BarChart3 size={36} />,
    },
    {
      title: "24/7 Support",
      desc: "Our support team is always available to assist you through live chat or email.",
      icon: <Headphones size={36} />,
    },
    {
      title: "Instant Withdrawals",
      desc: "Withdraw your earnings instantly — no delays, no hidden fees, full transparency.",
      icon: <Wallet size={36} />,
    },
    {
      title: "High Returns",
      desc: "Enjoy up to 100% ROI with our premium investment plans tailored for smart investors.",
      icon: <Zap size={36} />,
    },
    {
      title: "Reliable & Transparent",
      desc: "Track all transactions and profit growth from your dashboard — 100% transparent.",
      icon: <Clock size={36} />,
    },
  ];

  return (
    <section
      id="features"
      className={`py-24 px-6 md:px-16 transition-colors duration-500 ${
        isDark ? "bg-[#090013] text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <motion.h3
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`text-4xl font-extrabold text-center mb-4 bg-clip-text text-transparent ${
          isDark
            ? "bg-gradient-to-r from-purple-400 to-teal-400"
            : "bg-gradient-to-r from-purple-600 to-teal-500"
        }`}
      >
        Why Choose BanInvest?
      </motion.h3>

      <p
        className={`text-center mb-16 max-w-2xl mx-auto text-lg ${
          isDark ? "text-gray-400" : "text-gray-600"
        }`}
      >
        BanInvest is designed for investors who value simplicity, automation, and trust.  
        Here’s why thousands of users choose us for crypto investments.
      </p>

      {/* Features Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={`p-8 rounded-2xl border backdrop-blur-sm transition-all duration-500 shadow-lg hover:shadow-xl ${
              isDark
                ? "bg-[#120226]/70 border-purple-900 hover:border-teal-400/40"
                : "bg-white border-gray-200 hover:border-teal-400/30"
            }`}
          >
            <div
              className={`w-14 h-14 mx-auto mb-6 flex items-center justify-center rounded-full shadow-md transition-all ${
                isDark
                  ? "bg-gradient-to-br from-purple-600 to-teal-400 text-white"
                  : "bg-gradient-to-br from-purple-500 to-teal-500 text-white"
              }`}
            >
              {f.icon}
            </div>

            <h4
              className={`text-xl font-semibold mb-3 ${
                isDark ? "text-teal-300" : "text-teal-600"
              }`}
            >
              {f.title}
            </h4>

            <p className={`${isDark ? "text-gray-400" : "text-gray-700"}`}>
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
