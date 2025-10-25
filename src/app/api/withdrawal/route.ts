import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/nodemailer";
import { userWithdrawalTemplate, adminWithdrawalTemplate } from "@/lib/emailTemplates";

export async function POST(req: Request) {
  try {
    const { userEmail, username, amount, method } = await req.json();

    const adminEmail = process.env.ADMIN_EMAIL!;

    const userHTML = userWithdrawalTemplate(username, amount, method);
    const adminHTML = adminWithdrawalTemplate(username, userEmail, amount, method);

    await sendEmail(userEmail, "Withdrawal Request Submitted - BanMarket", userHTML);
    await sendEmail(adminEmail, "New Withdrawal Request - BanMarket", adminHTML);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Withdrawal Email API error:", error);
    return NextResponse.json({ error: "Failed to send withdrawal emails" }, { status: 500 });
  }
}
