import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/nodemailer";
import {
  depositApprovedTemplate,
  depositRejectedTemplate,
  withdrawalApprovedTemplate,
  withdrawalRejectedTemplate,
} from "@/lib/emailTemplates";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, status, username, userEmail, amount, reason } = body;

    // ✅ Validate required fields
    if (!userEmail || !username || !amount || !type || !status) {
      console.error("❌ Missing required fields:", body);
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    let subject = "";
    let html = "";

    // ✅ Determine email template
    switch (`${type}_${status}`) {
      case "deposit_approved":
        subject = "✅ Deposit Approved - BanMarket";
        html = depositApprovedTemplate(username, amount);
        break;

      case "deposit_rejected":
        subject = "❌ Deposit Rejected - BanMarket";
        html = depositRejectedTemplate(username, amount, reason || "No reason provided");
        break;

      case "withdrawal_approved":
        subject = "💸 Withdrawal Approved - BanMarket";
        html = withdrawalApprovedTemplate(username, amount);
        break;

      case "withdrawal_rejected":
        subject = "🚫 Withdrawal Rejected - BanMarket";
        html = withdrawalRejectedTemplate(username, amount, reason || "No reason provided");
        break;

      default:
        console.error("❌ Invalid type/status combination:", type, status);
        return NextResponse.json(
          { error: "Invalid type or status combination." },
          { status: 400 }
        );
    }

    // ✅ Send email
    console.log(`📧 Sending ${type} ${status} email to ${userEmail}`);
    const emailResult = await sendEmail(userEmail, subject, html);

    if (!emailResult) {
      console.error("❌ Failed to send email to:", userEmail);
      return NextResponse.json(
        { error: "Failed to send email." },
        { status: 500 }
      );
    }

    console.log("✅ Email sent successfully to:", userEmail);
    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error: any) {
    console.error("❌ Email sending error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send transaction email" },
      { status: 500 }
    );
  }
}
