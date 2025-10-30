"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/createclient";
import { toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";

interface Investment {
  id: string;
  user_id: string;
  plan: string;
  amount: number;
  profit: number;
  duration: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface UserData {
  deposit_balance: number;
  profit_balance: number;
  username: string;
}

export default function OngoingInvestments() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState<Investment | null>(null);
  const [stoppingId, setStoppingId] = useState<string | null>(null);

  // ✅ Fetch user's active & completed investments
  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setInvestments([]);
        return;
      }

      const { data, error } = await supabase
  .from("investments")
  .select("*")
  .eq("user_id", user.id)
  .eq("status", "active") // only active investments
  .order("start_date", { ascending: false });


      if (error) throw error;
      setInvestments(data ?? []);
    } catch (err) {
      console.error("❌ Error fetching investments:", (err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  const checkAndCompleteInvestments = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // 🔍 Fetch only active investments (fresh data each time)
    const { data: activeInvestments, error } = await supabase
      .from("investments")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active");

    if (error) throw error;
    if (!activeInvestments || activeInvestments.length === 0) return;

    const now = Date.now();

    for (const inv of activeInvestments) {
      const endTime = new Date(inv.end_date).getTime();
      if (now >= endTime) {
        // ✅ Complete the investment logic
        const { data: userData } = await supabase
          .from("users")
          .select("profit_balance")
          .eq("id", inv.user_id)
          .single();

        const newProfitBalance = (userData?.profit_balance || 0) + inv.profit;

        await supabase
          .from("users")
          .update({ profit_balance: newProfitBalance })
          .eq("id", inv.user_id);

        await supabase
          .from("investments")
          .update({ status: "completed" })
          .eq("id", inv.id);

        toast.success(
          `✅ ${inv.plan} completed! $${inv.profit} added to your profit balance.`
        );
      }
    }

    // ✅ Refresh displayed investments after updates
    fetchInvestments();
  } catch (err) {
    console.error("⚠️ Auto-complete error:", (err as Error).message);
  }
};
// ✅ 1️⃣ Fetch investments once when the component mounts
useEffect(() => {
  fetchInvestments();
}, []);

// ✅ 2️⃣ Periodically check for completed investments
useEffect(() => {
  const interval = setInterval(() => {
    checkAndCompleteInvestments();
  }, 60 * 1000);

  // Also run immediately once
  checkAndCompleteInvestments();

  return () => clearInterval(interval);
}, []); // <-- notice no "investments" here



  // ✅ Progress bar logic
  const calculateProgress = (start: string, end: string): number => {
    const now = Date.now();
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const total = endTime - startTime;
    const elapsed = now - startTime;
    return Math.min((elapsed / total) * 100, 100);
  };

  // ✅ Remaining time display
  const calculateRemainingTime = (end: string): string => {
    const diff = new Date(end).getTime() - Date.now();
    if (diff <= 0) return "Completed";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    return `${days}d ${hours}h ${mins}m ${secs}s`;
  };

  // ✅ Live countdown refresh
  useEffect(() => {
    const interval = setInterval(() => setInvestments((prev) => [...prev]), 1000);
    return () => clearInterval(interval);
  }, []);

  // 🛑 Manual stop investment
  const handleStopInvestment = async (inv: Investment) => {
    setStoppingId(inv.id);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in first.");
        return;
      }

      const userId = user.id;
      const userEmail = user.email ?? "Unknown";

      // 1️⃣ Fetch user balance
      const { data: userData, error: userErr } = await supabase
        .from("users")
        .select("deposit_balance, username")
        .eq("id", userId)
        .single<UserData>();
      if (userErr || !userData) throw new Error(userErr?.message || "User not found.");

      const refundAmount = inv.amount;
      const newBalance = (userData.deposit_balance || 0) + refundAmount;

      // 2️⃣ Update balance
      const { error: updateErr } = await supabase
        .from("users")
        .update({ deposit_balance: newBalance })
        .eq("id", userId);
      if (updateErr) throw new Error(updateErr.message);

      // 3️⃣ Delete investment
      const { error: invErr } = await supabase.from("investments").delete().eq("id", inv.id);
      if (invErr) throw new Error(invErr.message);

      // 4️⃣ Send email notification
      const emailPayload = {
        type: "stopped",
        username: userData.username,
        userEmail,
        amount: inv.amount,
        plan: inv.plan,
      };
      await fetch("/api/investment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailPayload),
      });

      toast.success(`Investment stopped — $${refundAmount} refunded.`);
      setConfirmModal(null);
      fetchInvestments();
    } catch (err) {
      console.error("❌ Stop investment error:", (err as Error).message);
      toast.error("Failed to stop investment. Please try again.");
    } finally {
      setStoppingId(null);
    }
  };

  // ✅ UI
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-10"
      >
        <h2 className="text-2xl font-bold mb-6">💼 Ongoing Investments</h2>

        {loading ? (
          <p className="text-gray-400">Loading investments...</p>
        ) : investments.length === 0 ? (
          <p className="text-gray-400">No active investments yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {investments.map((inv) => {
              const progress = calculateProgress(inv.start_date, inv.end_date);
              const remaining = calculateRemainingTime(inv.end_date);
              const endDate = new Date(inv.end_date).toLocaleDateString();

              return (
                <motion.div
                  key={inv.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 150 }}
                  className={`rounded-2xl p-6 shadow-lg border transition-all ${
                    isDark
                      ? "bg-[#13002A]/70 border-purple-900"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold capitalize">{inv.plan}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        inv.status === "active"
                          ? "bg-teal-500/20 text-teal-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-2">
                    💰 Amount: <span className="text-gray-200">${inv.amount}</span>
                  </p>
                  <p className="text-gray-400 text-sm mb-2">
                    📈 Profit: <span className="text-teal-400">${inv.profit}</span>
                  </p>
                  <p className="text-gray-400 text-sm mb-2">
                    🕒 Time Left:{" "}
                    <span className="text-purple-400 font-semibold">{remaining}</span>
                  </p>
                  <p className="text-sm text-gray-400">⏳ Ends on: {endDate}</p>

                  {/* Progress Bar */}
                  <div
                    className={`mt-4 h-2 w-full rounded-full overflow-hidden ${
                      isDark ? "bg-gray-800" : "bg-gray-200"
                    }`}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-600 to-teal-500"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  {inv.status === "active" && (
                    <button
                      onClick={() => setConfirmModal(inv)}
                      className="mt-6 w-full py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold hover:opacity-90 transition"
                    >
                      🛑 Stop Investment
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* ✅ Stop Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`p-8 rounded-2xl shadow-xl w-[90%] max-w-sm text-center ${
                isDark ? "bg-[#13002A]/90 text-gray-100" : "bg-white"
              }`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-xl font-semibold mb-4">
                Are you sure you want to stop this investment?
              </h3>
              <p className="text-gray-400 mb-6">
                You will receive a refund of{" "}
                <span className="text-teal-400 font-bold">
                  ${confirmModal.amount}
                </span>{" "}
                back to your deposit balance.
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handleStopInvestment(confirmModal)}
                  disabled={stoppingId === confirmModal.id}
                  className={`px-5 py-2.5 rounded-lg font-semibold text-white ${
                    stoppingId === confirmModal.id
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-orange-500 hover:opacity-90"
                  }`}
                >
                  {stoppingId === confirmModal.id ? "Stopping..." : "Yes, Stop"}
                </button>

                <button
                  onClick={() => setConfirmModal(null)}
                  disabled={stoppingId === confirmModal.id}
                  className={`px-5 py-2.5 rounded-lg font-semibold ${
                    isDark
                      ? "bg-gray-700 text-gray-200"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
