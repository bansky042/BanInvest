"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import { useTheme } from "@/context/ThemeContext";
import { Wallet, TrendingUp, BarChart3 } from "lucide-react";
import Loader from "@/components/Loader";
import { supabase } from "@/lib/createclient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import OngoingInvestments from "@/components/OngoingInvestments";

export default function DashboardPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("Investor");
  const [balances, setBalances] = useState({
    deposit_balance: 0,
    profit_balance: 0,
    referral_balance: 0,
  });
  const [transactions, setTransactions] = useState<any[]>([]);

  // ✅ Fetch dashboard data + user
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 🔐 Get current session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          toast.error("Please sign in to access your dashboard");
          router.push("/auth/signin");
          return;
        }

        const currentUser = session.user;
        setUser(currentUser);

        // 🧾 Fetch user info
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("username, deposit_balance, profit_balance, referral_balance")
          .eq("id", currentUser.id)
          .single();

        if (userError) throw userError;

        setUsername(userData?.username || "Investor");
        setBalances({
          deposit_balance: userData?.deposit_balance || 0,
          profit_balance: userData?.profit_balance || 0,
          referral_balance: userData?.referral_balance || 0,
        });

        // 💳 Fetch deposits
        const { data: deposits, error: depErr } = await supabase
          .from("deposits")
          .select("id, amount, status, created_at")
          .eq("user_id", currentUser.id);

        if (depErr) throw depErr;

        // 💸 Fetch withdrawals
        const { data: withdrawals, error: witErr } = await supabase
          .from("withdrawals")
          .select("id, amount, status, created_at")
          .eq("user_id", currentUser.id);

        if (witErr) throw witErr;

        // Combine
        const combined = [
          ...(deposits?.map((d) => ({ ...d, type: "Deposit" })) || []),
          ...(withdrawals?.map((w) => ({ ...w, type: "Withdrawal" })) || []),
        ]
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .slice(0, 5);

        setTransactions(combined);
      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  // ✅ Handle redirect if not logged in (MUST be before any return)
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  // 🌀 Loader
  if (loading) return <Loader />;

  const balanceCards = [
    {
      title: "Deposit Balance",
      amount: `$${Number(balances.deposit_balance).toLocaleString()}`,
      icon: <Wallet />,
      color: "from-purple-500 to-teal-400",
    },
    {
      title: "Profit Balance",
      amount: `$${Number(balances.profit_balance).toLocaleString()}`,
      icon: <TrendingUp />,
      color: "from-green-400 to-teal-500",
    },
    {
      title: "Referral Earnings",
      amount: `$${Number(balances.referral_balance).toLocaleString()}`,
      icon: <BarChart3 />,
      color: "from-yellow-400 to-orange-500",
    },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row transition-colors duration-500 ${
        isDark ? "bg-[#0A0018] text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Sidebar collapses on mobile */}
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-10 space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Welcome Back, <span className="text-teal-400">{username} 👋</span>
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Manage your investments, deposits, and transactions in one place.
            </p>
          </div>
        </motion.div>

        {/* 💰 Balance Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {balanceCards.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl shadow-lg border relative overflow-hidden ${
                isDark
                  ? "bg-[#13002A]/80 border-purple-900"
                  : "bg-white border-gray-200"
              }`}
            >
              <div
                className={`absolute inset-0 opacity-10 bg-gradient-to-r ${b.color}`}
              />
              <div className="relative z-10">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-xl mb-4 bg-gradient-to-r ${b.color} text-white`}
                >
                  {b.icon}
                </div>
                <h4 className="text-lg font-medium mb-1">{b.title}</h4>
                <p className="text-3xl font-bold tracking-tight">{b.amount}</p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* 💼 Ongoing Investments */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`rounded-2xl border shadow-lg p-6 ${
              isDark
                ? "bg-[#13002A]/60 border-purple-900"
                : "bg-white border-gray-200"
            }`}
          >
            <OngoingInvestments />
          </motion.div>
        </section>

        {/* 📊 Recent Transactions */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`rounded-2xl border shadow-lg overflow-hidden ${
              isDark
                ? "bg-[#13002A]/60 border-purple-900"
                : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`px-6 py-4 border-b flex justify-between items-center ${
                isDark
                  ? "border-purple-900 bg-[#1B0035]"
                  : "border-gray-200 bg-gray-100"
              }`}
            >
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <button
                onClick={() => router.push("/transactions")}
                className="text-sm text-teal-400 hover:underline"
              >
                View All
              </button>
            </div>

            {transactions.length === 0 ? (
              <p className="text-center text-gray-400 py-6">
                No transactions found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead>
                    <tr
                      className={`${
                        isDark
                          ? "bg-[#1B0035] text-gray-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <th className="px-6 py-3 text-left">Type</th>
                      <th className="px-6 py-3 text-left">Amount</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className={`border-t ${
                          isDark
                            ? "border-gray-800 hover:bg-purple-900/10"
                            : "border-gray-200 hover:bg-gray-50"
                        } transition`}
                      >
                        <td className="px-6 py-4 font-medium">{tx.type}</td>
                        <td className="px-6 py-4">${tx.amount}</td>
                        <td
                          className={`px-6 py-4 font-semibold ${
                            tx.status?.toLowerCase() === "approved" ||
                            tx.status?.toLowerCase() === "completed"
                              ? "text-teal-400"
                              : tx.status?.toLowerCase() === "pending"
                              ? "text-yellow-400"
                              : "text-red-400"
                          }`}
                        >
                          {tx.status}
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </section>
      </main>
    </div>
  );
}
