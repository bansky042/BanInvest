"use client";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { Coins, TrendingUp, Crown } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { supabase } from "@/lib/createclient";

export default function InvestmentPlansPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  const plans = [
    {
      name: "Basic_Plan",
      profit: "40%",
      duration: "7 Days",
      min: "$100",
      icon: <Coins />,
      gradient: "from-purple-500 to-teal-400",
    },
    {
      name: "Standard_Plan",
      profit: "75%",
      duration: "14 Days",
      min: "$500",
      icon: <TrendingUp />,
      gradient: "from-green-400 to-teal-500",
    },
    {
      name: "Premium_Plan",
      profit: "100%",
      duration: "30 Days",
      min: "$1000",
      icon: <Crown />,
      gradient: "from-yellow-400 to-orange-500",
    },
  ];
  
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
  
      if (!user) {
        router.push("/auth/signin");
      }
    };
  
    checkUser();
  }, [router]);
  return (
   <div
      className={`min-h-screen flex transition-colors duration-500 ${
        isDark ? "bg-[#0A0018] text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <Sidebar />
      <main className="flex-1 p-6 md:p-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-10"
      >
        📈 Investment Plans
      </motion.h1>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl p-8 text-center border shadow-lg transition-all ${
              isDark
                ? "bg-[#13002A]/70 border-purple-900"
                : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full text-white bg-gradient-to-r ${plan.gradient}`}
            >
              {plan.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
            <p className="text-teal-400 text-2xl font-bold">{plan.profit}</p>
            <p className="text-sm mt-1 text-gray-400">Duration: {plan.duration}</p>
            <p className="text-sm mt-1 text-gray-400">Min Deposit: {plan.min}</p>

            <Link href={`/dashboard/invest/${plan.name.toLowerCase().split(" ")[0]}`}>
  <button className="mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-teal-500 text-white font-semibold hover:opacity-90 transition">
    Invest Now
  </button>
</Link>
          </motion.div>
        ))}
      </div>
      </main>
    </div>
  );
}
