import { loadDashboardForUser } from "@/lib/server/dashboard-data";
import { drugDisplayName, groupDrugsByName } from "@/utils/drugs";
import type { DrugProps } from "@/types/dashboard";

export type ClientClock = {
  /** ISO timestamp from the user's device */
  nowIso?: string;
  /** IANA zone, e.g. Africa/Lagos */
  timeZone?: string;
};

type MedRow = {
  drug?: unknown;
  frequency?: unknown;
  route?: unknown;
  start?: unknown;
  end?: unknown;
  time?: unknown;
};

type ScheduleRow = {
  drug?: unknown;
  nickname?: unknown;
  date?: unknown;
  time?: unknown;
  completed?: unknown;
  drugId?: unknown;
};

type JournalRow = {
  id?: unknown;
  kind?: unknown;
  mood?: unknown;
  severity?: unknown;
  symptom?: unknown;
  drug?: unknown;
  notes?: unknown;
  loggedAt?: unknown;
};

function formatTimes(time: unknown): string {
  if (!Array.isArray(time) || time.length === 0) return "";
  return time
    .map((t) => {
      if (typeof t === "string") return t;
      if (t && typeof t === "object") {
        const o = t as { time?: string; label?: string };
        return o.time || o.label || JSON.stringify(t);
      }
      return String(t);
    })
    .filter(Boolean)
    .join(", ");
}

function formatMedLine(row: MedRow): string {
  const name = String(row.drug || "").trim() || "Unknown";
  const bits: string[] = [];
  if (row.frequency) bits.push(String(row.frequency));
  if (row.route) bits.push(`route: ${row.route}`);
  const times = formatTimes(row.time);
  if (times) bits.push(`times: ${times}`);
  if (row.start) bits.push(`start: ${row.start}`);
  if (row.end) bits.push(`end: ${row.end}`);
  return bits.length ? `- ${name} (${bits.join("; ")})` : `- ${name}`;
}

function formatJournalLine(row: JournalRow): string {
  const when = String(row.loggedAt || "").slice(0, 10) || "unknown date";
  const kind = String(row.kind || "note");
  const drug = String(row.drug || "").trim();
  const linked = drug ? ` · linked med: ${drug}` : "";

  if (kind === "mood") {
    const mood = String(row.mood || "").trim() || "unspecified";
    const notes = String(row.notes || "").trim();
    return `- ${when}: mood=${mood}${notes ? ` · ${notes}` : ""}${linked}`;
  }

  if (kind === "side_effect") {
    const symptom = String(row.symptom || "").trim() || "unspecified";
    const severity =
      row.severity == null || row.severity === ""
        ? ""
        : ` · severity ${row.severity}/5`;
    const notes = String(row.notes || "").trim();
    return `- ${when}: side effect=${symptom}${severity}${notes ? ` · ${notes}` : ""}${linked}`;
  }

  const notes = String(row.notes || "").trim() || "(empty note)";
  return `- ${when}: note=${notes}${linked}`;
}

/** Summarize recurring side effects by drug for AMANDA pattern questions. */
function summarizeSideEffects(entries: JournalRow[]): string[] {
  const sideEffects = entries.filter(
    (e) => String(e.kind) === "side_effect" && String(e.symptom || "").trim()
  );
  if (sideEffects.length === 0) return [];

  const byKey = new Map<
    string,
    { count: number; severities: number[]; drug: string; symptom: string }
  >();

  for (const e of sideEffects) {
    const symptom = String(e.symptom || "")
      .trim()
      .toLowerCase();
    const drug = String(e.drug || "")
      .trim()
      .toLowerCase();
    const key = `${drug || "unlinked"}::${symptom}`;
    const severity =
      e.severity == null || e.severity === "" ? null : Number(e.severity);
    const prev = byKey.get(key) || {
      count: 0,
      severities: [] as number[],
      drug: String(e.drug || "").trim() || "unlinked",
      symptom: String(e.symptom || "").trim(),
    };
    prev.count += 1;
    if (severity != null && !Number.isNaN(severity)) {
      prev.severities.push(severity);
    }
    byKey.set(key, prev);
  }

  return Array.from(byKey.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 12)
    .map((row) => {
      const avg =
        row.severities.length > 0
          ? (
              row.severities.reduce((s, n) => s + n, 0) / row.severities.length
            ).toFixed(1)
          : null;
      return `- ${row.symptom}${row.drug !== "unlinked" ? ` (with ${row.drug})` : ""}: ${row.count} log${row.count === 1 ? "" : "s"}${avg ? `, avg severity ${avg}/5` : ""}`;
    });
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function zonedParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "00";
  const hourRaw = get("hour");
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    hour: Number(hourRaw === "24" ? "0" : hourRaw),
    minute: Number(get("minute")),
    second: Number(get("second")),
  };
}

/** Wall-clock encode so dose times (naive local) compare against user-local now. */
function wallClockMs(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second = 0
): number {
  return Date.UTC(year, month - 1, day, hour, minute, second);
}

/** Plain English — models often misread HH:MM:SS as clock time. */
function formatCountdownHuman(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days === 1 ? "" : "s"}`);
  if (hours > 0) parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes === 1 ? "" : "s"}`);
  if (parts.length === 0 || (days === 0 && hours === 0 && minutes < 5)) {
    parts.push(`${seconds} second${seconds === 1 ? "" : "s"}`);
  }
  return parts.join(", ");
}

function formatClock12(hour: number, minute: number): string {
  const period = hour < 12 ? "AM" : "PM";
  const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${display}:${pad2(minute)} ${period}`;
}

function buildScheduleClockBlock(
  schedule: ScheduleRow[],
  clock: ClientClock
): string[] {
  const timeZone =
    clock.timeZone?.trim() ||
    Intl.DateTimeFormat().resolvedOptions().timeZone ||
    "UTC";
  const now = clock.nowIso ? new Date(clock.nowIso) : new Date();
  if (Number.isNaN(now.getTime())) {
    return ["Current time context: unavailable (invalid client clock)."];
  }

  const local = zonedParts(now, timeZone);
  const nowMs = wallClockMs(
    local.year,
    local.month,
    local.day,
    local.hour,
    local.minute,
    local.second
  );
  const localDate = `${local.year}-${pad2(local.month)}-${pad2(local.day)}`;
  const localTime = `${pad2(local.hour)}:${pad2(local.minute)}:${pad2(local.second)}`;

  const lines: string[] = [
    "Current time & dose schedule status (authoritative — use this for countdowns; do NOT say you lack a clock):",
    `- Now (patient local): ${localDate} ${localTime} (${timeZone})`,
  ];

  type DoseMoment = {
    drug: string;
    nickname: string;
    date: string;
    time: string;
    ms: number;
    completed: boolean;
  };

  const doses: DoseMoment[] = [];
  for (const row of schedule) {
    const date = String(row.date || "").trim();
    const timeRaw = String(row.time || "").trim();
    if (!date || !timeRaw) continue;
    const [h = "0", m = "00"] = timeRaw.split(":");
    const hour = Number(h);
    const minute = Number(m);
    if (Number.isNaN(hour) || Number.isNaN(minute)) continue;
    const [y, mo, d] = date.split("-").map(Number);
    if (!y || !mo || !d) continue;
    doses.push({
      drug: String(row.drug || "").trim() || "Unknown",
      nickname: String(row.nickname || "").trim(),
      date,
      time: `${pad2(hour)}:${pad2(minute)}`,
      ms: wallClockMs(y, mo, d, hour, minute, 0),
      completed: Boolean(row.completed),
    });
  }

  const upcoming = doses
    .filter((d) => !d.completed && d.ms > nowMs)
    .sort((a, b) => a.ms - b.ms);
  const dueToday = doses
    .filter(
      (d) =>
        !d.completed &&
        d.date === localDate &&
        d.ms <= nowMs &&
        nowMs - d.ms <= 20 * 60 * 1000
    )
    .sort((a, b) => a.ms - b.ms);
  const lateToday = doses
    .filter(
      (d) =>
        !d.completed &&
        d.date === localDate &&
        nowMs - d.ms > 20 * 60 * 1000
    )
    .sort((a, b) => a.ms - b.ms);

  let readyAnswer =
    "READY_ANSWER: There is no upcoming dose on the current schedule.";

  if (dueToday[0]) {
    const d = dueToday[0];
    const label = drugDisplayName(d);
    const [hh, mm] = d.time.split(":").map(Number);
    const lateHuman = formatCountdownHuman(nowMs - d.ms);
    const when = formatClock12(hh, mm);
    lines.push(
      `- Next dose (authoritative): ${label} at ${when} today — DUE NOW (${lateHuman} past the scheduled time).`
    );
    readyAnswer = `READY_ANSWER: Your next medication is ${label} at ${when} today. It is due now (${lateHuman} past the scheduled time).`;
  } else if (upcoming[0]) {
    const d = upcoming[0];
    const label = drugDisplayName(d);
    const [hh, mm] = d.time.split(":").map(Number);
    const remainHuman = formatCountdownHuman(d.ms - nowMs);
    const when = formatClock12(hh, mm);
    const dayLabel = d.date === localDate ? "today" : d.date;
    lines.push(
      `- Next dose (authoritative): ${label} at ${when} ${dayLabel} — time remaining: ${remainHuman}.`
    );
    readyAnswer = `READY_ANSWER: Your next medication is ${label} at ${when} ${dayLabel}. Time remaining: ${remainHuman}.`;
  } else {
    lines.push("- Next dose (authoritative): none upcoming on the current schedule.");
  }

  if (lateToday.length > 0) {
    lines.push(
      `- Incomplete past doses today: ${lateToday
        .slice(0, 5)
        .map((d) => {
          const [hh, mm] = d.time.split(":").map(Number);
          return `${drugDisplayName(d)} (${formatClock12(hh, mm)})`;
        })
        .join("; ")}.`
    );
  }

  const todayRemaining = doses.filter(
    (d) => d.date === localDate && !d.completed
  ).length;
  const todayDone = doses.filter(
    (d) => d.date === localDate && d.completed
  ).length;
  lines.push(
    `- Today’s doses: ${todayDone} taken, ${todayRemaining} still open.`
  );
  lines.push(readyAnswer);
  lines.push(
    "For next-dose / countdown questions: copy READY_ANSWER almost verbatim (you may soften tone). Do not invent a different clock time, drug, or remaining duration. Do not use other dose times from the meds list if they conflict with READY_ANSWER."
  );

  return lines;
}

/** Build a compact medication snapshot for the AI system prompt. */
export async function buildUserMedsContext(
  userId: string,
  clock: ClientClock = {}
): Promise<string> {
  try {
    const data = await loadDashboardForUser(userId);
    const active = (data.activeDrugs || []) as MedRow[];
    const allergies = (data.allergies || []) as MedRow[];
    const journal = (data.healthJournal || []) as JournalRow[];
    const schedule = (data.schedule || []) as ScheduleRow[];
    const otc = String(data.otcDrugs || "").trim();
    const herbs = String(data.herbs || "").trim();

    const scheduleBlock = buildScheduleClockBlock(schedule, clock);

    const lines: string[] = [
      "Patient medication context from their NoDoseOff dashboard (use this when they say “my drugs”, “my meds”, or ask without naming a drug):",
    ];

    if (active.length === 0) {
      lines.push("- Active medications: none on file.");
    } else {
      // Group by drug name — multiple rows are courses/refills, not separate meds.
      const grouped = groupDrugsByName(active as DrugProps[]);
      lines.push(
        `Active medications (${grouped.length} unique; courses listed under each name):`
      );
      for (const g of grouped.slice(0, 40)) {
        if (g.courseCount <= 1) {
          lines.push(formatMedLine(g));
          continue;
        }
        lines.push(
          `- ${String(g.drug || "").trim()} (${g.courseCount} courses):`
        );
        for (const course of g.courses) {
          lines.push(`  ${formatMedLine(course).replace(/^- /, "• ")}`);
        }
      }
    }

    if (allergies.length > 0) {
      const allergyNames = Array.from(
        new Set(
          allergies
            .map((a) => String(a.drug || "").trim())
            .filter(Boolean)
        )
      );
      lines.push("Medication allergies / intolerance flags:");
      for (const name of allergyNames.slice(0, 20)) {
        lines.push(`- ${name}`);
      }
    } else {
      lines.push("Medication allergies on file: none.");
    }

    if (otc) lines.push(`OTC / other drugs noted: ${otc}`);
    if (herbs) lines.push(`Herbs / supplements noted: ${herbs}`);

    const sideSummary = summarizeSideEffects(journal);
    if (sideSummary.length > 0) {
      lines.push(
        "Side-effect frequency from the patient’s logged journal (use for questions like “which side effect is more consistent since I started X”):"
      );
      lines.push(...sideSummary);
    }

    if (journal.length > 0) {
      lines.push(
        "Recent mood / side-effect / note logs (newest first, up to 40):"
      );
      for (const entry of journal.slice(0, 40)) {
        lines.push(formatJournalLine(entry));
      }
    } else {
      lines.push(
        "Health journal: no mood or side-effect logs yet. If they ask about patterns since starting a med, say they haven’t logged symptoms yet and suggest logging a side effect from the + menu on Overview."
      );
    }

    lines.push(
      "When answering, prefer these listed meds and journal logs. Do not invent prescriptions, moods, or side effects they did not log. If comparing consistency of side effects, use the frequency summary and dated logs. If the list is empty, say so and ask them to add meds in the Drugs tab or log symptoms in Overview."
    );

    // Schedule/clock last so next-dose answers stay grounded (models weight recent context).
    lines.push("");
    lines.push(...scheduleBlock);

    return lines.join("\n");
  } catch (error) {
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      return "Patient medication context: profile not set up yet — no medications on file.";
    }
    console.error("buildUserMedsContext error:", error);
    return "Patient medication context: unavailable right now.";
  }
}

export async function listActiveDrugNames(userId: string): Promise<string[]> {
  try {
    const data = await loadDashboardForUser(userId);
    const active = (data.activeDrugs || []) as DrugProps[];
    return groupDrugsByName(active).map((g) => String(g.drug || "").trim()).filter(Boolean);
  } catch {
    return [];
  }
}
