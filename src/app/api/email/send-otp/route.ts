// src/app/api/email/send-otp/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

// ✅ Secure Supabase Service Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Must be set in Vercel/Env settings
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // ✅ Check user exists
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (userError) throw userError;
    if (!user) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Store OTP in user_otps
    const { error: otpError } = await supabase.from("user_otps").upsert([
      {
        user_id: user.id,
        otp,
        otp_created_at: new Date().toISOString(),
      },
    ]);

    if (otpError) throw otpError;

    // ✅ Setup Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Send email
    await transporter.sendMail({
      from: `"BanInvest Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family:Arial, sans-serif; color:#333;">
          <h2>🔐 Password Reset OTP</h2>
          <p>Your one-time password (OTP) is:</p>
          <h3 style="color:#4F46E5;">${otp}</h3>
          <p>This OTP will expire in <strong>5 minutes</strong>.</p>
        </div>
      `,
    });

    console.log(`✅ OTP sent to ${email}`);
    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (err: any) {
    console.error("❌ Send OTP Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
