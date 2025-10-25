"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/createclient";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();
  const { user, loading } = useAuth();

  const bgColor =
    theme === "dark"
      ? "bg-[#090013]/80 border-purple-900/40 text-gray-100"
      : "bg-white/70 border-gray-200 text-gray-900";

  const hoverEffect =
    theme === "dark"
      ? "hover:text-teal-400 hover:bg-purple-900/30"
      : "hover:text-purple-700 hover:bg-gray-100";

  const shadowColor =
    theme === "dark" ? "shadow-purple-900/40" : "shadow-gray-300/50";

  async function handleLogout() {
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 shadow-md backdrop-blur-md border-b transition-all duration-500 ${bgColor} ${shadowColor}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link
          href="/"
          className={`text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-teal-400 ${
            theme === "dark" ? "" : "brightness-110"
          }`}
        >
          BanInvest
        </Link>

        {/* Desktop Navigation */}
        <ul
          className={`hidden lg:flex space-x-6 font-medium transition-colors duration-300 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          <li>
            <Link href="/" className={`px-3 py-2 rounded-lg ${hoverEffect}`}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className={`px-3 py-2 rounded-lg ${hoverEffect}`}>
              About
            </Link>
          </li>
          {user && (
            <>
              <li>
                <Link href="/dashboard" className={`px-3 py-2 rounded-lg ${hoverEffect}`}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/plans" className={`px-3 py-2 rounded-lg ${hoverEffect}`}>
                  Plans
                </Link>
              </li>
            </>
          )}
          <li>
            <Link href="/contact" className={`px-3 py-2 rounded-lg ${hoverEffect}`}>
              Contact
            </Link>
          </li>
        </ul>

        {/* User Actions */}
        <div className={`hidden ${isOpen ? "hidden" : "lg:flex"} items-center gap-3`}>
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/dashboard"
                    className="bg-gradient-to-r from-teal-400 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-transform"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full text-sm font-semibold text-white transition-transform hover:scale-105"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push("/auth/signin")}
                    className="border border-purple-500 text-purple-400 hover:bg-purple-600/20 px-4 py-2 rounded-full font-semibold transition"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => router.push("/auth/signup")}
                    className="bg-gradient-to-r from-purple-600 to-teal-400 text-white px-5 py-2 rounded-full font-semibold hover:scale-105 transform transition"
                  >
                    Create Account
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`lg:hidden p-2 rounded ${
            theme === "dark"
              ? "hover:bg-purple-900/40 text-gray-300"
              : "hover:bg-gray-200 text-gray-800"
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className={`lg:hidden border-t backdrop-blur-md ${
              theme === "dark"
                ? "border-purple-800 bg-[#0b001b]/95 text-gray-300"
                : "border-gray-200 bg-white/90 text-gray-800"
            }`}
          >
            <div className="flex flex-col space-y-3 px-6 py-4 font-medium">
              {[
                { name: "Home", path: "/" },
                { name: "About", path: "/about" },
                ...(user
                  ? [
                      { name: "Dashboard", path: "/dashboard" },
                      { name: "Plans", path: "/plans" },
                    ]
                  : []),
                { name: "Contact", path: "/contact" },
              ].map(({ name, path }) => (
                <Link
                  key={name}
                  href={path}
                  onClick={() => setIsOpen(false)}
                  className={`block rounded-lg px-3 py-2 ${hoverEffect}`}
                >
                  {name}
                </Link>
              ))}

              {/* Mobile User/CTA */}
              {!loading && (
                <>
                  {user ? (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-semibold mt-4 hover:scale-105 transition-transform"
                    >
                      Logout
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2 mt-3">
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          router.push("/auth/signin");
                        }}
                        className="border border-purple-500 text-purple-400 hover:bg-purple-600/20 px-4 py-2 rounded-full font-semibold"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          router.push("/auth/signup");
                        }}
                        className="bg-gradient-to-r from-purple-600 to-teal-400 text-white px-4 py-2 rounded-full font-semibold hover:scale-105 transition-transform"
                      >
                        Create Account
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
