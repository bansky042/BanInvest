"use client";

import { useState,useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { Upload, Copy, CheckCircle } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/createclient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DepositPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  const [selectedCoin, setSelectedCoin] = useState("Bitcoin (BTC)");
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const walletAddresses: Record<string, string> = {
    "Bitcoin (BTC)": "bc1qxyz1234examplebtcaddress5678",
    "Ethereum (ETH)": "0xAbCdEf1234567890ExampleEthAddress",
    "USDT (TRC20)": "TA1xYzExampleTrc20WalletAddress9876",
    "BNB (BEP20)": "0xBnBExampleBep20WalletAddress4321",
  };

  

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddresses[selectedCoin]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ Handle deposit submission
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!amount || parseFloat(amount) <= 0)
    return toast.error("Enter a valid amount");

  setUploading(true);

  // ✅ Get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    toast.error("You must be logged in.");
    setUploading(false);
    return;
  }

  let proofUrl: string | null = null;

  // ✅ Upload proof if provided
  if (file) {
    const filePath = `deposits/${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("deposit_proofs") // your bucket
      .upload(filePath, file);

    if (uploadError) {
      console.error(uploadError);
      toast.error("Failed to upload payment proof");
      setUploading(false);
      return;
    }

    // ✅ Get public URL for proof
    const { data: urlData } = supabase.storage
      .from("deposit_proofs")
      .getPublicUrl(filePath);
    proofUrl = urlData.publicUrl;
  }

  // ✅ Insert deposit record into "deposits" table
  const { error } = await supabase.from("deposits").insert([
    {
      user_id: user.id,
      username: user.user_metadata?.username || user.email, // 👈 Added username
      coin_type: selectedCoin,
      amount: parseFloat(amount),
      payment_proof: proofUrl,
      status: "pending", // waiting for admin approval
    },
  ]);

  if (error) {
  console.error(error);
  toast.error("Failed to submit deposit");
} else {
  // ✅ Send email to user and admin
  await fetch("/api/send-deposit-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userEmail: user.email,
      username: user.user_metadata?.username || user.email,
      amount,
      coinType: selectedCoin,
    }),
  });

  toast.success("Deposit submitted successfully!");
  alert("Deposit submitted! Please wait for admin approval.");
  setAmount("");
  setFile(null);
  router.push("/dashboard");
}


  setUploading(false);
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
        {/* Deposit Card */}
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
          {/* Page Title */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-10"
          >
            💰 Deposit Funds
          </motion.h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Crypto Type */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Crypto Type
              </label>
              <select
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value)}
                className={`w-full p-3 rounded-lg border outline-none ${
                  isDark
                    ? "bg-[#0F001F] border-purple-900 focus:border-teal-400"
                    : "bg-gray-50 border-gray-300 focus:border-teal-500"
                }`}
              >
                <option>Bitcoin (BTC)</option>
                <option>Ethereum (ETH)</option>
                <option>USDT (TRC20)</option>
                <option>BNB (BEP20)</option>
              </select>
            </div>

            {/* Wallet Address */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Wallet Address
              </label>
              <div
                className={`flex items-center justify-between gap-2 p-3 rounded-lg border text-sm ${
                  isDark
                    ? "bg-[#0F001F] border-purple-900"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
                <span className="truncate">{walletAddresses[selectedCoin]}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-teal-400 hover:text-teal-500 transition"
                >
                  {copied ? (
                    <>
                      <CheckCircle size={18} />
                      <span className="text-xs">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      <span className="text-xs">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Deposit Amount */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Deposit Amount (USD)
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

            {/* Payment Proof */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Upload Payment Proof
              </label>
              <label
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer ${
                  isDark
                    ? "border-purple-800 hover:border-teal-400"
                    : "border-gray-300 hover:border-teal-500"
                }`}
              >
                <Upload className="w-8 h-8 mb-2" />
                <p className="text-sm">
                  {file ? file.name : "Click to upload proof (jpg, png, pdf)"}
                </p>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-teal-500 text-white font-semibold hover:opacity-90 transition-all"
            >
              {uploading ? "Submitting..." : "Submit Deposit"}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
