"use client";

import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQ = () => {
  const { theme } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "How do I start investing?",
      a: "Create an account, deposit crypto, and choose a plan that suits your goals. Your investment begins immediately after confirmation.",
    },
    {
      q: "When do I receive my profits?",
      a: "Profits are automatically added to your profit balance once your investment duration ends. You can then withdraw or reinvest them.",
    },
    {
      q: "Is BanInvest secure?",
      a: "Absolutely. We use end-to-end encryption, multi-layer wallet security, and KYC verification to protect all accounts.",
    },
    {
      q: "What investment plans are available?",
      a: "We currently offer Basic (40% ROI), Standard (75% ROI), and Premium (100% ROI) plans — each with different durations and returns.",
    },
    {
      q: "Can I withdraw my funds anytime?",
      a: "Withdrawals are allowed after your investment matures. For active investments, you must wait until the duration ends.",
    },
    {
      q: "How long does withdrawal approval take?",
      a: "Withdrawals are processed within minutes once approved by our system or admin team.",
    },
    {
      q: "Do I need KYC verification?",
      a: "Yes. All users must upload valid KYC documents to comply with security and anti-fraud policies before investing or withdrawing.",
    },
    {
      q: "Can I reinvest my profit?",
      a: "Yes, you can reinvest directly from your profit balance into any plan without needing to deposit again.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className={`py-20 px-6 md:px-16 transition-colors duration-500 ${
        theme === "dark"
          ? "bg-[#070012] text-white"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <h3
        className={`text-3xl font-bold text-center mb-12 bg-clip-text text-transparent ${
          theme === "dark"
            ? "bg-gradient-to-r from-purple-400 to-teal-400"
            : "bg-gradient-to-r from-purple-600 to-teal-500"
        }`}
      >
        Frequently Asked Questions
      </h3>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className={`rounded-xl border transition-all duration-300 overflow-hidden ${
              theme === "dark"
                ? "bg-[#110024] border-purple-800 hover:border-teal-400/50"
                : "bg-white border-gray-300 hover:border-teal-400/30"
            }`}
          >
            <button
              onClick={() => toggleFAQ(i)}
              className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
            >
              <h4
                className={`font-semibold text-lg ${
                  theme === "dark" ? "text-teal-400" : "text-teal-600"
                }`}
              >
                {faq.q}
              </h4>
              {openIndex === i ? (
                <ChevronUp
                  className={`${
                    theme === "dark" ? "text-teal-400" : "text-teal-600"
                  }`}
                />
              ) : (
                <ChevronDown
                  className={`${
                    theme === "dark" ? "text-teal-400" : "text-teal-600"
                  }`}
                />
              )}
            </button>

            {openIndex === i && (
              <div
                className={`px-5 pb-5 text-sm leading-relaxed transition-all duration-500 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
