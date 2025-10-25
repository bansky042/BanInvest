"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3,
  Settings,
  Menu,
  X,
  Users,
  Clock,
  History,
  ChartLine,
  LogOut,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import { supabase } from "@/lib/createclient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Sidebar() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // 🔹 Navigation Links
  const navLinks = [
    { label: "Dashboard", icon: <BarChart3 />, href: "/dashboard" },
    { label: "Deposit", icon: <ArrowDownCircle />, href: "/dashboard/deposit" },
    { label: "Withdraw", icon: <ArrowUpCircle />, href: "/dashboard/withdraw" },
    { label: "Investment Plans", icon: <ChartLine />, href: "/dashboard/invest" },
    { label: "Investment History", icon: <Clock />, href: "/dashboard/investment-history" },
    { label: "Transaction History", icon: <History />, href: "/dashboard/transaction-history" },
    { label: "Affiliate", icon: <Users />, href: "/dashboard/affiliate" },
    { label: "Settings", icon: <Settings />, href: "/dashboard/settings" },
  ];

  // 🧠 Fetch logged-in user + profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          console.warn("⚠️ No active session in Sidebar");
          return;
        }

        const currentUser = session.user;
        setUser(currentUser);

        const { data: userProfile, error: profileError } = await supabase
          .from("users")
          .select("username, full_name, profile_image")
          .eq("id", currentUser.id)
          .single();

        if (profileError) throw profileError;
        setProfile(userProfile);
      } catch (err: any) {
        console.error("❌ Sidebar profile fetch error:", err.message || err);
        toast.error("Failed to load user profile");
      }
    };

    fetchUserProfile();
  }, []);

  // 🔹 Logout function
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success("Logged out successfully!");
      router.push("/"); // redirect to login page
    } catch (err: any) {
      console.error("❌ Logout error:", err.message || err);
      toast.error("Failed to log out");
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 z-40 w-64 min-h-screen p-6 flex flex-col gap-8 border-r transition-transform duration-500
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${isDark ? "border-purple-900 bg-[#120026]" : "border-gray-200 bg-white"}
          md:translate-x-0 md:flex`}
      >
        {/* Close Button (Mobile) */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-teal-400"
        >
          <X size={24} />
        </button>

        {/* Brand */}
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-500 to-teal-400 bg-clip-text text-transparent">
          BanInvest
        </h1>

        {/* 🧍 Profile Section */}
        <div className="flex items-center gap-4 border-b pb-4 border-gray-700/40">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-teal-400">
            <Image
              src={profile?.profile_image || "/default-avatar.png"}
              alt="Profile"
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <p className="font-semibold truncate max-w-[120px]">
              {profile?.username || profile?.full_name || user?.email || "Investor"}
            </p>
            <p className="text-sm text-gray-400">Active User</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-3 mt-4">
          {navLinks.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all ${
                isDark
                  ? "hover:bg-purple-900/30 text-gray-300 hover:text-teal-400"
                  : "hover:bg-teal-100 text-gray-700 hover:text-teal-700"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          {/* 🔹 Logout Button */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2 mt-4 rounded-lg font-medium transition-all w-full ${
              isDark
                ? "hover:bg-purple-900/30 text-gray-300 hover:text-red-500"
                : "hover:bg-red-100 text-gray-700 hover:text-red-600"
            }`}
          >
            <LogOut />
            Logout
          </button>
        </nav>
      </aside>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 md:hidden z-30"
        ></div>
      )}

      {/* Hamburger Menu */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden fixed top-4 right-4 p-2 z-50 rounded-md bg-gradient-to-r from-purple-600 to-teal-400 text-white shadow-lg"
        >
          <Menu size={24} />
        </button>
      )}
    </>
  );
}
