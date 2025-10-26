import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Define type for incoming request body
interface CreateUserRequest {
  user_id: string;
  email: string;
  myReferralCode?: string;
  referralCode?: string | null;
}

export async function POST(req: Request) {
  try {
    const { user_id, email, myReferralCode, referralCode } =
      (await req.json()) as CreateUserRequest;

    // ✅ Validate required fields
    if (!user_id || !email) {
      return NextResponse.json(
        { error: "Missing user_id or email" },
        { status: 400 }
      );
    }

    // ✅ Check if user already exists (idempotent)
    const { data: existing, error: checkError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("id", user_id)
      .maybeSingle();

    if (checkError) {
      console.error("❌ Supabase check error:", checkError.message);
      return NextResponse.json(
        { error: "Failed to verify existing user" },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 200 }
      );
    }

    // ✅ Insert new user record
    const { error: insertError } = await supabaseAdmin.from("users").insert([
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
        referral_code: myReferralCode ?? null,
        referred_by: referralCode ?? null,
      },
    ]);

    if (insertError) {
      console.error("❌ Supabase insert error:", insertError.message);
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal server error";
    console.error("❌ Error in create-user API:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
