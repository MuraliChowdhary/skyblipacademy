import nodemailer from "nodemailer";
import { logger } from "@/src/lib/logger";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_PORT === "465",
  auth: process.env.SMTP_USER
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    : undefined,
});

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM ?? "no-reply@skyblip.academy",
      to,
      subject: "Reset your Sky Blip Academy password",
      text: `Reset your password: ${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, ignore this email.`,
      html: `<p>Reset your password using the link below. It expires in 1 hour.</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>Didn't request this? Ignore this email — nothing changes until the link is used.</p>`,
    });
  } catch (err) {
    // The token is already stored and valid at this point — a delivery
    // failure shouldn't turn into a 500 that implies the reset request
    // itself failed. Log loudly so ops catches an SMTP problem
    // separately from the request/response cycle.
    logger.error({ err, to }, "mailer.password_reset_send_failed");
  }
}
