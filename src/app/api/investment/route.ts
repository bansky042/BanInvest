import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/nodemailer";
import {
  loginNotificationTemplate,
  userInvestmentTemplate,
  adminInvestmentTemplate,
  investmentCompletedTemplate,
  investmentStoppedTemplate,
  signupWelcomeTemplate,
} from "@/lib/emailTemplates";

/**
 * BanMarket Investment Email Route
 * Handles all transactional emails:
 * - New Investment
 * - Completed Investment
 * - Stopped Investment
 * - Welcome Email
 * - Login Notification
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, username, userEmail, amount, plan, profit, duration, ipAddress, location } = body;

    const adminEmail = process.env.ADMIN_EMAIL!;
    if (!type || !userEmail || !username) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ===============================
    // ✅ NEW INVESTMENT CREATED
    // ===============================
    if (type === "new") {
      const userHTML = userInvestmentTemplate(
        username,
        Number(amount).toFixed(2),
        plan,
        Number(profit).toFixed(2)
      );

      const adminHTML = adminInvestmentTemplate(
        username,
        userEmail,
        Number(amount).toFixed(2),
        plan
      );

      await sendEmail(userEmail, `✅ Investment Successful - ${plan}`, userHTML);
      await sendEmail(adminEmail, `📢 New Investment - ${username}`, adminHTML);
    }

    // ===============================
    // 💰 INVESTMENT COMPLETED
    // ===============================
    else if (type === "completed") {
      const html = investmentCompletedTemplate(
        username,
        Number(amount).toFixed(2),
        plan,
        Number(profit).toFixed(2)
      );

      await sendEmail(userEmail, "🎉 Investment Completed - BanMarket", html);
    }

    // ===============================
    // 🛑 INVESTMENT STOPPED
    // ===============================
    else if (type === "stopped") {
      const html = investmentStoppedTemplate(
        username,
        plan,
        Number(amount).toFixed(2)
      );

      await sendEmail(userEmail, "⚠️ Investment Stopped - BanMarket", html);
    }

    // ===============================
    // 👋 WELCOME EMAIL
    // ===============================
    else if (type === "welcome") {
      const html = signupWelcomeTemplate(username);
      await sendEmail(userEmail, "👋 Welcome to BanMarket!", html);
    }

    // ===============================
    // 🔔 LOGIN NOTIFICATION
    // ===============================
    else if (type === "login") {
      const html = loginNotificationTemplate(username, ipAddress, location);
      await sendEmail(userEmail, "🔔 Login Notification - BanMarket", html);
    }

    // ===============================
    // ❌ INVALID TYPE
    // ===============================
    else {
      return NextResponse.json({ error: "Invalid email type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
