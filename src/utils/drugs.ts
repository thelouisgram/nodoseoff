import { DrugProps } from "@/types/dashboard";

export const drugsTab: string[] = [
  "ongoing",
  "completed",
  "allergies",
];

/** One list row per drug name; courses keep every distinct regimen. */
export type GroupedDrug = DrugProps & {
  courses: DrugProps[];
  courseCount: number;
};

/**
 * Collapse free-text drug labels for identity checks.
 * Strips strength/dose tokens so "ibuprofen" and "ibuprofen 40mg" match.
 */
export function normalizeDrugName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(
      /\b\d+([.,]\d+)?\s*(mg|mcg|µg|ug|g|ml|l|iu|units?|%|mg\/ml)\b/gi,
      " "
    )
    .replace(/[^a-z0-9\s/+-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function courseSortKey(course: DrugProps) {
  const end = Date.parse(course.end || "");
  const start = Date.parse(course.start || "");
  return (Number.isNaN(end) ? 0 : end) * 1e13 + (Number.isNaN(start) ? 0 : start);
}

/** Newest course first: latest start, then latest end. */
export function sortCoursesRecentFirst<T extends DrugProps>(courses: T[]): T[] {
  return [...courses].sort((a, b) => {
    const startDiff =
      Date.parse(String(b.start || "")) - Date.parse(String(a.start || ""));
    if (startDiff !== 0) return startDiff;
    const endDiff =
      Date.parse(String(b.end || "")) - Date.parse(String(a.end || ""));
    if (endDiff !== 0) return endDiff;
    return courseSortKey(b) - courseSortKey(a);
  });
}

/**
 * Course system:
 * - Storage may hold multiple regimen rows for the same drug name (refills/courses).
 * - UI counts, reports, and patient-facing lists MUST collapse by normalized name.
 * - Only course tables / details show every regimen separately.
 */

/** Unique ongoing drug names (courses of the same med count as one). */
export function countUniqueDrugNames(drugs: DrugProps[]): number {
  return groupDrugsByName(drugs).length;
}

/** One display name per drug; multi-course → "Paracetamol (4 courses)". */
export function formatDrugNamesWithCourses(drugs: DrugProps[]): string[] {
  return groupDrugsByName(drugs).map((g) => {
    const name = (g.drug || "").trim();
    if (!name) return "";
    if (g.courseCount > 1) return `${name} (${g.courseCount} courses)`;
    return name;
  }).filter(Boolean);
}

/** Unique display names without course suffixes (case preserved from latest). */
export function uniqueDrugDisplayNames(drugs: DrugProps[]): string[] {
  return groupDrugsByName(drugs)
    .map((g) => (g.drug || "").trim())
    .filter(Boolean);
}

/** Collapse duplicate drug names into one row (latest course as summary). */
export function groupDrugsByName(drugs: DrugProps[]): GroupedDrug[] {
  const map = new Map<string, DrugProps[]>();

  for (const drug of drugs) {
    const key = normalizeDrugName(drug.drug || "");
    if (!key) continue;
    const list = map.get(key) ?? [];
    list.push(drug);
    map.set(key, list);
  }

  const grouped: GroupedDrug[] = [];
  for (const courses of map.values()) {
    const sorted = sortCoursesRecentFirst(courses);
    const latest = sorted[0];
    grouped.push({
      ...latest,
      courses: sorted,
      courseCount: sorted.length,
    });
  }

  return grouped.sort((a, b) =>
    a.drug.localeCompare(b.drug, undefined, { sensitivity: "base" })
  );
}

export function sameDrugName(a: string, b: string) {
  return normalizeDrugName(a) === normalizeDrugName(b);
}

/** Nickname when set (privacy for reminders); otherwise the real drug name. */
export function drugDisplayName(d: {
  drug?: string;
  nickname?: string;
}) {
  const nick = String(d.nickname || "").trim();
  if (nick) return nick;
  return String(d.drug || "").trim();
}

/** True when a med name should be blocked by a recorded allergy. */
export function drugMatchesAllergy(drugName: string, allergyName: string) {
  const drug = normalizeDrugName(drugName);
  const allergy = normalizeDrugName(allergyName);
  if (!drug || !allergy) return false;
  if (drug === allergy) return true;

  const drugTokens = drug.split(" ").filter(Boolean);
  const allergyTokens = allergy.split(" ").filter(Boolean);

  // Allergy "ibuprofen" blocks "ibuprofen tablet" / "advil ibuprofen"
  if (
    allergyTokens.length === 1 &&
    drugTokens.includes(allergyTokens[0])
  ) {
    return true;
  }
  // Allergy "ibuprofen tablet" still blocks plain "ibuprofen"
  if (
    drugTokens.length === 1 &&
    allergyTokens.includes(drugTokens[0])
  ) {
    return true;
  }

  return false;
}

export function isAllergicToDrug(
  drugName: string,
  allergies: Array<{ drug?: string | null }>
) {
  return allergies.some((item) =>
    drugMatchesAllergy(drugName, String(item.drug || ""))
  );
}

/** First matching allergy label for warnings (preserves stored spelling). */
export function findMatchingAllergy(
  drugName: string,
  allergies: Array<{ drug?: string | null }>
) {
  const match = allergies.find((item) =>
    drugMatchesAllergy(drugName, String(item.drug || ""))
  );
  return match?.drug?.trim() || "";
}

/** Inclusive YYYY-MM-DD range overlap (ISO dates compare lexicographically). */
export function courseRangesOverlap(
  a: { start?: string; end?: string },
  b: { start?: string; end?: string }
): boolean {
  const aStart = String(a.start || "").slice(0, 10);
  const aEnd = String(a.end || "").slice(0, 10);
  const bStart = String(b.start || "").slice(0, 10);
  const bEnd = String(b.end || "").slice(0, 10);
  if (!aStart || !aEnd || !bStart || !bEnd) return false;
  return aStart <= bEnd && bStart <= aEnd;
}

/** Day after a YYYY-MM-DD end date (UTC-safe via noon local parse). */
export function dayAfter(isoDate: string): string {
  const d = new Date(`${String(isoDate).slice(0, 10)}T12:00:00`);
  if (Number.isNaN(d.getTime())) return String(isoDate).slice(0, 10);
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function dayBefore(isoDate: string): string {
  const d = new Date(`${String(isoDate).slice(0, 10)}T12:00:00`);
  if (Number.isNaN(d.getTime())) return String(isoDate).slice(0, 10);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Earliest start for a new course of this drug: the day after the latest
 * ongoing end that would otherwise collide, or `today` when free.
 */
export function nextAvailableCourseStart(
  ongoingForDrug: DrugProps[],
  today = new Date().toISOString().slice(0, 10)
): string {
  let earliest = today;
  for (const course of ongoingForDrug) {
    const end = String(course.end || "").slice(0, 10);
    if (!end) continue;
    const next = dayAfter(end);
    if (next > earliest) earliest = next;
  }
  return earliest;
}

export function findOverlappingCourse(
  ongoingForDrug: DrugProps[],
  candidate: { start?: string; end?: string; drugId?: string }
): DrugProps | undefined {
  return ongoingForDrug.find((course) => {
    if (
      candidate.drugId &&
      course.drugId &&
      course.drugId === candidate.drugId
    ) {
      return false;
    }
    return courseRangesOverlap(course, candidate);
  });
}

/**
 * Only one active course per drug name may run at a time.
 * Prefer newest start → newest end → highest id; clip superseded ends.
 */
export function collapseOverlappingCourses<T extends DrugProps>(
  drugs: T[]
): { keep: T[]; superseded: T[] } {
  const byName = new Map<string, T[]>();
  for (const drug of drugs) {
    const key = normalizeDrugName(drug.drug || "");
    if (!key) continue;
    const list = byName.get(key) ?? [];
    list.push(drug);
    byName.set(key, list);
  }

  const keep: T[] = [];
  const superseded: T[] = [];

  for (const group of byName.values()) {
    const sorted = [...group].sort((a, b) => {
      const startDiff =
        Date.parse(String(b.start || "")) - Date.parse(String(a.start || ""));
      if (startDiff !== 0) return startDiff;
      const endDiff =
        Date.parse(String(b.end || "")) - Date.parse(String(a.end || ""));
      if (endDiff !== 0) return endDiff;
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    });

    const keptForName: T[] = [];
    for (const course of sorted) {
      const conflict = keptForName.find((k) =>
        courseRangesOverlap(k, course)
      );
      if (!conflict) {
        keptForName.push(course);
        keep.push(course);
        continue;
      }
      const clippedEnd = dayBefore(String(conflict.start || course.end));
      const originalEnd = String(course.end || "").slice(0, 10);
      const end =
        clippedEnd && clippedEnd < originalEnd ? clippedEnd : originalEnd;
      superseded.push({ ...course, end });
    }
  }

  return { keep, superseded };
}

export function calculateTimePeriod(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "—";
  }

  const durationInDays = Math.max(
    0,
    Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  );

  if (durationInDays <= 0) return "< 1 day";
  if (durationInDays === 1) return "1 day";

  const years = Math.floor(durationInDays / 365);
  const afterYears = durationInDays % 365;
  const months = Math.floor(afterYears / 30);
  const afterMonths = afterYears % 30;
  const weeks = Math.floor(afterMonths / 7);
  const days = afterMonths % 7;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years}y`);
  if (months > 0) parts.push(`${months}mo`);
  if (weeks > 0) parts.push(`${weeks}w`);
  if (days > 0) parts.push(`${days}d`);

  return parts.join(" ") || "—";
}

export const convertedTimes = (times: string[]) => {

  return times.map(time => {
    const [hours, minutes] = time.split(':');
    let suffix = 'AM';
    let hours12 = parseInt(hours, 10);
    if (hours12 >= 12) {
      suffix = 'PM';
      if (hours12 > 12) {
        hours12 -= 12;
      }
    }
    return `${hours12}:${minutes} ${suffix}`;
  });
};


export function generateDrugID(drugName: string) {
    // Get the current date and time
    const now = new Date();

    // Format the date as YYYYMMDD
    const date = now.toISOString().split('T')[0].replace(/-/g, '');

    // Format the time as HHMMSS (24-hour format)
    const time = now.toTimeString().split(' ')[0].replace(/:/g, '');

    // Construct the ID by combining date, time, and drug name
    const id = `${date}_${time}_${drugName}`;

    return id;
}

export const generateDrugId = (drugName: string) => {
  const now = new Date();
const formattedDate = now.toISOString().split('T')[0]; // Current date as YYYY-MM-DD
const formattedTime = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // Current time as HH-MM-SS
const drugId = `${drugName}_${formattedDate}_${formattedTime}`; // Combine drugName, date, and time
return drugId;
};
