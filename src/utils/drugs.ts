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

function normalizeDrugName(name: string) {
  return name.trim().toLowerCase();
}

function courseSortKey(course: DrugProps) {
  const end = Date.parse(course.end || "");
  const start = Date.parse(course.start || "");
  return (Number.isNaN(end) ? 0 : end) * 1e13 + (Number.isNaN(start) ? 0 : start);
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
    const sorted = [...courses].sort(
      (a, b) => courseSortKey(b) - courseSortKey(a)
    );
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
