import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/nodemailer";
import { userDepositTemplate, adminDepositTemplate } from "@/lib/emailTemplates";

export async function POST(req: Request) {
  try {
    const { userEmail, username, amount, coinType } = await req.json();

    const adminEmail = process.env.ADMIN_EMAIL!;

    const userHTML = userDepositTemplate(username, amount, coinType);
    const adminHTML = adminDepositTemplate(username, userEmail, amount, coinType);

    await sendEmail(userEmail, "Deposit Received - Pending Approval", userHTML);
    await sendEmail(adminEmail, "New Deposit Alert - BanMarket", adminHTML);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email API error:", error);
    return NextResponse.json({ error: "Failed to send emails" }, { status: 500 });
  }
}
