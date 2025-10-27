"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/createclient";
import { useTheme } from "@/context/ThemeContext";
import Sidebar from "@/components/Sidebar";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Investment {
  id: string;
  plan: string;
  amount: number;
  profit_percent?: number;
  start_date: string;
  end_date: string;
  status: string;
}

export default function InvestmentHistoryPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const router = useRouter();

  useEffect(() => {
    const fetchInvestments = async () => {
      setLoading(true);
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          router.push("/auth/signin");
          return;
        }

        const { data, error } = await supabase
          .from("investments")
          .select("*")
          .eq("user_id", userData.user.id)
          .order("start_date", { ascending: false });

        if (error) throw error;
        setInvestments(data || []);
      } catch (err) {
        console.error("Error fetching investments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvestments();
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 10000);
    return () => clearInterval(interval);
  }, []);

  const calculateLiveProfit = (inv: Investment) => {
    if (!inv.start_date || !inv.end_date) return { progress: 0, liveProfit: 0 };
    const start = new Date(inv.start_date).getTime();
    const end = new Date(inv.end_date).getTime();
    const now = currentTime;
    if (now <= start) return { progress: 0, liveProfit: 0 };
    const plan = inv.plan?.toLowerCase().trim();
    let profitPercent = 0;
    if (plan.includes("basic")) profitPercent = 40;
    else if (plan.includes("standard")) profitPercent = 75;
    else if (plan.includes("premium")) profitPercent = 100;
    else profitPercent = inv.profit_percent || 0;
    const total = end - start;
    const elapsed = Math.min(now - start, total);
    const ratio = elapsed / total;
    const liveProfit = inv.amount * (profitPercent / 100) * ratio;
    return { progress: ratio * 100, liveProfit };
  };

  return (
    <div
      className={`min-h-screen flex transition-colors duration-500 overflow-x-hidden ${
        isDark ? "bg-[#0A0018] text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Sidebar />
      <main className="flex-1 p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`rounded-2xl overflow-hidden border shadow-lg ${
            isDark
              ? "bg-[#13002A]/60 border-purple-900"
              : "bg-white border-gray-200"
          }`}
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-bold mb-4 p-4 sm:p-6 border-b border-gray-800/30"
          >
            📊 Investment History
          </motion.h1>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            </div>
          ) : investments.length === 0 ? (
            <p className="text-center text-gray-400 py-10">
              No investment history yet.
            </p>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="min-w-[700px] w-full text-sm sm:text-base">
                <thead className={isDark ? "bg-[#1B0035]" : "bg-gray-100"}>
                  <tr>
                    <th className="p-4 text-left">Plan</th>
                    <th className="p-4 text-left">Amount</th>
                    <th className="p-4 text-left">Profit (Live)</th>
                    <th className="p-4 text-left">Start</th>
                    <th className="p-4 text-left">End</th>
                    <th className="p-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((inv, i) => {
                    const { progress, liveProfit } = calculateLiveProfit(inv);
                    return (
                      <motion.tr
                        key={inv.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`border-t ${
                          isDark ? "border-gray-800" : "border-gray-200"
                        } hover:bg-purple-900/10 transition`}
                      >
                        <td className="p-4 capitalize whitespace-nowrap">
                          {inv.plan}
                        </td>
                        <td className="p-4 whitespace-nowrap">${inv.amount}</td>
                        <td className="p-4 text-teal-400 font-semibold whitespace-nowrap">
                          +${liveProfit.toFixed(2)}{" "}
                          <span className="text-gray-400 text-xs ml-1">
                            ({progress.toFixed(1)}%)
                          </span>
                        </td>
                        <td className="p-4 text-gray-400 whitespace-nowrap">
                          {new Date(inv.start_date).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-gray-400 whitespace-nowrap">
                          {new Date(inv.end_date).toLocaleDateString()}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              inv.status === "completed"
                                ? "bg-teal-500/20 text-teal-400"
                                : inv.status === "active"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
