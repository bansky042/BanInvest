"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { JSX, useEffect, useState } from "react";
import { supabase } from "@/lib/createclient";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";
import { Coins, TrendingUp, Crown } from "lucide-react";

interface PlanInfo {
  name: string;
  profitRate: number;
  durationDays: number;
  min: number;
  max: number;
  icon: JSX.Element;
  gradient: string;
}

export default function InvestPlanPage() {
  const { plan } = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [depositBalance, setDepositBalance] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const planDetails: Record<string, PlanInfo> = {
    basic_plan: {
      name: "Basic Plan",
      profitRate: 40,
      durationDays: 7,
      min: 100,
      max: 999,
      icon: <Coins className="w-6 h-6" />,
      gradient: "from-purple-500 to-teal-400",
    },
    standard_plan: {
      name: "Standard Plan",
      profitRate: 75,
      durationDays: 14,
      min: 500,
      max: 4999,
      icon: <TrendingUp className="w-6 h-6" />,
      gradient: "from-green-400 to-teal-500",
    },
    premium_plan: {
      name: "Premium Plan",
      profitRate: 100,
      durationDays: 30,
      min: 1000,
      max: 10000,
      icon: <Crown className="w-6 h-6" />,
      gradient: "from-yellow-400 to-orange-500",
    },
  };

  const planKey = ((Array.isArray(plan) ? plan[0] : plan) ?? "basic_plan").toLowerCase();
  const selectedPlan = planDetails[planKey] || planDetails.basic_plan;

  // 🧠 Fetch session and user balances
  useEffect(() => {
    const fetchUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const sessionUser = sessionData.session?.user;
      if (!sessionUser) return;

      setUserId(sessionUser.id);
      setUserEmail(sessionUser.email || null);
      setUsername(sessionUser.user_metadata?.username || sessionUser.email?.split("@")[0] || "User");

      const { data, error } = await supabase
        .from("users")
        .select("deposit_balance, profit_balance")
        .eq("id", sessionUser.id)
        .single();

      if (!error && data) setDepositBalance(data.deposit_balance);
    };

    fetchUser();
  }, []);

  // ⚙️ Auto credit matured investments
  useEffect(() => {
    const creditMaturedInvestments = async () => {
      if (!userId) return;

      const now = new Date().toISOString();
      const { data: matured, error: fetchErr } = await supabase
        .from("investments")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")
        .lte("end_date", now);

      if (fetchErr || !matured || matured.length === 0) return;

      for (const inv of matured) {
        const { data: userData } = await supabase
          .from("users")
          .select("profit_balance")
          .eq("id", userId)
          .single();

        const newProfit = (userData?.profit_balance || 0) + inv.total_return;

        await supabase
          .from("users")
          .update({ profit_balance: newProfit })
          .eq("id", userId);

        await supabase
          .from("investments")
          .update({ status: "completed" })
          .eq("id", inv.id);
      }

      toast.success("Your matured investments have been credited 🎉");
    };

    creditMaturedInvestments();
  }, [userId]);

  // 💼 Handle new investment
  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return toast.error("Enter an amount to invest");

    const investAmount = parseFloat(amount);
    if (investAmount < selectedPlan.min || investAmount > selectedPlan.max)
      return toast.error(`Amount must be between $${selectedPlan.min} and $${selectedPlan.max}`);

    if (depositBalance === null || investAmount > depositBalance)
      return toast.error("Insufficient deposit balance");

    try {
      setLoading(true);
      if (!userId) {
        toast.error("Please log in first");
        router.push("/auth/signin");
        return;
      }

      const profit = (investAmount * selectedPlan.profitRate) / 100;
      const totalReturn = investAmount + profit;
      const startDate = new Date();
      const endDate = new Date(Date.now() + selectedPlan.durationDays * 24 * 60 * 60 * 1000);

      const { error: insertErr } = await supabase.from("investments").insert([
        {
          user_id: userId,
          plan: selectedPlan.name,
          amount: investAmount,
          profit: totalReturn,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          status: "active",
        },
      ]);

      if (insertErr) throw insertErr;

      // 💰 Deduct from deposit balance
      const newDepositBalance = depositBalance - investAmount;
      const { error: updateErr } = await supabase
        .from("users")
        .update({ deposit_balance: newDepositBalance })
        .eq("id", userId);

      if (updateErr) throw updateErr;

      // 📧 Send investment email notifications
      await fetch("/api/investment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "new",
          userEmail,
          username,
          amount: investAmount,
          plan: selectedPlan.name,
          profit,
          duration: selectedPlan.durationDays,
        }),
      });

      toast.success(
        `✅ You invested $${investAmount}. Expected profit: $${profit.toFixed(
          2
        )} in ${selectedPlan.durationDays} days.`
      );
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create investment.");
    } finally {
      setLoading(false);
    }
  };

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

  // 🌗 UI
  return (
    <div
      className={`min-h-screen flex transition-colors duration-500 ${
        isDark ? "bg-[#0A0018] text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Sidebar />

      <main className="flex-1 p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto"
        >
          <div
            className={`rounded-2xl shadow-xl p-8 border transition-all ${
              isDark ? "bg-[#13002A]/60 border-purple-900" : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full text-white bg-gradient-to-r ${selectedPlan.gradient}`}
            >
              {selectedPlan.icon}
            </div>

            <h2 className="text-3xl font-bold mb-2 text-center">{selectedPlan.name}</h2>
            <p className="text-center text-teal-400 font-semibold text-lg mb-4">
              {selectedPlan.profitRate}% Profit in {selectedPlan.durationDays} Days
            </p>

            <div
              className={`grid grid-cols-2 gap-4 text-center mb-6 p-4 rounded-lg ${
                isDark ? "bg-gray-900/40" : "bg-gray-100"
              }`}
            >
              <div>
                <p className="text-sm text-gray-400">Min Deposit</p>
                <p className="font-semibold">${selectedPlan.min}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Max Deposit</p>
                <p className="font-semibold">${selectedPlan.max}</p>
              </div>
            </div>

            <div
              className={`p-4 rounded-lg mb-6 ${
                isDark ? "bg-purple-900/30" : "bg-purple-50"
              }`}
            >
              <p className="text-sm text-gray-400">Your Deposit Balance</p>
              <p className="text-2xl font-bold text-teal-400">
                ${depositBalance ?? "0.00"}
              </p>
            </div>

            <form onSubmit={handleInvest}>
              <label className="block mb-2 text-sm font-semibold">Investment Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className={`w-full p-3 rounded-lg border mb-6 ${
                  isDark
                    ? "bg-gray-900 border-gray-700 text-gray-100"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-teal-500 text-white font-semibold hover:opacity-90 transition"
              >
                {loading ? "Processing..." : "Confirm Investment"}
              </button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
