"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DarkModeToggle from "./DarkModeToggle";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // ✅ Hide Navbar & Footer on dashboard + auth pages
  const hideLayout =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/verify-otp") ||
    pathname?.startsWith("/forgot-password");

  return (
    <>
      {!hideLayout && <Navbar />}

      <main className="flex-grow">{children}</main>

      {!hideLayout && <Footer />}

      {/* 🌙 Floating Dark Mode Toggle */}
      <div className="fixed bottom-6 right-6 z-50">
        <DarkModeToggle />
      </div>
    </>
  );
}
