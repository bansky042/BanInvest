import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/nodemailer";
import { loginNotificationTemplate } from "@/lib/emailTemplates";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userEmail, username, ipAddress, location } = body || {};

    // ✅ Validate recipient email
    if (!userEmail || typeof userEmail !== "string" || !userEmail.includes("@")) {
      console.error("❌ Invalid or missing 'userEmail' in request:", userEmail);
      return NextResponse.json(
        { success: false, error: "Recipient email is missing or invalid." },
        { status: 400 }
      );
    }

    // ✅ Sanitize and default other fields
    const cleanUsername = username?.trim() || "User";
    const cleanIp = ipAddress?.trim() || "Unknown";
    const cleanLocation = location?.trim() || "Unknown";

    // ✅ Generate email HTML
    const html = loginNotificationTemplate(cleanUsername, cleanIp, cleanLocation);

    console.log(`📨 Sending login notification email to: ${userEmail}`);

    // ✅ Send email
    const result = await sendEmail(
      userEmail,
      "🔐 New Login Detected - BanMarket",
      html
    );

    if (!result.success) {
      console.error("❌ Email sending failed:", result.error);
      return NextResponse.json(
        { success: false, error: result.error || "Failed to send email" },
        { status: 500 }
      );
    }

    console.log(`✅ Login notification sent successfully to ${userEmail}`);
    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error: any) {
    console.error("❌ Login email API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
