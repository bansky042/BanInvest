"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function AboutPage() {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen pt-24 pb-16 transition-colors duration-500 ${
        isDark
          ? "bg-[#090013] text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`text-4xl sm:text-5xl font-extrabold text-center bg-clip-text text-transparent ${
            isDark
              ? "bg-gradient-to-r from-purple-500 to-teal-400"
              : "bg-gradient-to-r from-purple-700 to-teal-600"
          }`}
        >
          About BanInvest
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-center mt-4 text-lg ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Building a smarter, transparent, and rewarding crypto investment future.
        </motion.p>

        {/* Content */}
        <div className="mt-16 grid md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2
              className={`text-2xl font-semibold ${
                isDark ? "text-teal-400" : "text-teal-600"
              }`}
            >
              Our Mission
            </h2>
            <p
              className={`leading-relaxed ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              At{" "}
              <span
                className={`font-semibold ${
                  isDark ? "text-purple-400" : "text-purple-700"
                }`}
              >
                BanInvest
              </span>
              , our mission is to empower individuals to grow their crypto
              investments confidently through automation, transparency, and
              expert-backed tools.
            </p>

            <p
              className={`leading-relaxed ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              We believe in bridging the gap between technology and trust —
              enabling every investor, new or experienced, to take full control
              of their financial future with minimal risk and maximum insight.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src="/about-illustration.svg"
              alt="Crypto Growth"
              className={`rounded-2xl shadow-lg border ${
                isDark
                  ? "border-purple-800/30"
                  : "border-purple-300/40"
              }`}
            />
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Transparency",
              desc: "Every transaction and growth metric is visible, secure, and verifiable in real-time.",
            },
            {
              title: "Innovation",
              desc: "We leverage blockchain, analytics, and automation to optimize your returns.",
            },
            {
              title: "Community",
              desc: "Our growing network of users and investors drives collective success.",
            },
          ].map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className={`p-6 rounded-2xl border shadow-md transition-colors duration-500 ${
                isDark
                  ? "bg-gradient-to-br from-purple-900/30 to-teal-900/20 border-purple-800/40"
                  : "bg-gradient-to-br from-purple-100 to-teal-50 border-purple-300/50"
              }`}
            >
              <h3
                className={`text-xl font-semibold mb-2 ${
                  isDark ? "text-teal-300" : "text-teal-700"
                }`}
              >
                {value.title}
              </h3>
              <p
                className={`${
                  isDark ? "text-gray-400" : "text-gray-700"
                }`}
              >
                {value.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
