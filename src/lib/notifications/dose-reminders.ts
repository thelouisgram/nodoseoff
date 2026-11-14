import { generateDoseReminderEmail } from "@/emails/doseReminder";
import { getSql } from "@/lib/db";
import { sendResendEmail } from "@/lib/email/resend";
import {
  activeNotificationChannel,
  notificationsEnabled,
} from "@/lib/notifications/channel";
import { drugDisplayName } from "@/utils/drugs";

type ScheduleRow = {
  id?: number | string;
  drug?: string;
  nickname?: string;
  date?: string;
  time?: string;
  completed?: boolean;
  drugId?: string;
};

function reminderTimezone(): string {
  return process.env.DOSE_REMINDER_TIMEZONE?.trim() || "Africa/Lagos";
}

/** Local YYYY-MM-DD + HH:mm in the reminder timezone. */
export function localNowParts(now = new Date(), timeZone = reminderTimezone()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value || "";

  const date = `${get("year")}-${get("month")}-${get("day")}`;
  const hour = get("hour").padStart(2, "0");
  const minute = get("minute").padStart(2, "0");
  return { date, time: `${hour}:${minute}`, minutes: Number(hour) * 60 + Number(minute) };
}

function parseTimeToMinutes(time: string): number | null {
  const m = String(time || "")
    .trim()
    .match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

function normalizeTime(time: string): string {
  const m = String(time || "")
    .trim()
    .match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return String(time || "").trim();
  return `${String(Number(m[1])).padStart(2, "0")}:${m[2]}`;
}

/** One morning digest email per user per calendar day. */
function dailyDigestKey(date: string): string {
  return `daily|${date}`;
}

/**
 * Morning digest: email each user their incomplete doses for today.
 * Intended to run once daily at 6:00 in DOSE_REMINDER_TIMEZONE
 * (Vercel cron uses UTC — Africa/Lagos 06:00 = 05:00 UTC).
 */
export async function processDueDoseReminders(options?: {
  now?: Date;
}): Promise<{
  scanned: number;
  matched: number;
  sent: number;
  skipped: number;
  channel: string;
}> {
  const channel = activeNotificationChannel();
  if (!notificationsEnabled()) {
    return { scanned: 0, matched: 0, sent: 0, skipped: 0, channel };
  }

  const { date: today } = localNowParts(options?.now);
  const sql = getSql();

  const rows = await sql`
    SELECT
      u."userId" AS user_id,
      u.email,
      u.name,
      s.schedule,
      COALESCE(
        (
          SELECT jsonb_agg(d."drugId")
          FROM drugs d
          WHERE d."userId" = u."userId" AND d.reminder IS TRUE
        ),
        '[]'::jsonb
      ) AS reminder_ids
    FROM users u
    INNER JOIN schedule s ON s."userId" = u."userId"
    WHERE u.email IS NOT NULL
      AND u.email <> ''
      AND jsonb_typeof(s.schedule) = 'array'
      AND jsonb_array_length(s.schedule) > 0
  `;

  let matched = 0;
  let sent = 0;
  let skipped = 0;

  for (const row of rows) {
    const userId = String(row.user_id || "");
    const email = String(row.email || "").trim().toLowerCase();
    if (!userId || !email) continue;

    const reminderIds = new Set(
      (Array.isArray(row.reminder_ids) ? row.reminder_ids : []).map(String)
    );
    if (reminderIds.size === 0) continue;

    const schedule = (Array.isArray(row.schedule) ? row.schedule : []) as ScheduleRow[];
    const todaysDoses = schedule
      .filter((item) => {
        if (!item || item.completed) return false;
        if (String(item.date || "") !== today) return false;
        if (!reminderIds.has(String(item.drugId || ""))) return false;
        return parseTimeToMinutes(String(item.time || "")) != null;
      })
      .sort((a, b) => {
        const am = parseTimeToMinutes(String(a.time || "")) ?? 0;
        const bm = parseTimeToMinutes(String(b.time || "")) ?? 0;
        return am - bm;
      });

    if (todaysDoses.length === 0) continue;
    matched += todaysDoses.length;

    const digestKey = dailyDigestKey(today);
    const claimed = await sql`
      INSERT INTO dose_reminder_log ("userId", dose_key, channel)
      VALUES (${userId}, ${digestKey}, ${channel})
      ON CONFLICT ("userId", dose_key) DO NOTHING
      RETURNING id
    `;
    if (!claimed.length) {
      skipped += 1;
      continue;
    }

    if (channel === "push") {
      console.info(
        "[dose-reminders] push not implemented yet",
        userId,
        todaysDoses.length
      );
      skipped += todaysDoses.length;
      continue;
    }

    try {
      const { subject, html } = generateDoseReminderEmail({
        name: String(row.name || ""),
        doses: todaysDoses.map((item) => ({
          label: drugDisplayName(item),
          time: normalizeTime(String(item.time || "")),
        })),
      });
      await sendResendEmail({ to: email, subject, html });
      sent += 1;
    } catch (err) {
      console.error("[dose-reminders] send failed:", userId, err);
      // Allow manual/retry re-run the same day
      await sql`
        DELETE FROM dose_reminder_log
        WHERE "userId" = ${userId}
          AND dose_key = ${digestKey}
      `;
    }
  }

  return {
    scanned: rows.length,
    matched,
    sent,
    skipped,
    channel,
  };
}
