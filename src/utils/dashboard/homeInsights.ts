import { format, subDays } from "date-fns";
import type { DrugProps, ScheduleItem } from "@/types/dashboard";
import { formatDoseClock, getNextUpcomingDose } from "./dashboard";

export const AMANDA_PREFILL_KEY = "nodoseoff_amanda_prefill";

export type DoseMoment = {
  dose: ScheduleItem;
  at: Date;
};

/** Grace before a today's dose counts as "due now" (not missed). */
const DUE_GRACE_MS = 20 * 60 * 1000;

function doseAt(dose: ScheduleItem): Date | null {
  // Normalize "8:00" → "08:00" so parsing is reliable across engines.
  const [h = "0", m = "00"] = String(dose.time || "").split(":");
  const time = `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  const at = new Date(`${dose.date}T${time}`);
  return Number.isNaN(at.getTime()) ? null : at;
}

function dayKey(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

/**
 * Incomplete doses from yesterday only — those are actually missed.
 * Today's unfinished past slots stay "pending" in the dose list / Up next,
 * not a missed-dose alert.
 */
export function getMissedDoses(
  schedule: ScheduleItem[],
  now = new Date()
): DoseMoment[] {
  const yesterday = dayKey(subDays(now, 1));
  const missed: DoseMoment[] = [];
  for (const dose of schedule) {
    if (dose.completed) continue;
    if (dose.date !== yesterday) continue;
    const at = doseAt(dose);
    if (!at) continue;
    missed.push({ dose, at });
  }
  missed.sort((a, b) => b.at.getTime() - a.at.getTime());
  return missed;
}

/** @deprecated use getMissedDoses — kept for call sites expecting overdue naming */
export function getOverdueDoses(
  schedule: ScheduleItem[],
  now = new Date()
): DoseMoment[] {
  return getMissedDoses(schedule, now);
}

/** Today's incomplete doses that are past schedule + grace. */
export function getDueTodayDoses(
  schedule: ScheduleItem[],
  now = new Date()
): DoseMoment[] {
  const today = dayKey(now);
  const due: DoseMoment[] = [];
  for (const dose of schedule) {
    if (dose.completed) continue;
    if (dose.date !== today) continue;
    const at = doseAt(dose);
    if (!at) continue;
    if (now.getTime() < at.getTime() + DUE_GRACE_MS) continue;
    due.push({ dose, at });
  }
  due.sort((a, b) => a.at.getTime() - b.at.getTime());
  return due;
}

/**
 * Prefer the soonest upcoming dose; else today's late dose after grace.
 * Does not pull in yesterday's missed doses (those live in HomeAlerts).
 */
export function getActionableDose(
  schedule: ScheduleItem[],
  now = new Date()
): (DoseMoment & { kind: "upcoming" | "due" }) | null {
  const next = getNextUpcomingDose(schedule);
  if (next) return { ...next, kind: "upcoming" };

  const dueToday = getDueTodayDoses(schedule, now);
  if (dueToday[0]) return { ...dueToday[0], kind: "due" };
  return null;
}

export type DayAdherence = {
  key: string;
  label: string;
  total: number;
  completed: number;
  /** 0–1, or null when no doses that day */
  rate: number | null;
  isToday: boolean;
};

/** Last 7 calendar days (oldest → newest), including today. */
export function getWeeklyAdherence(
  schedule: ScheduleItem[],
  now = new Date()
): DayAdherence[] {
  const byDay = new Map<string, { total: number; completed: number }>();
  for (const dose of schedule) {
    const entry = byDay.get(dose.date) ?? { total: 0, completed: 0 };
    entry.total += 1;
    if (dose.completed) entry.completed += 1;
    byDay.set(dose.date, entry);
  }

  const days: DayAdherence[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = subDays(now, i);
    const key = dayKey(d);
    const tally = byDay.get(key);
    const total = tally?.total ?? 0;
    const completed = tally?.completed ?? 0;
    days.push({
      key,
      label: format(d, "EEEEE"),
      total,
      completed,
      rate: total > 0 ? completed / total : null,
      isToday: i === 0,
    });
  }
  return days;
}

/** Consecutive perfect days ending today (or yesterday if today incomplete). */
export function getAdherenceStreak(
  schedule: ScheduleItem[],
  now = new Date()
): number {
  const byDay = new Map<string, { total: number; completed: number }>();
  for (const dose of schedule) {
    const entry = byDay.get(dose.date) ?? { total: 0, completed: 0 };
    entry.total += 1;
    if (dose.completed) entry.completed += 1;
    byDay.set(dose.date, entry);
  }

  let streak = 0;
  for (let i = 0; i < 60; i++) {
    const d = subDays(now, i);
    const key = dayKey(d);
    const tally = byDay.get(key);
    if (!tally || tally.total === 0) {
      if (i === 0) continue; // today may still be in progress / empty
      break;
    }
    if (tally.completed < tally.total) {
      if (i === 0) continue; // today not finished yet — don't break streak
      break;
    }
    streak += 1;
  }
  return streak;
}

export function getWeeklyCompliancePercent(days: DayAdherence[]): number {
  let completed = 0;
  let total = 0;
  for (const day of days) {
    completed += day.completed;
    total += day.total;
  }
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export type EndingSoonDrug = {
  drug: DrugProps;
  daysLeft: number;
  endLabel: string;
};

/** Active courses ending within `withinDays` (default 7). */
export function getEndingSoonDrugs(
  drugs: DrugProps[],
  withinDays = 7,
  now = new Date()
): EndingSoonDrug[] {
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const results: EndingSoonDrug[] = [];
  for (const drug of drugs) {
    if (!drug.end) continue;
    const end = new Date(`${drug.end}T23:59:59`);
    if (Number.isNaN(end.getTime())) continue;
    const diffMs = end.getTime() - startOfToday.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (daysLeft < 0 || daysLeft > withinDays) continue;
    results.push({
      drug,
      daysLeft,
      endLabel: format(end, "MMM d"),
    });
  }
  results.sort((a, b) => a.daysLeft - b.daysLeft);
  return results;
}

export function buildAmandaShortcuts(drugNames: string[]): string[] {
  const unique = Array.from(
    new Set(drugNames.map((n) => n.trim()).filter(Boolean))
  );
  if (unique.length === 0) {
    return [
      "Tips for remembering evening doses",
      "What should I ask my pharmacist about a new prescription?",
      "How should I track side effects day to day?",
    ];
  }
  const first = unique[0];
  const second = unique[1];
  return [
    unique.length > 1
      ? "Any interactions among my medications today?"
      : `Common side effects of ${first}?`,
    `Which side effect has been more consistent since I started ${first}?`,
    second
      ? `Can I take ${first} and ${second} together?`
      : `Tips for staying on schedule with ${first}`,
  ].slice(0, 3);
}

export function formatRelativeDoseLabel(
  at: Date,
  kind: "upcoming" | "due",
  now = new Date()
): string {
  const clock = formatDoseClock(
    `${String(at.getHours()).padStart(2, "0")}:${String(
      at.getMinutes()
    ).padStart(2, "0")}`
  );
  if (kind === "due") {
    const mins = Math.max(
      1,
      Math.round((now.getTime() - at.getTime()) / 60000)
    );
    if (mins < 60) return `Due · ${mins}m late · ${clock}`;
    const hrs = Math.round(mins / 60);
    return `Due · ${hrs}h late · ${clock}`;
  }
  const mins = Math.max(0, Math.round((at.getTime() - now.getTime()) / 60000));
  if (mins < 60) return `In ${mins || "<1"}m · ${clock}`;
  if (mins < 24 * 60) {
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return rem ? `In ${hrs}h ${rem}m · ${clock}` : `In ${hrs}h · ${clock}`;
  }
  return `${format(at, "EEE")} · ${clock}`;
}
