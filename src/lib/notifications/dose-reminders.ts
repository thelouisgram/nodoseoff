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

function doseKey(item: ScheduleRow): string {
  return [
    String(item.date || ""),
    normalizeTime(String(item.time || "")),
    String(item.drugId || ""),
    String(item.id ?? ""),
  ].join("|");
}

/**
 * Find due incomplete doses and email (or later push) reminders.
 * Window: dose time within the last `windowMinutes` (default 10).
 */
export async function processDueDoseReminders(options?: {
  now?: Date;
  windowMinutes?: number;
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

  const windowMinutes = options?.windowMinutes ?? 10;
  const { date: today, minutes: nowMinutes } = localNowParts(options?.now);
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
    const due = schedule.filter((item) => {
      if (!item || item.completed) return false;
      if (String(item.date || "") !== today) return false;
      if (!reminderIds.has(String(item.drugId || ""))) return false;
      const doseMinutes = parseTimeToMinutes(String(item.time || ""));
      if (doseMinutes == null) return false;
      const delta = nowMinutes - doseMinutes;
      return delta >= 0 && delta < windowMinutes;
    });

    if (due.length === 0) continue;
    matched += due.length;

    const fresh: ScheduleRow[] = [];
    for (const item of due) {
      const key = doseKey(item);
      const claimed = await sql`
        INSERT INTO dose_reminder_log ("userId", dose_key, channel)
        VALUES (${userId}, ${key}, ${channel})
        ON CONFLICT ("userId", dose_key) DO NOTHING
        RETURNING id
      `;
      if (claimed.length) fresh.push(item);
      else skipped += 1;
    }

    if (fresh.length === 0) continue;

    if (channel === "push") {
      console.info("[dose-reminders] push not implemented yet", userId, fresh.length);
      skipped += fresh.length;
      continue;
    }

    try {
      const { subject, html } = generateDoseReminderEmail({
        name: String(row.name || ""),
        doses: fresh.map((item) => ({
          label: drugDisplayName(item),
          time: normalizeTime(String(item.time || "")),
        })),
      });
      await sendResendEmail({ to: email, subject, html });
      sent += 1;
    } catch (err) {
      console.error("[dose-reminders] send failed:", userId, err);
      // Allow retry next cron tick
      const keys = fresh.map((item) => doseKey(item));
      await sql`
        DELETE FROM dose_reminder_log
        WHERE "userId" = ${userId}
          AND dose_key = ANY(${keys})
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
