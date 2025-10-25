"use client";

import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import LayoutWrapper from "./LayoutWrapper";
import { AuthProvider } from "@/context/AuthProvider";
import DarkModeToggle from "./DarkModeToggle";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative">
        <ThemeProvider>
          <AuthProvider>
            <LayoutWrapper>{children}</LayoutWrapper>

            {/* 🌗 Fixed Dark Mode Toggle Button */}
            <div className="fixed bottom-6 right-6 z-50">
              <DarkModeToggle />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
