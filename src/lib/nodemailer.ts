import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    // ✅ Validate environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Missing EMAIL_USER or EMAIL_PASS in environment variables");
    }

    // ✅ Validate recipient and message
    if (!to || typeof to !== "string" || !to.includes("@")) {
      throw new Error(`Invalid recipient email address: ${to}`);
    }
    if (!subject || !html) {
      throw new Error("Email subject or body is missing");
    }

    // ✅ Create reusable transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // use Gmail preset for reliability
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Define message
    const mailOptions = {
      from: `"BanMarket" <${process.env.EMAIL_USER}>`,
      to: to.trim(),
      subject: subject.trim(),
      html,
    };

    // ✅ Send and log result
    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent to ${to}: ${info.messageId || "No messageId"}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("❌ Email send error:", error.message || error);
    return { success: false, error: error.message || "Email sending failed" };
  }
}
