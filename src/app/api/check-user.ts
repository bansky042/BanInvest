import { supabase } from "@/lib/createclient";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  const { data, error } = await supabase.from("users").select("email").eq("email", email).single();

  return NextResponse.json({ exists: !!data });
}
