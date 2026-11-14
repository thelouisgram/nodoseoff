import { appBaseUrl, emailShell } from "@/lib/email/layout";

interface WelcomeEmailResponse {
  subject: string;
  html: string;
}

export function generateWelcomeEmail(name?: string): WelcomeEmailResponse {
  const first =
    String(name || "")
      .trim()
      .split(/\s+/)[0] || "there";
  const subject = "Welcome to NoDoseOff";
  const dashboard = `${appBaseUrl()}/dashboard`;

  const html = emailShell({
    title: subject,
    ctaLabel: "Go to dashboard",
    ctaHref: dashboard,
    bodyHtml: `
      <p style="margin:0 0 14px;font-size:16px;line-height:1.55">Hi ${escapeHtml(first)},</p>
      <p style="margin:0 0 14px;font-size:15px;line-height:1.55;color:#374151">
        Welcome to NoDoseOff — your calm companion for staying on track with long-term medication.
      </p>
      <p style="margin:0 0 8px;font-size:15px;line-height:1.55;color:#374151">You can:</p>
      <ul style="margin:0 0 16px;padding-left:18px;font-size:15px;line-height:1.7;color:#0B1A2E">
        <li>Add meds and dose times</li>
        <li>Get dose reminders by email (push comes with the mobile app)</li>
        <li>Track adherence and share reports with your clinician</li>
      </ul>
      <p style="margin:0;font-size:15px;line-height:1.55;color:#374151">
        Start by adding your first medication from the dashboard.
      </p>
    `,
  });

  return { subject, html };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
