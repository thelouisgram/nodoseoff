import { generateWelcomeEmail } from "@/emails/welcomeMail";
import { getSql } from "@/lib/db";
import { sendResendEmail } from "@/lib/email/resend";
import {
  activeNotificationChannel,
  notificationsEnabled,
} from "@/lib/notifications/channel";

/**
 * Send welcome once per user (race-safe). Currently email-only;
 * push path is reserved for the mobile app.
 */
export async function sendWelcomeIfNeeded(params: {
  userId: string;
  email: string;
  name?: string;
}): Promise<{ sent: boolean; channel?: string }> {
  if (!notificationsEnabled()) return { sent: false };

  const email = params.email.trim().toLowerCase();
  if (!email) return { sent: false };

  const sql = getSql();
  const claimed = await sql`
    UPDATE users
    SET welcome_email_sent_at = NOW()
    WHERE "userId" = ${params.userId}
      AND welcome_email_sent_at IS NULL
    RETURNING "userId"
  `;
  if (!claimed.length) return { sent: false };

  const channel = activeNotificationChannel();
  if (channel === "push") {
    // Mobile push not wired yet — keep claim so we don't email later by mistake
    // after channel flips without a dedicated welcome push job.
    console.info("[welcome] channel=push not implemented; skipped", params.userId);
    return { sent: false, channel };
  }

  try {
    const { subject, html } = generateWelcomeEmail(params.name);
    await sendResendEmail({ to: email, subject, html });
    return { sent: true, channel: "email" };
  } catch (err) {
    // Allow retry on next bootstrap/login
    await sql`
      UPDATE users
      SET welcome_email_sent_at = NULL
      WHERE "userId" = ${params.userId}
    `;
    console.error("[welcome] send failed:", err);
    throw err;
  }
}
