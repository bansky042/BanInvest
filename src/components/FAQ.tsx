"use client";

import { useTheme } from "../context/ThemeContext";

const FAQ = () => {
  const { theme } = useTheme();

  const faqs = [
    {
      q: "How do I start investing?",
      a: "Create an account, deposit crypto, and choose a plan that suits your goals.",
    },
    {
      q: "When do I receive my profits?",
      a: "Profits are automatically credited to your balance based on your plan duration.",
    },
    {
      q: "Is BanInvest secure?",
      a: "Absolutely. We use industry-grade encryption and multi-layer wallet protection.",
    },
  ];

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

      <div className="max-w-3xl mx-auto space-y-6">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className={`p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
              theme === "dark"
                ? "bg-[#110024] border-purple-800 hover:border-teal-400/50"
                : "bg-white border-gray-300 hover:border-teal-400/30"
            }`}
          >
            <h4
              className={`font-semibold mb-2 ${
                theme === "dark" ? "text-teal-400" : "text-teal-600"
              }`}
            >
              {faq.q}
            </h4>
            <p
              className={`${
                theme === "dark" ? "text-gray-400" : "text-gray-700"
              }`}
            >
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
