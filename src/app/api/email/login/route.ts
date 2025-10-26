import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/nodemailer";
import { loginNotificationTemplate } from "@/lib/emailTemplates";

// Define the shape of expected request body
interface LoginNotificationRequest {
  userEmail: string;
  username?: string;
  ipAddress?: string;
  location?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginNotificationRequest;
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

    if (!result?.success) {
      console.error("❌ Email sending failed:", result?.error);
      return NextResponse.json(
        { success: false, error: result?.error || "Failed to send email" },
        { status: 500 }
      );
    }

    console.log(`✅ Login notification sent successfully to ${userEmail}`);
    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    console.error("❌ Login email API error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
