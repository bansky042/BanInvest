import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/nodemailer";
import {
  depositApprovedTemplate,
  depositRejectedTemplate,
  withdrawalApprovedTemplate,
  withdrawalRejectedTemplate,
} from "@/lib/emailTemplates";

// Define type for the expected request body
interface TransactionEmailRequest {
  type: "deposit" | "withdrawal";
  status: "approved" | "rejected";
  username: string;
  userEmail: string;
  amount: number;
  reason?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as TransactionEmailRequest;
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
        html = depositApprovedTemplate(username, String(amount));
        break;

      case "deposit_rejected":
        subject = "❌ Deposit Rejected - BanMarket";
        html = depositRejectedTemplate(username, String(amount), reason ?? "No reason provided");
        break;

      case "withdrawal_approved":
        subject = "💸 Withdrawal Approved - BanMarket";
        html = withdrawalApprovedTemplate(username, String(amount));
        break;

      case "withdrawal_rejected":
        subject = "🚫 Withdrawal Rejected - BanMarket";
        html = withdrawalRejectedTemplate(username, String(amount), reason ?? "No reason provided");
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
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to send transaction email.";
    console.error("❌ Email sending error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
