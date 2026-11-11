import React from "react";
import { DrugProps, ScheduleItem } from "@/types/dashboard";
import {
  calculateTimePeriod,
  convertedTimes,
} from "@/utils/drugs";
import { formatDate, frequencyToPlaceholder } from "@/utils/dashboard/dashboard";
import { calculateDrugCompliance } from "@/utils/dashboard/drugs";

interface DrugCoursesProps {
  courses: DrugProps[];
  schedule: ScheduleItem[];
  tab?: string;
}

const DrugCourses: React.FC<DrugCoursesProps> = ({
  courses,
  schedule,
  tab = "completed",
}) => {
  if (courses.length === 0) return null;

  const subtitle =
    tab === "completed"
      ? "Each finished regimen for this medication"
      : "Each active regimen for this medication";

  return (
    <div className="mt-8">
      <div className="mb-3 px-1">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-soft-muted">
          Courses ({courses.length})
        </h3>
        <p className="mt-0.5 text-[13px] text-soft-muted">{subtitle}</p>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 ss:hidden">
        {courses.map((course, index) => {
          const compliance = calculateDrugCompliance(schedule, course.drugId);
          const duration = calculateTimePeriod(course.start, course.end);
          const frequency =
            frequencyToPlaceholder[
              String(course.frequency || "").trim().toUpperCase()
            ] ||
            course.frequency ||
            "—";
          const times = Array.isArray(course.time)
            ? convertedTimes(course.time).join(", ") || "—"
            : "—";

          return (
            <div
              key={course.drugId || `${course.drug}-${index}`}
              className="rounded-2xl border border-black/[0.05] bg-white p-4 shadow-soft-sm"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-soft-muted">
                  Course {index + 1}
                </span>
                <span className="rounded-[10px] bg-soft-primary-soft px-2.5 py-1 text-[12px] font-semibold text-soft-primary">
                  {compliance.compliance}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[13px]">
                <div>
                  <p className="text-[11px] text-soft-muted">Start</p>
                  <p className="font-medium text-soft-ink">
                    {formatDate(course.start)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-soft-muted">End</p>
                  <p className="font-medium text-soft-ink">
                    {formatDate(course.end)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-soft-muted">Duration</p>
                  <p className="font-medium text-soft-ink">{duration}</p>
                </div>
                <div>
                  <p className="text-[11px] text-soft-muted">Route</p>
                  <p className="font-medium capitalize text-soft-ink">
                    {course.route || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-soft-muted">Frequency</p>
                  <p className="font-medium text-soft-ink">{frequency}</p>
                </div>
                <div>
                  <p className="text-[11px] text-soft-muted">Times</p>
                  <p className="truncate font-medium text-soft-ink" title={times}>
                    {times}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-soft-muted">Taken</p>
                  <p className="font-medium text-soft-ink">
                    {compliance.completedDoses}/{compliance.totalDoses}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-soft-muted">Missed</p>
                  <p className="font-medium text-soft-ink">
                    {compliance.missedDoses}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop / tablet table */}
      <div className="hidden overflow-hidden rounded-2xl border border-black/[0.05] bg-white shadow-soft-sm ss:block">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[780px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-black/[0.05] bg-soft-canvas text-[11px] font-semibold uppercase tracking-wide text-soft-muted">
                <th className="sticky left-0 z-[1] bg-soft-canvas px-4 py-3">
                  #
                </th>
                <th className="px-3 py-3">Start</th>
                <th className="px-3 py-3">End</th>
                <th className="px-3 py-3">Duration</th>
                <th className="px-3 py-3">Route</th>
                <th className="px-3 py-3">Frequency</th>
                <th className="px-3 py-3">Times</th>
                <th className="px-3 py-3">Taken</th>
                <th className="px-3 py-3">Missed</th>
                <th className="px-4 py-3 text-right">Adherence</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => {
                const compliance = calculateDrugCompliance(
                  schedule,
                  course.drugId
                );
                const duration = calculateTimePeriod(course.start, course.end);
                const frequency =
                  frequencyToPlaceholder[
                    String(course.frequency || "").trim().toUpperCase()
                  ] ||
                  course.frequency ||
                  "—";
                const times = Array.isArray(course.time)
                  ? convertedTimes(course.time).join(", ") || "—"
                  : "—";

                return (
                  <tr
                    key={course.drugId || `${course.drug}-${index}`}
                    className="group border-b border-black/[0.05] last:border-0 hover:bg-soft-canvas/60"
                  >
                    <td className="sticky left-0 z-[1] bg-white px-4 py-3.5 font-semibold text-soft-ink group-hover:bg-soft-canvas/60">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-soft-muted">
                      {formatDate(course.start)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-soft-muted">
                      {formatDate(course.end)}
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="inline-block rounded-[10px] bg-soft-mint px-2.5 py-1 text-[12px] font-medium text-soft-mint-ink">
                        {duration}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 capitalize text-soft-muted">
                      {course.route || "—"}
                    </td>
                    <td className="px-3 py-3.5 text-soft-ink">{frequency}</td>
                    <td
                      className="max-w-[160px] truncate px-3 py-3.5 text-soft-muted"
                      title={times}
                    >
                      {times}
                    </td>
                    <td className="px-3 py-3.5 font-medium tabular-nums text-soft-ink">
                      {compliance.completedDoses}/{compliance.totalDoses}
                    </td>
                    <td className="px-3 py-3.5 font-medium tabular-nums text-soft-ink">
                      {compliance.missedDoses}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="inline-flex rounded-[10px] bg-soft-primary-soft px-2.5 py-1 text-[12px] font-semibold text-soft-primary">
                        {compliance.compliance}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DrugCourses;
