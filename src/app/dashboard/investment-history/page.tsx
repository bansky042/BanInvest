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
  const [currentTime, setCurrentTime] = useState(Date.now()); // 🔄 live clock
  const router = useRouter();

  // ✅ Fetch investments
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

  // 🔁 Auto-update every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

 const calculateLiveProfit = (inv: Investment) => {
  if (!inv.start_date || !inv.end_date) return { progress: 0, liveProfit: 0 };

  const start = new Date(inv.start_date).getTime();
  const end = new Date(inv.end_date).getTime();
  const now = currentTime;

  if (now <= start) return { progress: 0, liveProfit: 0 };

  // ✅ Normalize plan name (remove spaces, lowercase)
  const plan = inv.plan?.toLowerCase().trim();

  // ✅ Assign profit percent dynamically
  let profitPercent = 0;
  if (plan.includes("basic")) profitPercent = 40;
  else if (plan.includes("standard")) profitPercent = 75;
  else if (plan.includes("premium")) profitPercent = 100;
  else profitPercent = inv.profit_percent || 0; // fallback if custom plan

  // ✅ Calculate progress and live profit
  const totalDuration = end - start;
  const elapsed = Math.min(now - start, totalDuration);
  const progressRatio = elapsed / totalDuration;

  const liveProfit = inv.amount * (profitPercent / 100) * progressRatio;
  const progressPercent = progressRatio * 100;

  console.log({
    plan: inv.plan,
    normalizedPlan: plan,
    profitPercent,
    totalDuration,
    elapsed,
    progressRatio,
    liveProfit,
  });

  return { progress: progressPercent, liveProfit };
};




  return (
    <div
      className={`min-h-screen flex transition-colors duration-500 ${
        isDark ? "bg-[#0A0018] text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Sidebar />

      <main className="flex-1 p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`rounded-2xl overflow-hidden border shadow-lg ${
            isDark ? "bg-[#13002A]/60 border-purple-900" : "bg-white border-gray-200"
          }`}
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-6 p-6 border-b border-gray-800/30"
          >
            📊 Investment History
          </motion.h1>

          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            </div>
          ) : investments.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No investment history yet.</p>
          ) : (
            <table className="w-full text-sm">
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
                {investments.map((inv, index) => {
                  const { progress, liveProfit } = calculateLiveProfit(inv);

                  return (
                    <motion.tr
                      key={inv.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-t ${
                        isDark ? "border-gray-800" : "border-gray-200"
                      } hover:bg-purple-900/10 transition`}
                    >
                      <td className="p-4 capitalize">{inv.plan}</td>
                      <td className="p-4">${inv.amount}</td>
                      <td className="p-4 text-teal-400 font-semibold">
                        +${liveProfit.toFixed(2)}{" "}
                        <span className="text-gray-400 text-xs ml-1">
                          ({progress.toFixed(1)}% complete)
                        </span>
                      </td>

                      <td className="p-4 text-gray-400">
                        {new Date(inv.start_date).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-gray-400">
                        {new Date(inv.end_date).toLocaleDateString()}
                      </td>
                      <td className="p-4">
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
          )}
        </motion.div>
      </main>
    </div>
  );
}
