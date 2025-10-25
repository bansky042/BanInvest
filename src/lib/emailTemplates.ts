export function userDepositTemplate(username: string, amount: string, coinType: string) {
  return `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f7f8; padding: 30px;">
    <div style="max-width: 600px; background: #ffffff; margin: auto; border-radius: 10px; box-shadow: 0 3px 10px rgba(0,0,0,0.1); overflow: hidden;">
      <div style="background: linear-gradient(135deg, #6B46C1, #319795); padding: 20px; text-align: center;">
        <h2 style="color: white; margin: 0;">💰 Deposit Received</h2>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #333;">Hi <strong>${username}</strong>,</p>
        <p style="font-size: 15px; color: #555;">We’ve received your deposit of <strong style="color:#319795;">$${amount}</strong> in <strong>${coinType}</strong>.</p>
        <p style="font-size: 15px; color: #555;">Your transaction is now pending approval. We’ll notify you once it’s approved and your balance is updated.</p>

        <div style="margin: 25px 0; padding: 15px; background: #f3f4f6; border-left: 5px solid #6B46C1; border-radius: 6px;">
          <p style="margin: 0; font-size: 14px; color: #444;">
            <strong>Amount:</strong> $${amount}<br/>
            <strong>Coin Type:</strong> ${coinType}<br/>
            <strong>Status:</strong> Pending Approval
          </p>
        </div>

        <p style="font-size: 14px; color: #888;">Thank you for choosing <strong>BanMarket</strong>.<br/>We’re glad to have you onboard!</p>
      </div>
      <div style="background: #f3f3f3; text-align: center; padding: 15px; font-size: 13px; color: #777;">
        © ${new Date().getFullYear()} BanMarket. All rights reserved.
      </div>
    </div>
  </div>
  `;
}

export function adminDepositTemplate(username: string, userEmail: string, amount: string, coinType: string) {
  return `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f7f8; padding: 30px;">
    <div style="max-width: 600px; background: #ffffff; margin: auto; border-radius: 10px; box-shadow: 0 3px 10px rgba(0,0,0,0.1); overflow: hidden;">
      <div style="background: linear-gradient(135deg, #6B46C1, #319795); padding: 20px; text-align: center;">
        <h2 style="color: white; margin: 0;">🚨 New Deposit Alert</h2>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #333;">Hello Admin,</p>
        <p style="font-size: 15px; color: #555;">A new deposit has been made on BanMarket by <strong>${username}</strong>.</p>

        <div style="margin: 25px 0; padding: 15px; background: #f3f4f6; border-left: 5px solid #319795; border-radius: 6px;">
          <p style="margin: 0; font-size: 14px; color: #444;">
            <strong>User:</strong> ${username}<br/>
            <strong>Email:</strong> ${userEmail}<br/>
            <strong>Amount:</strong> $${amount}<br/>
            <strong>Coin Type:</strong> ${coinType}<br/>
            <strong>Status:</strong> Pending Approval
          </p>
        </div>

        <a href="https://yourdomain.com/admin/dashboard" 
           style="display:inline-block; background:#6B46C1; color:white; text-decoration:none; padding:10px 20px; border-radius:6px; font-weight:600;">
           Review Deposit
        </a>

        <p style="font-size: 13px; color: #888; margin-top: 20px;">This is an automated alert from BanMarket.</p>
      </div>
      <div style="background: #f3f3f3; text-align: center; padding: 15px; font-size: 13px; color: #777;">
        © ${new Date().getFullYear()} BanMarket Admin Notification
      </div>
    </div>
  </div>
  `;
}
 
// 🏦 WITHDRAWAL EMAILS
export function userWithdrawalTemplate(
  username: string,
  amount: string,
  method: string
) {
  return `
  <div style="font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f7f7f8; padding: 30px;">
    <div style="max-width: 600px; background: #ffffff; margin: auto; border-radius: 10px; box-shadow: 0 3px 10px rgba(0,0,0,0.1); overflow: hidden;">
      <div style="background: linear-gradient(135deg, #E53E3E, #DD6B20); padding: 20px; text-align: center;">
        <h2 style="color: white; margin: 0;">💸 Withdrawal Requested</h2>
      </div>
      <div style="padding: 30px;">
        <p>Hi <strong>${username}</strong>,</p>
        <p>We’ve received your withdrawal request of <strong style="color:#E53E3E;">$${amount}</strong> via <strong>${method}</strong>.</p>
        <p>Your request is currently under review and will be processed shortly.</p>

        <div style="margin: 25px 0; padding: 15px; background: #f9fafb; border-left: 5px solid #E53E3E; border-radius: 6px;">
          <p style="margin: 0;">
            <strong>Amount:</strong> $${amount}<br/>
            <strong>Method:</strong> ${method}<br/>
            <strong>Status:</strong> Pending Approval
          </p>
        </div>

        <p style="font-size: 14px; color: #777;">Thank you for choosing <strong>BanMarket</strong>. We’ll notify you once your withdrawal is processed.</p>
      </div>
      <div style="background: #f3f3f3; text-align: center; padding: 15px; font-size: 13px; color: #777;">
        © ${new Date().getFullYear()} BanMarket. All rights reserved.
      </div>
    </div>
  </div>`;
}

export function adminWithdrawalTemplate(
  username: string,
  userEmail: string,
  amount: string,
  method: string
) {
  return `
  <div style="font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f7f7f8; padding: 30px;">
    <div style="max-width: 600px; background: #ffffff; margin: auto; border-radius: 10px; box-shadow: 0 3px 10px rgba(0,0,0,0.1); overflow: hidden;">
      <div style="background: linear-gradient(135deg, #E53E3E, #DD6B20); padding: 20px; text-align: center;">
        <h2 style="color: white; margin: 0;">🚨 New Withdrawal Request</h2>
      </div>
      <div style="padding: 30px;">
        <p>Hello Admin,</p>
        <p>User <strong>${username}</strong> has requested a withdrawal.</p>

        <div style="margin: 25px 0; padding: 15px; background: #f9fafb; border-left: 5px solid #DD6B20; border-radius: 6px;">
          <p style="margin: 0;">
            <strong>User:</strong> ${username}<br/>
            <strong>Email:</strong> ${userEmail}<br/>
            <strong>Amount:</strong> $${amount}<br/>
            <strong>Method:</strong> ${method}<br/>
            <strong>Status:</strong> Pending Review
          </p>
        </div>

        <a href="https://banmarket.com/admin/withdrawals"
           style="display:inline-block; background:#E53E3E; color:white; padding:10px 20px; border-radius:6px; text-decoration:none;">
          Review Withdrawal
        </a>

        <p style="font-size: 13px; color: #888; margin-top: 20px;">This is an automated alert from BanMarket.</p>
      </div>
      <div style="background: #f3f3f3; text-align: center; padding: 15px; font-size: 13px; color: #777;">
        © ${new Date().getFullYear()} BanMarket Admin Notification
      </div>
    </div>
  </div>`;
}


/// ===============================================
// ✅ BANMARKET EMAIL TEMPLATES
// ===============================================

export function loginNotificationTemplate(username: string, ipAddress?: string, location?: string) {
  return `
  <div style="font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f7f7f8; padding: 30px;">
    <div style="max-width: 600px; background: #fff; margin: auto; border-radius: 10px; box-shadow: 0 3px 10px rgba(0,0,0,0.1); overflow: hidden;">
      <div style="background: linear-gradient(135deg, #6B46C1, #319795); padding: 20px; text-align: center;">
        <h2 style="color: white; margin: 0;">🔐 Login Notification</h2>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #333;">Hi <strong>${username}</strong>,</p>
        <p style="font-size: 15px; color: #555;">A new login was detected on your BanMarket account.</p>
        <div style="background: #f3f4f6; border-left: 5px solid #6B46C1; padding: 15px; border-radius: 6px;">
          <p style="margin: 0; font-size: 14px; color: #444;">
            <strong>IP Address:</strong> ${ipAddress || "Unknown"}<br/>
            <strong>Location:</strong> ${location || "Not Available"}<br/>
            <strong>Time:</strong> ${new Date().toLocaleString()}
          </p>
        </div>
        <p style="font-size: 14px; color: #666; margin-top: 15px;">
          If this wasn’t you, please reset your password immediately.
        </p>
      </div>
      <div style="background: #f3f3f3; text-align: center; padding: 15px; font-size: 13px; color: #777;">
        © ${new Date().getFullYear()} BanMarket Security Center
      </div>
    </div>
  </div>`;
}

// -------------------------------------------------

// 💼 USER INVESTMENT TEMPLATE
export function userInvestmentTemplate(username: string, amount: string, plan: string, profit: string) {
  return `
  <div style="font-family: 'Segoe UI', sans-serif; background:#f9fafb; padding:30px;">
    <div style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 3px 10px rgba(0,0,0,0.1)">
      <div style="background:linear-gradient(135deg,#6B46C1,#319795);padding:20px;text-align:center;">
        <h2 style="color:#fff;margin:0;">🎯 New Investment Created</h2>
      </div>
      <div style="padding:30px;">
        <p>Hi <strong>${username}</strong>,</p>
        <p>You've successfully invested <strong>$${amount}</strong> in the <strong>${plan}</strong>.</p>
        <div style="background:#f9fafb;border-left:5px solid #6B46C1;padding:15px;border-radius:6px;margin:25px 0;">
          <p style="margin:0;"><strong>Plan:</strong> ${plan}<br/><strong>Amount:</strong> $${amount}<br/><strong>Expected Profit:</strong> $${profit}</p>
        </div>
        <p style="font-size:14px;color:#777;">We'll notify you once your investment matures.</p>
      </div>
      <div style="background:#f3f3f3;padding:15px;text-align:center;font-size:13px;color:#777;">© ${new Date().getFullYear()} BanMarket</div>
    </div>
  </div>`;
}

// 📢 ADMIN INVESTMENT ALERT
export function adminInvestmentTemplate(username: string, email: string, amount: string, plan: string) {
  return `
  <div style="font-family:'Segoe UI',sans-serif;background:#f7f7f8;padding:30px;">
    <div style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 3px 10px rgba(0,0,0,0.1)">
      <div style="background:linear-gradient(135deg,#6B46C1,#319795);padding:20px;text-align:center;">
        <h2 style="color:#fff;margin:0;">🚀 New Investment Alert</h2>
      </div>
      <div style="padding:30px;">
        <p>Hello Admin,</p>
        <p><strong>${username}</strong> has made a new investment.</p>
        <div style="background:#f9fafb;border-left:5px solid #319795;padding:15px;border-radius:6px;margin:25px 0;">
          <p style="margin:0;"><strong>User:</strong> ${username}<br/><strong>Email:</strong> ${email}<br/><strong>Plan:</strong> ${plan}<br/><strong>Amount:</strong> $${amount}</p>
        </div>
        <a href="https://banmarket.com/admin/investments" style="display:inline-block;background:#6B46C1;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;">View Dashboard</a>
      </div>
      <div style="background:#f3f3f3;padding:15px;text-align:center;font-size:13px;color:#777;">© ${new Date().getFullYear()} BanMarket Admin Notification</div>
    </div>
  </div>`;
}

// 💰 INVESTMENT COMPLETED
export function investmentCompletedTemplate(username: string, amount: string, plan: string, profit: string) {
  return `
  <div style="font-family:'Segoe UI',sans-serif;background:#f9fafb;padding:30px;">
    <div style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 3px 10px rgba(0,0,0,0.1)">
      <div style="background:linear-gradient(135deg,#319795,#38B2AC);padding:20px;text-align:center;">
        <h2 style="color:#fff;margin:0;">🎉 Investment Completed</h2>
      </div>
      <div style="padding:30px;">
        <p>Hi <strong>${username}</strong>,</p>
        <p>Your <strong>${plan}</strong> investment of <strong>$${amount}</strong> has matured successfully!</p>
        <div style="background:#f9fafb;border-left:5px solid #38B2AC;padding:15px;border-radius:6px;margin:25px 0;">
          <p style="margin:0;"><strong>Total Profit Credited:</strong> $${profit}</p>
        </div>
        <p style="font-size:14px;color:#777;">Your earnings have been added to your profit balance. 🎊</p>
      </div>
      <div style="background:#f3f3f3;padding:15px;text-align:center;font-size:13px;color:#777;">© ${new Date().getFullYear()} BanMarket</div>
    </div>
  </div>`;
}

// -------------------------------------------------

export function investmentStoppedTemplate(username: string, plan: string, amount: string) {
  return `
  <div style="font-family:'Segoe UI', Tahoma, sans-serif; background-color:#f7f7f8; padding:30px;">
    <div style="max-width:600px; background:#fff; margin:auto; border-radius:10px; box-shadow:0 3px 10px rgba(0,0,0,0.1); overflow:hidden;">
      <div style="background:linear-gradient(135deg,#E53E3E,#DD6B20); padding:20px; text-align:center;">
        <h2 style="color:white; margin:0;">⚠️ Investment Stopped</h2>
      </div>
      <div style="padding:30px;">
        <p style="font-size:16px; color:#333;">Hi <strong>${username}</strong>,</p>
        <p style="font-size:15px; color:#555;">Your <strong>${plan}</strong> investment has been stopped manually.</p>
        <div style="margin:25px 0; padding:15px; background:#f3f4f6; border-left:5px solid #E53E3E; border-radius:6px;">
          <p style="margin:0; font-size:14px; color:#444;">
            <strong>Plan:</strong> ${plan}<br/>
            <strong>Amount:</strong> $${amount}<br/>
            <strong>Status:</strong> Stopped
          </p>
        </div>
        <p style="font-size:14px; color:#666;">Any pending profits have been forfeited as per policy.</p>
      </div>
      <div style="background:#f3f3f3; text-align:center; padding:15px; font-size:13px; color:#777;">
        © ${new Date().getFullYear()} BanMarket Support Team
      </div>
    </div>
  </div>`;
}

// -------------------------------------------------

export function signupWelcomeTemplate(username: string) {
  return `
  <div style="font-family:'Segoe UI', Tahoma, sans-serif; background-color:#f7f7f8; padding:30px;">
    <div style="max-width:600px; background:#fff; margin:auto; border-radius:10px; box-shadow:0 3px 10px rgba(0,0,0,0.1); overflow:hidden;">
      <div style="background:linear-gradient(135deg,#6B46C1,#319795); padding:20px; text-align:center;">
        <h2 style="color:white; margin:0;">🎉 Welcome to BanMarket!</h2>
      </div>
      <div style="padding:30px;">
        <p style="font-size:16px; color:#333;">Hi <strong>${username}</strong>,</p>
        <p style="font-size:15px; color:#555;">We’re thrilled to have you join the BanMarket community!</p>
        <p style="font-size:15px; color:#555;">You can now deposit, invest, and earn profits securely on our platform.</p>
        <a href="https://yourdomain.com/dashboard"
           style="display:inline-block; background:#319795; color:white; text-decoration:none; padding:10px 20px; border-radius:6px; font-weight:600;">
           Go to Dashboard
        </a>
      </div>
      <div style="background:#f3f3f3; text-align:center; padding:15px; font-size:13px; color:#777;">
        © ${new Date().getFullYear()} BanMarket. All rights reserved.
      </div>
    </div>
  </div>`;
}
export function depositApprovedTemplate(username: string, amount: string) {
  return `
  <div style="font-family:'Segoe UI', Tahoma, sans-serif; background-color:#f7f7f8; padding:30px;">
    <div style="max-width:600px; background:#fff; margin:auto; border-radius:10px; box-shadow:0 3px 10px rgba(0,0,0,0.1); overflow:hidden;">
      <div style="background:linear-gradient(135deg,#38A169,#319795); padding:20px; text-align:center;">
        <h2 style="color:white; margin:0;">💰 Deposit Approved</h2>
      </div>
      <div style="padding:30px;">
        <p style="font-size:16px; color:#333;">Hi <strong>${username}</strong>,</p>
        <p style="font-size:15px; color:#555;">Your deposit of <strong>$${amount}</strong> has been approved successfully.</p>
        <div style="margin:25px 0; padding:15px; background:#f3f4f6; border-left:5px solid #38A169; border-radius:6px;">
          <p style="margin:0; font-size:14px; color:#444;">
            <strong>Amount:</strong> $${amount}<br/>
            <strong>Status:</strong> Approved
          </p>
        </div>
        <p style="font-size:14px; color:#666;">The amount has been credited to your wallet. You can now proceed with investments.</p>
      </div>
      <div style="background:#f3f3f3; text-align:center; padding:15px; font-size:13px; color:#777;">
        © ${new Date().getFullYear()} BanMarket Support Team
      </div>
    </div>
  </div>`;
}
export function depositRejectedTemplate(username: string, amount: string, reason?: string) {
  return `
  <div style="font-family:'Segoe UI', Tahoma, sans-serif; background-color:#f7f7f8; padding:30px;">
    <div style="max-width:600px; background:#fff; margin:auto; border-radius:10px; box-shadow:0 3px 10px rgba(0,0,0,0.1); overflow:hidden;">
      <div style="background:linear-gradient(135deg,#E53E3E,#DD6B20); padding:20px; text-align:center;">
        <h2 style="color:white; margin:0;">❌ Deposit Rejected</h2>
      </div>
      <div style="padding:30px;">
        <p style="font-size:16px; color:#333;">Hi <strong>${username}</strong>,</p>
        <p style="font-size:15px; color:#555;">Unfortunately, your deposit of <strong>$${amount}</strong> was rejected.</p>
        <div style="margin:25px 0; padding:15px; background:#f3f4f6; border-left:5px solid #E53E3E; border-radius:6px;">
          <p style="margin:0; font-size:14px; color:#444;">
            <strong>Amount:</strong> $${amount}<br/>
            <strong>Status:</strong> Rejected<br/>
            ${reason ? `<strong>Reason:</strong> ${reason}<br/>` : ""}
          </p>
        </div>
        <p style="font-size:14px; color:#666;">Please review the information and try again, or contact support for help.</p>
      </div>
      <div style="background:#f3f3f3; text-align:center; padding:15px; font-size:13px; color:#777;">
        © ${new Date().getFullYear()} BanMarket Support Team
      </div>
    </div>
  </div>`;
}
export function withdrawalApprovedTemplate(username: string, amount: string) {
  return `
  <div style="font-family:'Segoe UI', Tahoma, sans-serif; background-color:#f7f7f8; padding:30px;">
    <div style="max-width:600px; background:#fff; margin:auto; border-radius:10px; box-shadow:0 3px 10px rgba(0,0,0,0.1); overflow:hidden;">
      <div style="background:linear-gradient(135deg,#3182CE,#2B6CB0); padding:20px; text-align:center;">
        <h2 style="color:white; margin:0;">💸 Withdrawal Approved</h2>
      </div>
      <div style="padding:30px;">
        <p style="font-size:16px; color:#333;">Hi <strong>${username}</strong>,</p>
        <p style="font-size:15px; color:#555;">Good news! Your withdrawal request of <strong>$${amount}</strong> has been approved and processed successfully.</p>
        <div style="margin:25px 0; padding:15px; background:#f3f4f6; border-left:5px solid #3182CE; border-radius:6px;">
          <p style="margin:0; font-size:14px; color:#444;">
            <strong>Amount:</strong> $${amount}<br/>
            <strong>Status:</strong> Approved
          </p>
        </div>
        <p style="font-size:14px; color:#666;">The funds have been sent to your linked account or wallet.</p>
      </div>
      <div style="background:#f3f3f3; text-align:center; padding:15px; font-size:13px; color:#777;">
        © ${new Date().getFullYear()} BanMarket Support Team
      </div>
    </div>
  </div>`;
}
export function withdrawalRejectedTemplate(username: string, amount: string, reason?: string) {
  return `
  <div style="font-family:'Segoe UI', Tahoma, sans-serif; background-color:#f7f7f8; padding:30px;">
    <div style="max-width:600px; background:#fff; margin:auto; border-radius:10px; box-shadow:0 3px 10px rgba(0,0,0,0.1); overflow:hidden;">
      <div style="background:linear-gradient(135deg,#E53E3E,#DD6B20); padding:20px; text-align:center;">
        <h2 style="color:white; margin:0;">🚫 Withdrawal Rejected</h2>
      </div>
      <div style="padding:30px;">
        <p style="font-size:16px; color:#333;">Hi <strong>${username}</strong>,</p>
        <p style="font-size:15px; color:#555;">Your withdrawal request of <strong>$${amount}</strong> was unfortunately rejected.</p>
        <div style="margin:25px 0; padding:15px; background:#f3f4f6; border-left:5px solid #E53E3E; border-radius:6px;">
          <p style="margin:0; font-size:14px; color:#444;">
            <strong>Amount:</strong> $${amount}<br/>
            <strong>Status:</strong> Rejected<br/>
            ${reason ? `<strong>Reason:</strong> ${reason}<br/>` : ""}
          </p>
        </div>
        <p style="font-size:14px; color:#666;">Please check your account details and try again or contact support for clarification.</p>
      </div>
      <div style="background:#f3f3f3; text-align:center; padding:15px; font-size:13px; color:#777;">
        © ${new Date().getFullYear()} BanMarket Support Team
      </div>
    </div>
  </div>`;
}

