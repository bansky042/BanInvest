"use client";
import { motion } from "framer-motion";
import React from "react";
import { useTheme } from "../context/ThemeContext";
import type { User } from "@supabase/supabase-js";

interface PlansProps {
  user?: User | null;
}

const Plans: React.FC<PlansProps> = ({ user }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Extract user name or fallback
  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    null;

  const plans = [
    {
      name: "Basic",
      profit: "40%",
      desc: "Perfect for beginners starting small.",
    },
    {
      name: "Standard",
      profit: "75%",
      desc: "For growing investors seeking balance.",
    },
    {
      name: "Premium",
      profit: "100%",
      desc: "For professionals aiming for max returns.",
    },
  ];

  return (
    <section
      id="plans"
      className={`py-20 px-6 md:px-16 transition-colors duration-500 ${
        isDark ? "bg-[#090015] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <h3
        className={`text-3xl font-bold text-center mb-12 bg-clip-text text-transparent ${
          isDark
            ? "bg-gradient-to-r from-purple-400 to-teal-400"
            : "bg-gradient-to-r from-purple-600 to-teal-500"
        }`}
      >
        {displayName ? `${displayName}'s Investment Plans` : "Investment Plans"}
      </h3>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`p-8 rounded-2xl border text-center shadow-lg transition-all duration-300 hover:shadow-xl ${
              isDark
                ? "bg-[#120226] border-purple-900 hover:border-teal-400/40"
                : "bg-white border-gray-300 hover:border-teal-400/40"
            }`}
          >
            <h4
              className={`text-2xl font-bold mb-2 ${
                isDark ? "text-purple-400" : "text-purple-600"
              }`}
            >
              {plan.name} Plan
            </h4>

            <p
              className={`text-4xl font-extrabold mb-4 ${
                isDark ? "text-teal-300" : "text-teal-600"
              }`}
            >
              {plan.profit}
            </p>

            <p
              className={`mb-6 ${
                isDark ? "text-gray-400" : "text-gray-700"
              }`}
            >
              {plan.desc}
            </p>

            <a
              href={user ? `/invest/${plan.name.toLowerCase()}` : "/auth/signup"}
              className="bg-gradient-to-r from-purple-600 to-teal-400 px-6 py-2 rounded-full font-semibold text-white shadow-md hover:opacity-90 transition"
            >
              {user ? "Invest Now" : "Create Account"}
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Plans;
