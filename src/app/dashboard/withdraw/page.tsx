"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ArrowUpCircle } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/createclient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function WithdrawPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  const [coinType, setCoinType] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [withdrawableBalance, setWithdrawableBalance] = useState<number>(0);

  // ✅ Fetch user's withdrawable balance
  useEffect(() => {
    (async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          toast.error("You must be logged in.");
          return;
        }

        const { data, error } = await supabase
          .from("users")
          .select("profit_balance")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Balance Fetch Error:", error);
          toast.error("Failed to load balance");
          return;
        }

        setWithdrawableBalance(data?.profit_balance || 0);
      } catch (err) {
        console.error("Balance Fetch Exception:", err);
      }
    })();
  }, []);

  // ✅ Protect route: redirect if user not logged in
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

  // ✅ Handle withdrawal
  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    if (parseFloat(amount) > withdrawableBalance) {
      toast.error("Insufficient balance");
      return;
    }

    if (!coinType) {
      toast.error("Please select a crypto type");
      return;
    }

    if (!walletAddress.trim()) {
      toast.error("Please enter your wallet address");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("You must be logged in to withdraw.");
        setLoading(false);
        return;
      }

      const username = user.user_metadata?.username || user.email;
      const userEmail = user.email;

      // ✅ Insert withdrawal request
      const { error } = await supabase.from("withdrawals").insert([
        {
          user_id: user.id,
          username,
          coin_type: coinType,
          wallet_address: walletAddress,
          amount: parseFloat(amount),
          status: "pending",
        },
      ]);

      if (error) {
        console.error("Withdraw Error:", error);
        toast.error("Failed to submit withdrawal");
      } else {
        toast.success("Withdrawal request submitted!");
        setWithdrawableBalance((prev) => prev - parseFloat(amount));

        // ✅ Call the email API middleware
        try {
          await fetch("/api/withdrawal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username,
              userEmail,
              amount,
              coinType,
              walletAddress,
            }),
          });
        } catch (emailError) {
          console.error("Email sending error:", emailError);
          toast.error("Withdrawal created but failed to send email.");
        }

        setAmount("");
        setWalletAddress("");
        setCoinType("");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Unexpected Error:", err);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`max-w-xl mx-auto rounded-2xl p-8 shadow-lg border ${
            isDark
              ? "bg-[#13002A]/70 border-purple-900"
              : "bg-white border-gray-200"
          }`}
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-10"
          >
            🏦 Withdraw Funds
          </motion.h1>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-teal-400">
              <ArrowUpCircle className="text-white w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Available Balance</p>
              <h3 className="text-2xl font-bold">
                ${withdrawableBalance.toFixed(2)}
              </h3>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleWithdraw}>
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Crypto Type
              </label>
              <select
                value={coinType}
                onChange={(e) => setCoinType(e.target.value)}
                className={`w-full p-3 rounded-lg border outline-none ${
                  isDark
                    ? "bg-[#0F001F] border-purple-900 focus:border-teal-400"
                    : "bg-gray-50 border-gray-300 focus:border-teal-500"
                }`}
              >
                <option value="">Select...</option>
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="USDT">USDT (TRC20)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Your Wallet Address
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Paste your wallet address"
                className={`w-full p-3 rounded-lg border outline-none ${
                  isDark
                    ? "bg-[#0F001F] border-purple-900 focus:border-teal-400"
                    : "bg-gray-50 border-gray-300 focus:border-teal-500"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Withdraw Amount (USD)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className={`w-full p-3 rounded-lg border outline-none ${
                  isDark
                    ? "bg-[#0F001F] border-purple-900 focus:border-teal-400"
                    : "bg-gray-50 border-gray-300 focus:border-teal-500"
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-teal-500 hover:opacity-90"
              }`}
            >
              {loading ? "Submitting..." : "Request Withdrawal"}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
