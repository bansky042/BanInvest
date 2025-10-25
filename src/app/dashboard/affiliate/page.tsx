"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { Copy, CheckCircle, Users, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/createclient";
import { useRouter } from "next/navigation"; // ✅ Correct import

export default function AffiliatePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [referralLink, setReferralLink] = useState("");
  const [referrals, setReferrals] = useState(0);
  const [earnings, setEarnings] = useState(0);

  const router = useRouter(); // ✅ Initialize router properly

  useEffect(() => {
    const fetchUserAndStats = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        const username = user.user_metadata?.username || user.id;
        setReferralLink(`https://baninvest.com/register?ref=${username}`);

        // Fetch referral stats
        const { data: referralData, error: refErr } = await supabase
          .from("referrals")
          .select("*")
          .eq("referrer_id", user.id);

        if (!refErr && referralData) {
          setReferrals(referralData.length);
          const total = referralData.reduce(
            (sum, r) => sum + (r.reward_amount || 0),
            0
          );
          setEarnings(total);
        }
      } else {
        router.push("/auth/signin"); // ✅ Redirect only when user not found
      }
    };

    fetchUserAndStats();
  }, [router]); // ✅ Remove 'user' dependency to avoid premature redirect

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex min-h-screen flex-col md:flex-row transition-colors duration-500 ${
        isDark ? "bg-[#0A0018] text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`max-w-lg w-full rounded-2xl p-8 border shadow-xl text-center ${
            isDark
              ? "bg-[#13002A]/80 border-purple-900"
              : "bg-white border-gray-200"
          }`}
        >
          <motion.h1
            className="text-3xl font-bold mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            🤝 Affiliate Program
          </motion.h1>

          {user ? (
            <>
              <h3 className="text-xl font-semibold mb-3">Your Referral Link</h3>

              <div
                className={`flex items-center justify-between gap-3 p-3 rounded-lg border ${
                  isDark
                    ? "bg-[#0F001F] border-purple-900"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
                <span className="truncate text-sm">{referralLink}</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-teal-400 hover:text-teal-500 transition"
                >
                  {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                  <span className="text-xs font-medium">
                    {copied ? "Copied" : "Copy"}
                  </span>
                </button>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`p-5 rounded-xl border flex flex-col items-center shadow ${
                    isDark
                      ? "bg-[#0F001F] border-purple-900"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <Users size={28} className="text-teal-400 mb-2" />
                  <p className="text-lg font-bold">{referrals}</p>
                  <p className="text-sm text-gray-400">Total Referrals</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`p-5 rounded-xl border flex flex-col items-center shadow ${
                    isDark
                      ? "bg-[#0F001F] border-purple-900"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <DollarSign size={28} className="text-yellow-400 mb-2" />
                  <p className="text-lg font-bold">${earnings.toFixed(2)}</p>
                  <p className="text-sm text-gray-400">Total Earnings</p>
                </motion.div>
              </div>

              <p className="mt-8 text-sm text-gray-400 leading-relaxed">
                Share your link and earn{" "}
                <span className="text-teal-400 font-semibold">10%</span> from
                your friends’ first deposit!
              </p>
            </>
          ) : (
            <p className="text-gray-400">
              Please sign in to view your referral link and stats.
            </p>
          )}
        </motion.div>
      </main>
    </div>
  );
}
