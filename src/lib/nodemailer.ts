import nodemailer, { type SentMessageInfo } from "nodemailer";

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendEmail(to: string, subject: string, html: string): Promise<EmailResponse> {
  try {
    // ✅ Validate environment variables
    const { EMAIL_USER, EMAIL_PASS } = process.env;
    if (!EMAIL_USER || !EMAIL_PASS) {
      throw new Error("Missing EMAIL_USER or EMAIL_PASS in environment variables");
    }

    // ✅ Validate recipient and message
    if (!to || typeof to !== "string" || !to.includes("@")) {
      throw new Error(`Invalid recipient email address: ${to}`);
    }
    if (!subject || !html) {
      throw new Error("Email subject or HTML body is missing");
    }

    // ✅ Create reusable transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    // ✅ Define message
    const mailOptions = {
      from: `"BanMarket" <${EMAIL_USER}>`,
      to: to.trim(),
      subject: subject.trim(),
      html,
    };

    // ✅ Send and log result
    const info: SentMessageInfo = await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent to ${to}: ${info.messageId || "No messageId"}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Email send error:", error.message);
      return { success: false, error: error.message };
    }

    console.error("❌ Unknown email error:", error);
    return { success: false, error: "Unknown email sending error" };
  }
}
