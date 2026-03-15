import nodemailer from "nodemailer";

function getSmtpConfig() {
  return {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };
}

function getFromEmail() {
  return process.env.SMTP_FROM || process.env.SMTP_USER;
}

function createTransporter() {
  const smtpConfig = getSmtpConfig();

  if (!smtpConfig.host || !smtpConfig.auth.user || !smtpConfig.auth.pass) {
    throw new Error(
      "SMTP is not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM in backend .env"
    );
  }

  return nodemailer.createTransport(smtpConfig);
}

export async function sendVerificationEmail(
  toEmail,
  userName,
  verificationLink
) {
  const transporter = createTransporter();
  const from = getFromEmail();

  await transporter.sendMail({
    from,
    to: toEmail,
    subject: "Verify your iCell account email",
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
        <h2>Email verification</h2>
        <p>Hi ${userName || "there"},</p>
        <p>Thanks for registering with iCell. Please verify your email by clicking the button below:</p>
        <p>
          <a
            href="${verificationLink}"
            style="display: inline-block; padding: 10px 16px; background: #7c3aed; color: #fff; text-decoration: none; border-radius: 6px;"
          >
            Verify Email
          </a>
        </p>
        <p>If the button does not work, use this link:</p>
        <p><a href="${verificationLink}">${verificationLink}</a></p>
        <p>This link expires in 24 hours.</p>
      </div>
    `,
    text: `Hi ${
      userName || "there"
    },\n\nPlease verify your email by opening this link:\n${verificationLink}\n\nThis link expires in 24 hours.`,
  });
}

export default {
  sendVerificationEmail,
};
