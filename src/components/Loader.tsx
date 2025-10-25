"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#0A0018] via-[#120026] to-[#1A0035] text-white z-[9999]">
      {/* Rotating gradient ring */}
      <motion.div
        className="relative w-24 h-24 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-400 border-r-purple-600"></div>
        <Loader2 className="w-8 h-8 text-teal-400 animate-pulse" />
      </motion.div>

      {/* Brand text with glow */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-2xl font-bold bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg"
      >
        BanInvest Loading...
      </motion.h1>

      {/* Sub glow effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="mt-4 w-3/12 h-1 rounded-full bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500"
      ></motion.div>
    </div>
  );
}
