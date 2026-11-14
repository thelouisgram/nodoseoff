import { appBaseUrl, emailShell } from "@/lib/email/layout";

export function generateDoseReminderEmail(params: {
  name?: string;
  doses: Array<{ label: string; time: string }>;
}): { subject: string; html: string } {
  const first =
    String(params.name || "")
      .trim()
      .split(/\s+/)[0] || "there";

  const count = params.doses.length;
  const subject =
    count === 1
      ? `Today’s dose: ${params.doses[0]?.label || "medication"}`
      : `Today’s doses: ${count} medications`;

  const list = params.doses
    .map(
      (d) =>
        `<li style="margin:0 0 8px"><strong>${escapeHtml(d.label)}</strong> · ${escapeHtml(formatTime(d.time))}</li>`
    )
    .join("");

  const html = emailShell({
    title: subject,
    ctaLabel: "Open dashboard",
    ctaHref: `${appBaseUrl()}/dashboard`,
    bodyHtml: `
      <p style="margin:0 0 14px;font-size:16px;line-height:1.55">Good morning ${escapeHtml(first)},</p>
      <p style="margin:0 0 14px;font-size:15px;line-height:1.55;color:#374151">
        Here’s your medication schedule for today:
      </p>
      <ul style="margin:0 0 16px;padding-left:18px;font-size:15px;line-height:1.6;color:#0B1A2E">
        ${list}
      </ul>
      <p style="margin:0;font-size:13px;line-height:1.5;color:#6B7280">
        You’ll get this morning summary once a day. When the mobile app ships, reminders can move to push notifications.
      </p>
    `,
  });

  return { subject, html };
}

function formatTime(time: string): string {
  const [hourString, minutes = "00"] = String(time || "").split(":");
  const hour = Number.parseInt(hourString, 10);
  if (Number.isNaN(hour)) return time;
  const period = hour < 12 ? "AM" : "PM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes.padStart(2, "0")} ${period}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
