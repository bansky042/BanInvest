import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 🔒 Use the Supabase Service Role Key (only available on server)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // DO NOT expose this to the client
);

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("deposits")
      .select(`
        id,
        user_id,
        amount,
        coin_type,
        status,
        payment_proof,
        created_at,
        users (
          username,
          email
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Merge nested user data for cleaner frontend mapping
    const formatted = data.map((d) => ({
      ...d,
      username: d.users?.username || "Unknown",
      email: d.users?.email || "N/A",
    }));

    return NextResponse.json(formatted);
  } catch (err: any) {
    console.error("❌ Error fetching deposits:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
