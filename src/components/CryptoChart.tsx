"use client";

import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

type Coin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: { price: number[] };
};

export default function CryptoMarketTable() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    async function fetchCoins() {
      try {
        const res = await fetch("/api/coins", { cache: "no-store" }); // ✅ Use local API route
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setCoins(data);
      } catch (err) {
        console.error("Error fetching coins:", err);
        setError("Failed to load crypto data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchCoins();
    const interval = setInterval(fetchCoins, 60000); // auto-refresh every 1 min
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[300px]">
        <motion.div
          className="w-12 h-12 border-4 border-t-teal-400 border-purple-600 rounded-full animate-spin"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-400 py-10 text-sm font-medium">
        {error}
      </p>
    );

  return (
    <div
      className={`py-16 transition-colors duration-500 ${
        isDark ? "bg-[#0a0118] text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`text-3xl font-extrabold text-center mb-10 ${
            isDark
              ? "bg-gradient-to-r from-purple-500 to-teal-400 bg-clip-text text-transparent"
              : "bg-gradient-to-r from-purple-700 to-teal-600 bg-clip-text text-transparent"
          }`}
        >
          Live Crypto Market
        </motion.h2>

        <div
          className={`overflow-x-auto rounded-2xl border shadow-lg transition-all duration-500 ${
            isDark
              ? "bg-gradient-to-br from-purple-900/30 to-teal-900/20 border-purple-800/40"
              : "bg-gradient-to-br from-purple-100 to-teal-100 border-gray-200"
          }`}
        >
          <table
            className={`w-full text-left text-sm transition-colors ${
              isDark ? "text-gray-300" : "text-gray-800"
            }`}
          >
            <thead
              className={`uppercase ${
                isDark ? "bg-gray-900/60 text-gray-400" : "bg-gray-100 text-gray-600"
              }`}
            >
              <tr>
                <th className="px-6 py-4">Coin</th>
                <th className="px-6 py-4">Price (USD)</th>
                <th className="px-6 py-4">24h Change</th>
                <th className="px-6 py-4">Trend</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin) => (
                <motion.tr
                  key={coin.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className={`border-b transition ${
                    isDark
                      ? "border-gray-800 hover:bg-gray-900/40"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{coin.name}</p>
                      <p className="text-xs uppercase text-gray-500">{coin.symbol}</p>
                    </div>
                  </td>

                  <td className="px-6 py-4 font-medium">
                    ${coin.current_price.toLocaleString()}
                  </td>

                  <td
                    className={`px-6 py-4 font-semibold ${
                      coin.price_change_percentage_24h >= 0
                        ? "text-teal-400"
                        : "text-red-400"
                    }`}
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </td>

                  <td className="px-6 py-4 w-[120px]">
                    <ResponsiveContainer width="100%" height={40}>
                      <LineChart
                        data={coin.sparkline_in_7d.price.map((p) => ({ pv: p }))}
                      >
                        <Line
                          type="monotone"
                          dataKey="pv"
                          stroke={
                            coin.price_change_percentage_24h >= 0
                              ? "#14b8a6"
                              : "#ef4444"
                          }
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
