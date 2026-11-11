import { loadDashboardForUser } from "@/lib/server/dashboard-data";

type MedRow = {
  drug?: unknown;
  frequency?: unknown;
  route?: unknown;
  start?: unknown;
  end?: unknown;
  time?: unknown;
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

/** Build a compact medication snapshot for the AI system prompt. */
export async function buildUserMedsContext(userId: string): Promise<string> {
  try {
    const data = await loadDashboardForUser(userId);
    const active = (data.activeDrugs || []) as MedRow[];
    const allergies = (data.allergies || []) as MedRow[];
    const journal = (data.healthJournal || []) as JournalRow[];
    const otc = String(data.otcDrugs || "").trim();
    const herbs = String(data.herbs || "").trim();

    const lines: string[] = [
      "Patient medication context from their NoDoseOff dashboard (use this when they say “my drugs”, “my meds”, or ask without naming a drug):",
    ];

    if (active.length === 0) {
      lines.push("- Active medications: none on file.");
    } else {
      lines.push("Active medications:");
      for (const d of active.slice(0, 40)) {
        lines.push(formatMedLine(d));
      }
    }

    if (allergies.length > 0) {
      lines.push("Medication allergies / intolerance flags:");
      for (const a of allergies.slice(0, 20)) {
        lines.push(`- ${String(a.drug || "").trim() || "Unknown"}`);
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
    const active = (data.activeDrugs || []) as MedRow[];
    const names = active
      .map((d) => String(d.drug || "").trim())
      .filter(Boolean);
    return Array.from(new Set(names));
  } catch {
    return [];
  }
}
