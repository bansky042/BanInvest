"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/createclient";
import { nanoid } from "nanoid";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const url = window.location.href;
        const code = new URL(url).searchParams.get("code");

        // Step 1: Exchange code (if present)
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(url);
          if (error) console.warn("⚠️ exchangeCodeForSession error:", error.message);
        }

        // Step 2: Always get current session
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;

        if (!user) {
          console.error("❌ No user found — redirecting to login");
          router.replace("/login");
          return;
        }

        console.log("✅ Authenticated as:", user.email);

        // Step 3: Check if user exists
        const { data: existingUser, error: fetchError } = await supabase
          .from("users")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        if (fetchError) {
          console.error("❌ Fetch error:", fetchError.message);
          router.replace("/login");
          return;
        }

        // Step 4: If user exists → dashboard
        if (existingUser) {
          console.log("✅ Existing user:", user.email);
          router.replace("/dashboard");
          return;
        }

        // Step 5: If new user → safely insert
        const referralCode = `BAN-${nanoid(6).toUpperCase()}`;
        const fullName =
          user.user_metadata?.full_name || user.email?.split("@")[0];

        const { error: insertError } = await supabase.from("users").upsert(
          [
            {
              id: user.id,
              full_name: fullName,
              email: user.email,
              referral_code: referralCode,
              deposit_balance: 0,
              profit_balance: 0,
              affiliate_balance: 0,
              country: null,
              phone: null,
              referred_by: null,
              profile_image_url: user.user_metadata?.avatar_url || null,
            },
          ],
          { onConflict: "id" } // 👈 prevents duplicate key errors
        );

        if (insertError) {
          console.error("❌ Insert error:", insertError.message);
          router.replace("/login");
          return;
        }

        console.log("🆕 New user record created:", user.email);
        router.replace("/complete-profile");
      } catch (err) {
        console.error("🔥 Unexpected OAuth error:", err);
        router.replace("/login");
      }
    };

    handleOAuthCallback();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Completing sign-in...</p>
    </div>
  );
}
