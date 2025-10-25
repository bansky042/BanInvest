"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/createclient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTheme } from "../../../context/ThemeContext";
import { BarChart3, CheckCircle, Clock, XCircle } from "lucide-react";

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  // ✅ Protect route for admin users
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return router.push("/auth/signin");

      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        toast.error("Access denied — Admins only");
        router.push("/not-found");
      }
    };
    checkAdmin();
  }, [router]);

  // ✅ Fetch all withdrawals
  useEffect(() => {
    const fetchWithdrawals = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("withdrawals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) toast.error("Failed to load withdrawals");
      else setWithdrawals(data || []);

      setLoading(false);
    };
    fetchWithdrawals();
  }, []);

  const handleApprove = async (withdrawal: any) => {
  try {
    const { data: userRecord, error: userErr } = await supabase
      .from("users")
      .select("profit_balance, email, username")
      .eq("id", withdrawal.user_id)
      .single();

    if (userErr || !userRecord) throw new Error("User not found.");

    const currentBalance = parseFloat(userRecord.profit_balance || 0);
    if (currentBalance < withdrawal.amount)
      return toast.error("Insufficient balance for withdrawal.");

    const newBalance = currentBalance - withdrawal.amount;

    // ✅ Update balance and mark withdrawal approved
    const { error: updateError } = await supabase
      .from("users")
      .update({ profit_balance: newBalance })
      .eq("id", withdrawal.user_id);

    if (updateError) throw updateError;

    await supabase
      .from("withdrawals")
      .update({ status: "approved" })
      .eq("id", withdrawal.id);

    // ✅ Optional: Send notification email
    if (userRecord.email) {
      await fetch("/api/admin-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "withdrawal",
          status: "approved",
          username: userRecord.username || "User",
          userEmail: userRecord.email,
          amount: withdrawal.amount,
        }),
      });
    }

    // ✅ Update local state
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === withdrawal.id ? { ...w, status: "approved" } : w
      )
    );

    // ✅ Safe toast
    toast.success(
      `✅ Approved withdrawal for ${userRecord?.username ?? "User"}`
    );
  } catch (err: any) {
    console.error("Approve withdrawal error:", err.message || err);
    toast.error("Failed to approve withdrawal");
  }
};


  const handleReject = async (withdrawal: any) => {
    try {
      await supabase.from("withdrawals").update({ status: "rejected" }).eq("id", withdrawal.id);
      toast.error("Withdrawal rejected");
      setWithdrawals((prev) =>
        prev.map((w) => (w.id === withdrawal.id ? { ...w, status: "rejected" } : w))
      );
    } catch (err) {
      toast.error("Failed to reject withdrawal");
    }
  };

  // ✅ Summary counts
  const total = withdrawals.length;
  const approved = withdrawals.filter((w) => w.status === "approved").length;
  const pending = withdrawals.filter((w) => w.status === "pending").length;
  const rejected = withdrawals.filter((w) => w.status === "rejected").length;

  return (
    <main
      className={`min-h-screen p-8 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#0A0018] text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold mb-2">🏦 Withdrawal Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage and monitor all user withdrawal requests in real time.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
        <SummaryCard
          title="Total Withdrawals"
          value={total}
          color="bg-gradient-to-r from-blue-500 to-indigo-500"
          icon={<BarChart3 className="w-6 h-6" />}
        />
        <SummaryCard
          title="Approved"
          value={approved}
          color="bg-gradient-to-r from-green-500 to-emerald-500"
          icon={<CheckCircle className="w-6 h-6" />}
        />
        <SummaryCard
          title="Pending"
          value={pending}
          color="bg-gradient-to-r from-yellow-500 to-amber-500"
          icon={<Clock className="w-6 h-6" />}
        />
        <SummaryCard
          title="Rejected"
          value={rejected}
          color="bg-gradient-to-r from-red-500 to-rose-500"
          icon={<XCircle className="w-6 h-6" />}
        />
      </div>

      {/* Withdrawal Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-x-auto rounded-xl shadow-lg border dark:border-purple-900"
      >
        <table className="min-w-full text-sm">
          <thead
            className={`text-left ${
              theme === "dark"
                ? "bg-purple-800 text-white"
                : "bg-purple-600 text-white"
            }`}
          >
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Coin Type</th>
              <th className="px-4 py-3">Wallet</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  Loading withdrawals...
                </td>
              </tr>
            ) : withdrawals.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No withdrawal requests found.
                </td>
              </tr>
            ) : (
              withdrawals.map((withdrawal) => (
                <tr
                  key={withdrawal.id}
                  className={`border-t transition ${
                    withdrawal.status === "approved"
                      ? "bg-green-50 dark:bg-green-900/30"
                      : withdrawal.status === "rejected"
                      ? "bg-red-50 dark:bg-red-900/30"
                      : "bg-white dark:bg-[#13002A]/50 hover:bg-gray-100 dark:hover:bg-purple-900/40"
                  }`}
                >
                  <td className="px-4 py-3">{withdrawal.username}</td>
                  <td className="px-4 py-3">{withdrawal.coin_type}</td>
                  <td className="px-4 py-3">{withdrawal.wallet_address}</td>
                  <td className="px-4 py-3 font-semibold">
                    ${withdrawal.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 capitalize">{withdrawal.status}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(withdrawal.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {withdrawal.status === "pending" ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleApprove(withdrawal)}
                          className="px-3 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(withdrawal)}
                          className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        No action needed
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </main>
  );
}

const SummaryCard = ({
  title,
  value,
  color,
  icon,
}: {
  title: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`${color} text-white p-5 rounded-2xl shadow-lg flex items-center justify-between`}
  >
    <div>
      <h2 className="text-sm font-medium opacity-80">{title}</h2>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
    {icon}
  </motion.div>
);
