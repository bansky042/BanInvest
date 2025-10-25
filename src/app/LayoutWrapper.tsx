"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PropsWithChildren } from "react";

export default function LayoutWrapper({ children }: PropsWithChildren) {
  const pathname = usePathname();

  // ✅ Hide Navbar & Footer on dashboard and auth routes
  const hideLayout =
    pathname.startsWith("/dashboard") || pathname.startsWith("/auth") || pathname.startsWith("/admin") || pathname.startsWith("/not-found");

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}
