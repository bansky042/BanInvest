"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/createclient";
import { useTheme } from "../context/ThemeContext";
import Image from "next/image";
import { nanoid } from "nanoid";

interface AuthFormProps {
  type: "signin" | "signup";
}

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const params = useSearchParams();
  const { theme } = useTheme();
  const isSignup = type === "signup";
  const referralCodeFromURL = params.get("ref");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const generateReferralCode = () => `BAN-${nanoid(6).toUpperCase()}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErrorMsg("");

    try {
      if (isSignup) {
        // ===== SIGN UP FLOW =====
        if (!formData.email || !formData.password)
          throw new Error("Email and password are required.");
        if (formData.password !== formData.confirmPassword)
          throw new Error("Passwords do not match.");

        const referralCode = generateReferralCode();

        // ✅ Step 1: Supabase Auth signup
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        if (!data?.user) throw new Error("Failed to create user.");

        // ✅ Step 2: Insert user into `users` table
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            full_name: formData.fullName,
            username: formData.username,
            country: formData.country,
            phone: formData.phone,
            referral_code: referralCode,
            referred_by: referralCodeFromURL || null,
            deposit_balance: 0,
            profit_balance: 0,
            affiliate_balance: 0,
            profile_image_url: null,
            email: formData.email,
          },
        ]);
        if (insertError) throw insertError;

        // ✅ Step 3: Send Welcome Email
        await fetch("/api/email/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            username: formData.username || formData.fullName,
          }),
        });

        alert("✅ Account created! Please verify your email before signing in.");
        router.push("/");
      } else {
        // ✅ Step 3: Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: formData.email,
  password: formData.password,
});

if (error) throw error;

// ✅ Fetch IP & location data
let ipAddress = "Unknown";
let location = "Unknown";

try {
  const ipRes = await fetch("https://ipapi.co/json/");
  if (ipRes.ok) {
    const ipData = await ipRes.json();
    ipAddress = ipData.ip || "Unknown";
    location = `${ipData.city || "Unknown City"}, ${ipData.country_name || "Unknown Country"}`;
  }
} catch (err) {
  console.error("🌍 Failed to fetch location:", err);
}

// ✅ Send login notification email
await fetch("/api/email/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    userEmail: formData.email,
    username: formData.username || formData.fullName || "User",
    ipAddress,
    location,
  }),
});

router.push("/dashboard");


      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google OAuth
  const handleGoogleAuth = async () => {
  setLoading(true);
  setErrorMsg(""); // Clear previous errors

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/auth/callback", // 👈 Your frontend callback route
        queryParams: {
          access_type: "offline", // ensures refresh token
          prompt: "consent", // always ask permission
        },
      },
    });

    if (error) throw error;

    console.log("✅ Redirecting to Google...");
  } catch (err: any) {
    console.error("❌ Google OAuth error:", err.message);
    setErrorMsg(err.message || "Google sign-in failed");
  } finally {
    setLoading(false);
  }
};



  // ✅ Auto-redirect if user already logged in
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) router.push("/dashboard");
      }
    );
    return () => listener.subscription.unsubscribe();
  }, [router]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 ${
        theme === "dark"
          ? "bg-[#090013] bg-gradient-to-b from-purple-900/30 to-teal-900/30"
          : "bg-gradient-to-b from-white via-gray-50 to-gray-200"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl p-8 backdrop-blur-md border ${
          theme === "dark"
            ? "bg-[#0F001E]/80 border-purple-800/30 text-white"
            : "bg-white border-gray-300 text-gray-900"
        }`}
      >
        <h1
          className={`text-3xl font-bold text-center mb-6 bg-clip-text text-transparent ${
            theme === "dark"
              ? "bg-gradient-to-r from-purple-400 to-teal-400"
              : "bg-gradient-to-r from-purple-600 to-teal-500"
          }`}
        >
          {isSignup ? "Create Your Account" : "Welcome Back"}
        </h1>

        {errorMsg && (
          <p className="text-red-500 text-center mb-4 text-sm">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignup && (
            <>
              <InputField label="Full Name" name="fullName" theme={theme} onChange={handleChange} required />
              <InputField label="Username" name="username" theme={theme} onChange={handleChange} required />
              <InputField label="Country" name="country" placeholder="e.g., Nigeria" theme={theme} onChange={handleChange} required />
              <InputField label="Phone Number" name="phone" placeholder="+234 812 345 6789" theme={theme} onChange={handleChange} required />
            </>
          )}

          <InputField label="Email" name="email" type="email" theme={theme} onChange={handleChange} required />
          <InputField label="Password" name="password" type="password" theme={theme} onChange={handleChange} required />
          {isSignup && (
            <InputField label="Confirm Password" name="confirmPassword" type="password" theme={theme} onChange={handleChange} required />
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold shadow-lg transition-transform transform hover:scale-105 ${
              theme === "dark"
                ? "bg-gradient-to-r from-purple-600 to-teal-400 text-white"
                : "bg-gradient-to-r from-purple-500 to-teal-500 text-white"
            }`}
          >
            {loading
              ? "Please wait..."
              : isSignup
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className={`flex-1 ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`} />
          <span className={`px-3 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>or</span>
          <hr className={`flex-1 ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`} />
        </div>

        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-3 py-3 rounded-lg border transition-all font-medium ${
            theme === "dark"
              ? "border-gray-700 bg-[#1A002D] hover:bg-[#250043]"
              : "border-gray-300 bg-white hover:bg-gray-100"
          }`}
        >
          <Image src="/google.png" alt="Google Icon" width={20} height={20} />
          Continue with Google
        </button>

        <p className={`text-center text-sm mt-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <span
            onClick={() => router.push(isSignup ? "/auth/signin" : "/auth/signup")}
            className="cursor-pointer font-medium bg-gradient-to-r from-purple-500 to-teal-400 bg-clip-text text-transparent hover:opacity-80 transition"
          >
            {isSignup ? "Sign in" : "Sign up"}
          </span>
        </p>
      </div>
    </div>
  );
}

function InputField({ label, name, type = "text", placeholder, theme, onChange, required }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition ${
          theme === "dark"
            ? "bg-[#1A002D] border-purple-700/50 focus:ring-teal-400 text-white"
            : "bg-gray-100 border-gray-300 focus:ring-purple-400 text-gray-900"
        }`}
      />
    </div>
  );
}
