"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import Sidebar from "@/components/Sidebar";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { supabase } from "@/lib/createclient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function TransactionHistoryPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/signin");
        return;
      }

      try {
        setLoading(true);

        // Fetch deposits
        const { data: deposits, error: depError } = await supabase
          .from("deposits")
          .select("id, amount, status, created_at")
          .eq("user_id", user.id);

        if (depError) throw depError;

        // Fetch withdrawals
        const { data: withdrawals, error: wdError } = await supabase
          .from("withdrawals")
          .select("id, amount, status, created_at")
          .eq("user_id", user.id);

        if (wdError) throw wdError;

        // Format both and merge
        const formattedDeposits = (deposits || []).map((d) => ({
          id: d.id,
          type: "Deposit",
          amount: `$${Number(d.amount).toLocaleString()}`,
          status: d.status || "Pending",
          date: new Date(d.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        }));

        const formattedWithdrawals = (withdrawals || []).map((w) => ({
          id: w.id,
          type: "Withdrawal",
          amount: `$${Number(w.amount).toLocaleString()}`,
          status: w.status || "Pending",
          date: new Date(w.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        }));

        // Merge & sort by date
        const all = [...formattedDeposits, ...formattedWithdrawals].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setTransactions(all);
      } catch (err: any) {
        console.error("Error fetching transactions:", err.message);
        toast.error("Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [router]);

  return (
    <div
      className={`min-h-screen flex transition-colors duration-500 ${
        isDark ? "bg-[#0A0018] text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold flex items-center gap-2">
            💳 Transaction History
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            View all your deposits and withdrawals in one place.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-2xl overflow-hidden border shadow-xl ${
            isDark ? "bg-[#13002A]/60 border-purple-900" : "bg-white border-gray-200"
          }`}
        >
          {loading ? (
            <div className="p-10 text-center text-gray-400">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              No transactions found yet.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className={isDark ? "bg-[#1B0035]" : "bg-gray-100"}>
                <tr>
                  <th className="p-4 text-left">Type</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-t ${
                      isDark ? "border-gray-800" : "border-gray-200"
                    } hover:bg-purple-900/10 transition`}
                  >
                    <td className="p-4 flex items-center gap-2 font-medium">
                      {tx.type === "Deposit" ? (
                        <ArrowDownCircle className="text-green-400" size={18} />
                      ) : (
                        <ArrowUpCircle className="text-red-400" size={18} />
                      )}
                      {tx.type}
                    </td>
                    <td className="p-4">{tx.amount}</td>
                    <td
                      className={`p-4 font-semibold ${
                        tx.status === "approved"
                          ? "text-teal-400"
                          : tx.status === "Pending"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          tx.status === "Completed"
                            ? "bg-teal-500/10"
                            : tx.status === "Pending"
                            ? "bg-yellow-500/10"
                            : "bg-red-500/10"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">{tx.date}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </main>
    </div>
  );
}
