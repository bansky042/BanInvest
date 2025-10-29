// src/app/api/email/verify-otp/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-side service role key
);

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required." },
        { status: 400 }
      );
    }

    console.log("🔍 Verify OTP request for:", email);

    // 1) Find user by email
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", email)
      .maybeSingle();

    if (userError) {
      console.error("❌ Supabase user fetch error:", userError);
      return NextResponse.json({ error: "Server error fetching user." }, { status: 500 });
    }
    if (!user) {
      console.log("⚠️ User not found for email:", email);
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // 2) Find OTP record by user_id
    const { data: otpRecord, error: otpError } = await supabase
      .from("user_otps")
      .select("id, user_id, otp, otp_created_at")
      .eq("user_id", user.id)
      .maybeSingle();

    console.log("📦 OTP lookup result:", { otpRecord, otpError });

    if (otpError) {
      console.error("❌ Supabase OTP fetch error:", otpError);
      return NextResponse.json({ error: "Server error fetching OTP." }, { status: 500 });
    }
    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid or expired OTP." }, { status: 400 });
    }

    // 3) Validate OTP text match
    if ((otpRecord.otp ?? "").trim() !== otp.trim()) {
      return NextResponse.json({ error: "Incorrect OTP code." }, { status: 400 });
    }

    

    // 5) Optional: clear OTP to prevent reuse
    const { error: delError } = await supabase
      .from("user_otps")
      .delete()
      .eq("id", otpRecord.id);

    if (delError) {
      console.warn("⚠️ Failed to delete used OTP:", delError);
      // Not fatal — continue
    }

    // 6) Success — respond (frontend can redirect to reset page)
    return NextResponse.json({ success: true, message: "OTP verified." }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Verify OTP server error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
