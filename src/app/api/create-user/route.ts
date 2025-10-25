import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { user_id, email, myReferralCode, referralCode } = await req.json();

    if (!user_id || !email) {
      return NextResponse.json({ error: "Missing user_id or email" }, { status: 400 });
    }

    // ✅ Check if already exists (idempotent)
    const { data: existing } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("id", user_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ message: "User already exists" }, { status: 200 });
    }

    // ✅ Insert new user
    const { error } = await supabaseAdmin.from("users").insert([
      {
        id: user_id,
        email,
        full_name: "",
        username: "",
        country: "",
        phone: "",
        deposit_balance: 0,
        profit_balance: 0,
        referral_balance: 0,
        referral_code: myReferralCode,
        referred_by: referralCode || null,
      },
    ]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ Error in create-user API:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
