import { tool } from "ai";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { dose, generateSchedule } from "@/utils/dashboard/dashboard";
import {
  generateDrugId,
  isAllergicToDrug,
  sameDrugName,
} from "@/utils/drugs";
import type { DrugProps, ScheduleItem } from "@/types/dashboard";

const FREQ_ALIASES: Record<string, string> = {
  qd: "QD",
  od: "QD",
  once: "QD",
  daily: "QD",
  "once daily": "QD",
  "once a day": "QD",
  bid: "BID",
  bd: "BID",
  twice: "BID",
  "twice daily": "BID",
  "twice a day": "BID",
  tid: "TID",
  tds: "TID",
  thrice: "TID",
  "three times": "TID",
  "three times daily": "TID",
  qid: "QID",
  qds: "QID",
  "four times": "QID",
  "four times daily": "QID",
  eod: "EOD",
  "every other day": "EOD",
  w: "W",
  weekly: "W",
  bw: "BW",
  biweekly: "BW",
  m: "M",
  monthly: "M",
};

const ROUTE_ALIASES: Record<string, string> = {
  oral: "oral",
  po: "oral",
  bymouth: "oral",
  "by mouth": "oral",
  topical: "topical",
  iv: "intravenous",
  intravenous: "intravenous",
  im: "intramuscular",
  intramuscular: "intramuscular",
};

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return ymd(d);
}

function normalizeFrequency(raw: string): string | null {
  const key = raw.trim().toLowerCase().replace(/\s+/g, " ");
  if (FREQ_ALIASES[key]) return FREQ_ALIASES[key];
  const upper = raw.trim().toUpperCase();
  if (["QD", "BID", "TID", "QID", "EOD", "W", "BW", "M"].includes(upper)) {
    return upper;
  }
  return null;
}

function normalizeRoute(raw: string): string {
  const key = raw.trim().toLowerCase().replace(/\s+/g, " ");
  return ROUTE_ALIASES[key] || "oral";
}

function defaultTimes(frequency: string): string[] {
  const match = dose.find((d) => d.frequency === frequency);
  return match?.time ? [...match.time] : ["08:00"];
}

export type AddMedicationResult =
  | {
      ok: true;
      drug: string;
      frequency: string;
      route: string;
      start: string;
      end: string;
      time: string[];
      drugId: string;
      summary: string;
    }
  | {
      ok: false;
      error: string;
      needsAllergyOverride?: boolean;
    };

/**
 * Add a medication course for the signed-in user (drugs + schedule).
 * Used by AMANDA 6 tool calling.
 */
export async function addMedicationForUser(
  userId: string,
  input: {
    drug: string;
    frequency: string;
    route?: string;
    durationDays?: number;
    start?: string;
    end?: string;
    times?: string[];
    allergyOverride?: boolean;
  }
): Promise<AddMedicationResult> {
  const drugName = String(input.drug || "").trim().toLowerCase();
  if (!drugName) {
    return { ok: false, error: "Missing medication name." };
  }

  const frequency = normalizeFrequency(String(input.frequency || ""));
  if (!frequency) {
    return {
      ok: false,
      error:
        "Unrecognized frequency. Use QD/OD, BID/BD, TID, QID, EOD, W, BW, or M.",
    };
  }

  const route = normalizeRoute(String(input.route || "oral"));
  const start =
    input.start?.slice(0, 10) ||
    ymd(new Date());
  let end = input.end?.slice(0, 10) || "";

  if (!end) {
    const days = Math.max(1, Math.round(Number(input.durationDays) || 7));
    // Inclusive course length: 21 days → start + 20
    end = addDays(start, days - 1);
  }

  if (end < start) {
    return { ok: false, error: "End date cannot be before start date." };
  }

  const time =
    Array.isArray(input.times) && input.times.length > 0
      ? input.times.map((t) => String(t).trim()).filter(Boolean)
      : defaultTimes(frequency);

  const sql = getSql();

  const allergyRows = await sql`
    SELECT drug FROM allergies WHERE "userId" = ${userId}
  `;
  if (
    !input.allergyOverride &&
    isAllergicToDrug(drugName, allergyRows as Array<{ drug?: string | null }>)
  ) {
    return {
      ok: false,
      needsAllergyOverride: true,
      error: `'${drugName}' is on their allergy list. Ask them to confirm before adding, then retry with allergyOverride true.`,
    };
  }

  const existing = await sql`
    SELECT drug, start, "end", "drugId", reminder
    FROM drugs
    WHERE "userId" = ${userId}
  `;
  const rows = existing as Array<Record<string, unknown>>;
  const overlap = rows.find((row) => {
    if (!sameDrugName(String(row.drug || ""), drugName)) return false;
    const aStart = String(row.start || "").slice(0, 10);
    const aEnd = String(row.end || "").slice(0, 10);
    if (!aStart || !aEnd) return false;
    return start <= aEnd && aStart <= end;
  });
  if (overlap) {
    return {
      ok: false,
      error:
        "This medication already has an active course in that date range. Suggest waiting until it ends, or starting the day after.",
    };
  }

  const remindersOn =
    rows.length === 0 || rows.some((d) => d.reminder !== false);
  const drugId = generateDrugId(drugName);

  const payload: DrugProps = {
    drug: drugName,
    frequency,
    route,
    start,
    end,
    time,
    reminder: remindersOn,
    drugId,
  };

  await sql`
    INSERT INTO drugs ("userId", drug, frequency, route, start, "end", time, reminder, "drugId")
    VALUES (
      ${userId},
      ${payload.drug},
      ${payload.frequency},
      ${payload.route},
      ${payload.start},
      ${payload.end},
      ${JSON.stringify(payload.time)}::jsonb,
      ${Boolean(payload.reminder)},
      ${payload.drugId}
    )
  `;

  const scheduleRows = await sql`
    SELECT schedule FROM schedule WHERE "userId" = ${userId} LIMIT 1
  `;
  const currentSchedule = (scheduleRows[0]?.schedule ?? []) as ScheduleItem[];
  const newItems = generateSchedule(payload);
  const maxId = currentSchedule.reduce(
    (m, item) => Math.max(m, Number(item.id) || 0),
    0
  );
  const remapped = newItems.map((item, i) => ({
    ...item,
    id: maxId + i + 1,
  }));
  const updatedSchedule = [...currentSchedule, ...remapped];

  if (scheduleRows[0]) {
    await sql`
      UPDATE schedule SET schedule = ${JSON.stringify(updatedSchedule)}::jsonb
      WHERE "userId" = ${userId}
    `;
  } else {
    await sql`
      INSERT INTO schedule ("userId", schedule)
      VALUES (${userId}, ${JSON.stringify(updatedSchedule)}::jsonb)
    `;
  }

  const freqLabel =
    frequency === "BID"
      ? "twice daily"
      : frequency === "QD"
        ? "once daily"
        : frequency === "TID"
          ? "three times daily"
          : frequency === "QID"
            ? "four times daily"
            : frequency;

  return {
    ok: true,
    drug: drugName,
    frequency,
    route,
    start,
    end,
    time,
    drugId,
    summary: `Added ${drugName} (${route}, ${freqLabel}) from ${start} to ${end}.`,
  };
}

export function createAmandaTools(userId: string) {
  return {
    addMedication: tool({
      description:
        "Add a medication course to the user's NoDoseOff schedule. Use when they ask you to add, start, or log a drug (e.g. “add rifampicin oral bd x3 weeks”). Parse drug name, route, frequency (bd→BID, od→QD), and duration. Defaults: start today, oral route, standard dose times.",
      inputSchema: z.object({
        drug: z
          .string()
          .min(1)
          .describe("Medication name only, e.g. rifampicin (no dose strength required)"),
        frequency: z
          .string()
          .describe("Dosing frequency: QD/OD, BID/BD, TID, QID, EOD, W, BW, or M"),
        route: z
          .string()
          .optional()
          .describe("Route: oral, topical, intravenous, intramuscular. Default oral."),
        durationDays: z
          .number()
          .int()
          .positive()
          .optional()
          .describe(
            "Course length in days when end date not given. 3 weeks = 21. Default 7."
          ),
        start: z
          .string()
          .optional()
          .describe("YYYY-MM-DD start. Default today."),
        end: z
          .string()
          .optional()
          .describe("YYYY-MM-DD end. Prefer durationDays when they say “x3 weeks”."),
        times: z
          .array(z.string())
          .optional()
          .describe("Optional HH:MM dose times. Defaults by frequency."),
        allergyOverride: z
          .boolean()
          .optional()
          .describe(
            "Set true only after the user explicitly confirms adding a drug on their allergy list."
          ),
      }),
      execute: async (input) => addMedicationForUser(userId, input),
    }),
  };
}
