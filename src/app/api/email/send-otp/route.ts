import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

// ✅ Secure Supabase Service Client (server-side only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // ✅ Check if user exists
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (userError) throw userError;
    if (!user) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    const userId = user.id;

    // ✅ Delete expired OTPs (older than 5 minutes)
    await supabase
      .from("user_otps")
      .delete()
      .lt("otp_created_at", new Date(Date.now() - 5 * 60 * 1000).toISOString());

    // ✅ Check if user already has a valid OTP (within 5 minutes)
    const { data: existingOtp } = await supabase
      .from("user_otps")
      .select("*")
      .eq("user_id", userId)
      .gt("otp_created_at", new Date(Date.now() - 5 * 60 * 1000).toISOString())
      .maybeSingle();

    if (existingOtp) {
      return NextResponse.json(
        { error: "You already have an active OTP. Please wait 5 minutes." },
        { status: 400 }
      );
    }

    // ✅ Generate a new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Insert OTP
    const { error: insertError } = await supabase.from("user_otps").insert([
      {
        user_id: userId,
        otp,
        otp_created_at: new Date().toISOString(),
      },
    ]);

    if (insertError) throw insertError;

    // ✅ Configure Nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Send OTP email
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
          <p>If you didn't request this, please ignore this email.</p>
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
