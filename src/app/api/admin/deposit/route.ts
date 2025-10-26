import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 🔒 Use the Supabase Service Role Key (only available on server)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // DO NOT expose this to the client
);

// Define type for the nested user relation
interface UserInfo {
  username: string | null;
  email: string | null;
}

// Define type for a deposit record
interface DepositRecord {
  id: string;
  user_id: string;
  amount: number;
  coin_type: string;
  status: string;
  payment_proof: string | null;
  created_at: string;
  users?: UserInfo | null;
}

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

    const formatted = (data as unknown as DepositRecord[]).map((d) => ({
      ...d,
      username: d.users?.username ?? "Unknown",
      email: d.users?.email ?? "N/A",
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("❌ Error fetching deposits:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
