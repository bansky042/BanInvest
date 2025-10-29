"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

const plans = [
  { name: "Basic Plan", profitPercent: 40 },
  { name: "Standard Plan", profitPercent: 75 },
  { name: "Premium Plan", profitPercent: 100 },
];

const InvestmentCalculator = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [amount, setAmount] = useState<number | "">("");
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);

  const profit =
    amount !== "" ? (amount * selectedPlan.profitPercent) / 100 : 0;
  const totalReturn = amount !== "" ? profit + Number(amount) : 0;

  return (
    <section
      className={`relative py-16 px-6 md:px-20 flex flex-col items-center transition-colors duration-500 ${
        isDark ? "bg-[#090011] text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-10"
      >
        Investment Calculator
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className={`w-full max-w-lg rounded-2xl p-8 shadow-xl ${
          isDark
            ? "bg-gradient-to-br from-[#100024] to-[#0d1226]"
            : "bg-gradient-to-br from-white to-gray-100"
        }`}
      >
        {/* Amount Input */}
        <label className="block text-lg font-semibold mb-3">
          Enter Investment Amount
        </label>
        <input
          type="number"
          placeholder="Enter amount..."
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value ? parseFloat(e.target.value) : "")
          }
          className={`w-full p-4 mb-6 text-lg rounded-lg border outline-none transition ${
            isDark
              ? "bg-[#0f0120] border-gray-700 text-gray-200 focus:border-teal-400"
              : "bg-white border-gray-300 text-gray-800 focus:border-purple-500"
          }`}
        />

        {/* Plan Selector */}
        <label className="block text-lg font-semibold mb-3">
          Select Investment Plan
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {plans.map((plan) => (
            <button
              key={plan.name}
              onClick={() => setSelectedPlan(plan)}
              className={`p-4 rounded-lg border text-center font-medium transition-all duration-300 ${
                selectedPlan.name === plan.name
                  ? isDark
                    ? "bg-gradient-to-r from-purple-600 to-teal-400 text-white border-none"
                    : "bg-gradient-to-r from-purple-500 to-teal-500 text-white border-none"
                  : isDark
                  ? "bg-[#0f0120] border-gray-700 hover:border-teal-400 text-gray-300"
                  : "bg-white border-gray-300 hover:border-purple-400 text-gray-700"
              }`}
            >
              {plan.name}
              <div className="text-sm mt-1 text-gray-400">
                +{plan.profitPercent}% Profit
              </div>
            </button>
          ))}
        </div>

        {/* Results */}
        {amount !== "" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            <div className="flex justify-between text-lg">
              <span>Profit:</span>
              <span
                className={`font-semibold ${
                  isDark ? "text-teal-400" : "text-teal-600"
                }`}
              >
                ${profit.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-lg">
              <span>Total Return:</span>
              <span
                className={`font-bold ${
                  isDark ? "text-purple-400" : "text-purple-600"
                }`}
              >
                ${totalReturn.toFixed(2)}
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Decorative glow */}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] blur-[180px] rounded-full -z-10 ${
          isDark ? "bg-teal-500/20" : "bg-purple-400/20"
        }`}
      ></div>
    </section>
  );
};

export default InvestmentCalculator;
