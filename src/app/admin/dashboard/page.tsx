"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/createclient";
import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import { Sun, Moon, User, Database, ArrowRight, Wallet, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function AdminDashboard() {
  const router = useRouter();
  const { theme } = useTheme();
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalUsers: 0,
    totalInvestments: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const loadAdminDashboard = async () => {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData?.user) {
          router.push("/admin/login");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("username, role")
          .eq("id", authData.user.id)
          .single();

        if (profileError || !profile || profile.role !== "admin") {
          router.push("/auth/signin");
          return;
        }

        setAdmin(profile);

        // Load metrics
        const [
          { count: deposits },
          { count: withdrawals },
          { count: users },
          { count: investments },
        ] = await Promise.all([
          supabase.from("deposits").select("*", { count: "exact", head: true }),
          supabase.from("withdrawals").select("*", { count: "exact", head: true }),
          supabase.from("users").select("*", { count: "exact", head: true }),
          supabase.from("investments").select("*", { count: "exact", head: true }),
        ]);

        setMetrics({
          totalDeposits: deposits || 0,
          totalWithdrawals: withdrawals || 0,
          totalUsers: users || 0,
          totalInvestments: investments || 0,
        });

        // Prepare hourly transaction chart data
        const [depositData, withdrawData, investmentData] = await Promise.all([
          supabase.from("deposits").select("created_at"),
          supabase.from("withdrawals").select("created_at"),
          supabase.from("investments").select("created_at"),
        ]);

        const groupByHour = (records: any[]) => {
          const result: Record<string, number> = {};
          records.forEach((r) => {
            const hour = new Date(r.created_at).getHours();
            result[hour] = (result[hour] || 0) + 1;
          });
          return result;
        };

        const dep = groupByHour(depositData.data || []);
        const wit = groupByHour(withdrawData.data || []);
        const inv = groupByHour(investmentData.data || []);

        const merged = Array.from({ length: 24 }, (_, hour) => ({
          hour: `${hour}:00`,
          deposits: dep[hour] || 0,
          withdrawals: wit[hour] || 0,
          investments: inv[hour] || 0,
        }));

        setChartData(merged);
      } catch (err) {
        console.error("Dashboard load error:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    loadAdminDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${theme === "dark" ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-600"}`}>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"} flex flex-col items-center py-10 px-4`}>
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {admin?.username || "Admin"} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Here’s what’s happening on your platform today.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 w-full max-w-6xl">
        {[
          {
            title: "Total Users",
            value: metrics.totalUsers,
            icon: <User className="w-5 h-5 text-blue-500" />,
            color: theme === "dark" ? "bg-blue-900/40" : "bg-blue-100",
          },
          {
            title: "Total Deposits",
            value: metrics.totalDeposits,
            icon: <Database className="w-5 h-5 text-green-500" />,
            color: theme === "dark" ? "bg-green-900/40" : "bg-green-100",
          },
          {
            title: "Total Withdrawals",
            value: metrics.totalWithdrawals,
            icon: <Wallet className="w-5 h-5 text-yellow-500" />,
            color: theme === "dark" ? "bg-yellow-900/40" : "bg-yellow-100",
          },
          {
            title: "Total Investments",
            value: metrics.totalInvestments,
            icon: <TrendingUp className="w-5 h-5 text-purple-500" />,
            color: theme === "dark" ? "bg-purple-900/40" : "bg-purple-100",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl p-6 shadow-lg flex items-center justify-between ${card.color}`}
          >
            <div>
              <h2 className="text-lg font-medium">{card.title}</h2>
              <p className="text-3xl font-bold">{card.value}</p>
            </div>
            <div className="p-3 rounded-full bg-white dark:bg-gray-800 shadow">
              {card.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <div className={`w-full max-w-6xl p-6 rounded-2xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
        <h2 className="text-xl font-semibold mb-4">Hourly Transaction Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="hour" />
            <YAxis />
          <Tooltip
  contentStyle={{
    backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF", // dark: gray-800
    color: theme === "dark" ? "#F9FAFB" : "#111827", // dark: gray-50, light: gray-900
    borderRadius: "0.75rem",
    border: "none",
    boxShadow:
      theme === "dark"
        ? "0 4px 12px rgba(0, 0, 0, 0.5)"
        : "0 4px 12px rgba(0, 0, 0, 0.1)",
  }}
  labelStyle={{
    color: theme === "dark" ? "#93C5FD" : "#2563EB", // light blue label for hour
    fontWeight: 600,
  }}
  itemStyle={{
    padding: "4px 0",
  }}
/>

            <Legend />
            <Line type="monotone" dataKey="deposits" stroke="#10B981" name="Deposits" />
            <Line type="monotone" dataKey="withdrawals" stroke="#F59E0B" name="Withdrawals" />
            <Line type="monotone" dataKey="investments" stroke="#8B5CF6" name="Investments" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Actions */}
      <motion.div
        className="flex flex-col sm:flex-row gap-6 w-full max-w-6xl justify-center mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <button
          onClick={() => router.push("/admin/deposit")}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition"
        >
          <Database className="w-5 h-5" /> View Deposit List <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => router.push("/admin/withdrawal")}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition"
        >
          <Wallet className="w-5 h-5" /> View Withdrawal List <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
