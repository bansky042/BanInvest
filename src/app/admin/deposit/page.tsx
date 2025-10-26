"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/createclient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTheme } from "../../../context/ThemeContext";
import { Button } from "../../ui/button";

// Define deposit structure
interface Deposit {
  id: string;
  user_id: string;
  username?: string;
  coin_type?: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  payment_proof?: string;
  created_at: string;
}

// Define user structure
interface UserRecord {
  id: string;
  username?: string;
  email?: string;
  deposit_balance: number;
  role: string;
}

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const router = useRouter();
  const { theme } = useTheme();

  // ✅ Protect route - only allow admins
  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/signin");
        return;
      }

      const { data: userData, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || !userData) {
        toast.error("Unable to verify user role");
        router.push("/not-found");
        return;
      }

      if (userData.role !== "admin") {
        toast.error("Access denied: Admins only");
        router.push("/not-found");
        return;
      }

      setCheckingAdmin(false);
    };

    checkAdmin();
  }, [router]);

  // ✅ Fetch deposits
  useEffect(() => {
    if (checkingAdmin) return;

    const fetchDeposits = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("deposits")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        toast.error("Failed to load deposits");
      } else {
        setDeposits((data as Deposit[]) || []);
      }
      setLoading(false);
    };

    fetchDeposits();
  }, [checkingAdmin]);

  // ✅ Approve deposit
  const handleApprove = async (deposit: Deposit) => {
    try {
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("deposit_balance, username, email")
        .eq("id", deposit.user_id)
        .single<UserRecord>();

      if (userError || !user) throw userError;

      const newBalance =
        (user.deposit_balance || 0) + parseFloat(String(deposit.amount));

      const { error: updateBalanceError } = await supabase
        .from("users")
        .update({ deposit_balance: newBalance })
        .eq("id", deposit.user_id);

      if (updateBalanceError) throw updateBalanceError;

      const { error: approveError } = await supabase
        .from("deposits")
        .update({ status: "approved" })
        .eq("id", deposit.id);

      if (approveError) throw approveError;

      await fetch("/api/admin-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "deposit",
          status: "approved",
          username: user.username,
          userEmail: user.email,
          amount: deposit.amount,
        }),
      });

      setDeposits((prev) =>
        prev.map((d) =>
          d.id === deposit.id ? { ...d, status: "approved" } : d
        )
      );

      toast.success(`✅ Approved deposit for ${user.username}`);
    } catch (error) {
      console.error("Approve deposit error:", error);
      toast.error("Failed to approve deposit");
    }
  };

  // ✅ Reject deposit
  const handleReject = async (deposit: Deposit) => {
    try {
      const { error: rejectError } = await supabase
        .from("deposits")
        .update({ status: "rejected" })
        .eq("id", deposit.id);

      if (rejectError) throw rejectError;

      const { data: user, error: userError } = await supabase
        .from("users")
        .select("username, email")
        .eq("id", deposit.user_id)
        .single<UserRecord>();

      if (userError || !user) throw userError;

      await fetch("/api/admin-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "deposit",
          status: "rejected",
          username: user.username,
          userEmail: user.email,
          amount: deposit.amount,
          reason: "Admin rejected deposit request.",
        }),
      });

      setDeposits((prev) =>
        prev.map((d) =>
          d.id === deposit.id ? { ...d, status: "rejected" } : d
        )
      );

      toast.error(`🚫 Deposit rejected for ${user.username}`);
    } catch (error) {
      console.error("Reject deposit error:", error);
      toast.error("Failed to reject deposit");
    }
  };

  if (checkingAdmin)
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0A0018] text-gray-600 dark:text-gray-300">
        Checking admin privileges...
      </main>
    );

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#0A0018] text-gray-100"
          : "bg-gray-50 text-gray-900"
      } p-10`}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">💰 Deposit Management</h1>
      </div>

      {loading ? (
        <p>Loading deposits...</p>
      ) : deposits.length === 0 ? (
        <p>No deposits found.</p>
      ) : (
        <div
          className={`overflow-x-auto rounded-lg border transition-all ${
            theme === "dark"
              ? "border-gray-800 bg-[#13002A]"
              : "border-gray-300 bg-white"
          }`}
        >
          <table className="w-full border-collapse text-sm">
            <thead
              className={`text-left ${
                theme === "dark" ? "bg-[#1E003F]" : "bg-gray-100"
              }`}
            >
              <tr>
                <th className="p-3 font-semibold">#</th>
                <th className="p-3 font-semibold">Username</th>
                <th className="p-3 font-semibold">Coin Type</th>
                <th className="p-3 font-semibold">Amount</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Date</th>
                <th className="p-3 font-semibold">Proof</th>
                <th className="p-3 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((deposit, index) => (
                <tr
                  key={deposit.id}
                  className={`border-t transition-all ${
                    theme === "dark" ? "border-gray-800" : "border-gray-200"
                  } ${
                    deposit.status === "approved"
                      ? "bg-green-50 dark:bg-green-900/30"
                      : deposit.status === "rejected"
                      ? "bg-red-50 dark:bg-red-900/30"
                      : ""
                  }`}
                >
                  <td className="p-3 font-medium">{index + 1}</td>
                  <td className="p-3">{deposit.username}</td>
                  <td className="p-3">{deposit.coin_type}</td>
                  <td className="p-3">${deposit.amount}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        deposit.status === "approved"
                          ? "bg-green-200 text-green-800"
                          : deposit.status === "rejected"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {deposit.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {new Date(deposit.created_at).toLocaleString()}
                  </td>
                  <td className="p-3">
                    {deposit.payment_proof ? (
                      <a
                        href={deposit.payment_proof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View Proof
                      </a>
                    ) : (
                      "No Proof"
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {deposit.status === "pending" ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleApprove(deposit)}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(deposit)}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
