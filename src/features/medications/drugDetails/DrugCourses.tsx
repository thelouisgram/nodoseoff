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
}

const DrugCourses: React.FC<DrugCoursesProps> = ({ courses, schedule }) => {
  if (courses.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="mb-3 px-1 text-[11px] font-bold uppercase tracking-widest text-soft-muted">
        Courses ({courses.length})
      </h3>
      <div className="overflow-hidden rounded-2xl border border-black/[0.05] bg-white shadow-soft-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-black/[0.05] bg-soft-canvas text-[11px] font-semibold uppercase tracking-wide text-soft-muted">
                <th className="px-4 py-3">#</th>
                <th className="px-3 py-3">Start</th>
                <th className="px-3 py-3">End</th>
                <th className="px-3 py-3">Duration</th>
                <th className="px-3 py-3">Route</th>
                <th className="px-3 py-3">Frequency</th>
                <th className="px-3 py-3">Times</th>
                <th className="px-4 py-3">Adherence</th>
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
                  frequencyToPlaceholder[String(course.frequency || "").trim().toUpperCase()] ||
                  course.frequency ||
                  "—";
                const times = Array.isArray(course.time)
                  ? convertedTimes(course.time).join(", ") || "—"
                  : "—";

                return (
                  <tr
                    key={course.drugId || `${course.drug}-${index}`}
                    className="border-b border-black/[0.05] last:border-0"
                  >
                    <td className="px-4 py-3 font-semibold text-soft-ink">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-soft-muted">
                      {formatDate(course.start)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-soft-muted">
                      {formatDate(course.end)}
                    </td>
                    <td className="px-3 py-3">
                      <span className="inline-block rounded-[10px] bg-soft-mint px-2.5 py-1 text-[12px] font-medium text-soft-mint-ink">
                        {duration}
                      </span>
                    </td>
                    <td className="px-3 py-3 capitalize text-soft-muted">
                      {course.route || "—"}
                    </td>
                    <td className="px-3 py-3 text-soft-ink">{frequency}</td>
                    <td
                      className="max-w-[160px] truncate px-3 py-3 text-soft-muted"
                      title={times}
                    >
                      {times}
                    </td>
                    <td className="px-4 py-3 font-semibold text-soft-ink">
                      {compliance.compliance}%
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
