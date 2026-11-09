import { loadDashboardForUser } from "@/lib/server/dashboard-data";

type MedRow = {
  drug?: unknown;
  frequency?: unknown;
  route?: unknown;
  start?: unknown;
  end?: unknown;
  time?: unknown;
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

/** Build a compact medication snapshot for the AI system prompt. */
export async function buildUserMedsContext(userId: string): Promise<string> {
  try {
    const data = await loadDashboardForUser(userId);
    const active = (data.activeDrugs || []) as MedRow[];
    const allergies = (data.allergies || []) as MedRow[];
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

    lines.push(
      "When answering, prefer these listed meds. Do not invent prescriptions they are not taking. If the list is empty, say so and ask them to add meds in the Drugs tab or name a medication."
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
