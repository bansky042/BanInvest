import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/nodemailer";
import { signupWelcomeTemplate } from "@/lib/emailTemplates";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userEmail, username } = body || {};

    // ✅ Validate recipient email
    if (!userEmail || typeof userEmail !== "string" || !userEmail.includes("@")) {
      console.error("❌ Invalid or missing 'userEmail' in request:", userEmail);
      return NextResponse.json(
        { success: false, error: "Recipient email is missing or invalid." },
        { status: 400 }
      );
    }

    // ✅ Sanitize username
    const cleanUsername = username?.trim() || "User";

    // ✅ Generate email HTML
    const html = signupWelcomeTemplate(cleanUsername);

    console.log(`📨 Sending signup welcome email to: ${userEmail}`);

    // ✅ Send email
    const result = await sendEmail(
      userEmail,
      "🎉 Welcome to BanMarket!",
      html
    );

    if (!result.success) {
      console.error("❌ Email sending failed:", result.error);
      return NextResponse.json(
        { success: false, error: result.error || "Failed to send email" },
        { status: 500 }
      );
    }

    console.log(`✅ Signup welcome email sent successfully to ${userEmail}`);
    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error: any) {
    console.error("❌ Signup welcome email API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
