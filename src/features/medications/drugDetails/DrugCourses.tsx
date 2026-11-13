import React from "react";
import { DrugProps, ScheduleItem } from "@/types/dashboard";
import { calculateTimePeriod, convertedTimes } from "@/utils/drugs";
import { formatDate, frequencyToPlaceholder } from "@/utils/dashboard/dashboard";
import { calculateDrugCompliance } from "@/utils/dashboard/drugs";
import { motion } from "framer-motion";
import { ndoEase } from "@/components/landing/motion";

interface DrugCoursesProps {
  courses: DrugProps[];
  schedule: ScheduleItem[];
  tab?: string;
}

function adherenceTone(pct: number) {
  if (pct >= 80) return "text-[#1a7a6d] bg-[#dff5ee]";
  if (pct >= 60) return "text-[#8a5a2b] bg-[#f3ebe0]";
  return "text-[#8a3d5a] bg-[#ffe4ee]";
}

function barTone(pct: number) {
  if (pct >= 80) return "bg-[#1a7a6d]";
  if (pct >= 60) return "bg-[#c4a574]";
  return "bg-[#c45a7a]";
}

const DrugCourses: React.FC<DrugCoursesProps> = ({
  courses,
  schedule,
  tab = "completed",
}) => {
  if (courses.length <= 1) return null;

  const subtitle =
    tab === "completed"
      ? "Finished regimens of this medication"
      : "Each separate start of this medication";

  return (
    <div className="mt-8">
      <div className="mb-4 px-0.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-soft-muted">
          Courses
        </p>
        <h3 className="mt-0.5 text-[16px] font-bold tracking-tight text-soft-ink">
          {courses.length} regimens
        </h3>
        <p className="mt-0.5 text-[13px] text-soft-muted">{subtitle}</p>
      </div>

      {/* Mobile */}
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
          const pct = compliance.compliance;
          const empty = compliance.totalDoses === 0;

          return (
            <motion.article
              key={course.drugId || `${course.drug}-${index}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.28,
                ease: ndoEase,
                delay: Math.min(index * 0.04, 0.2),
              }}
              className="overflow-hidden rounded-2xl border border-black/[0.05] bg-white p-4 shadow-soft-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold tabular-nums tracking-[0.08em] text-soft-muted">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-1 text-[14px] font-semibold text-soft-ink">
                    {formatDate(course.start)}
                    <span className="mx-1.5 text-soft-muted/50">→</span>
                    {formatDate(course.end)}
                  </p>
                  <p className="mt-1 text-[12px] text-soft-muted">
                    {duration} · {frequency}
                    {course.route ? ` · ${course.route}` : ""}
                  </p>
                  <p className="mt-0.5 truncate text-[12px] text-soft-muted">
                    {times}
                  </p>
                </div>
                {pct != null ? (
                  <span
                    className={`shrink-0 rounded-md px-2 py-1 text-[12px] font-bold tabular-nums ${adherenceTone(pct)}`}
                  >
                    {pct}%
                  </span>
                ) : (
                  <span className="shrink-0 rounded-md bg-soft-canvas px-2 py-1 text-[12px] font-semibold text-soft-muted">
                    —
                  </span>
                )}
              </div>
              <div className="mt-3">
                <div className="h-1.5 overflow-hidden rounded-full bg-soft-canvas">
                  <div
                    className={`h-full rounded-full transition-all ${
                      pct != null ? barTone(pct) : "bg-transparent"
                    }`}
                    style={{
                      width: pct != null ? `${Math.min(100, pct)}%` : "0%",
                    }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] tabular-nums text-soft-muted">
                  {empty
                    ? "No doses on this course yet"
                    : `${compliance.completedDoses} of ${compliance.totalDoses} doses${
                        compliance.missedDoses
                          ? ` · ${compliance.missedDoses} missed`
                          : ""
                      }${
                        compliance.remainingDoses
                          ? ` · ${compliance.remainingDoses} left`
                          : ""
                      }`}
                </p>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Desktop ledger */}
      <div className="hidden overflow-hidden rounded-2xl border border-black/[0.05] bg-white shadow-soft-sm ss:block">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-black/[0.05]">
                {[
                  "#",
                  "Window",
                  "Duration",
                  "Route",
                  "Schedule",
                  "Progress",
                  "Adherence",
                ].map((label) => (
                  <th
                    key={label}
                    className="px-4 py-3 text-[11px] font-semibold tracking-[0.08em] text-soft-muted first:pl-5 last:pr-5"
                  >
                    {label}
                  </th>
                ))}
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
                const pct = compliance.compliance;
                const empty = compliance.totalDoses === 0;

                return (
                  <tr
                    key={course.drugId || `${course.drug}-${index}`}
                    className="group border-b border-black/[0.04] last:border-0 hover:bg-soft-canvas/60"
                  >
                    <td className="px-4 py-4 first:pl-5">
                      <span className="text-[12px] font-semibold tabular-nums text-soft-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="whitespace-nowrap text-[13px] font-semibold text-soft-ink">
                        {formatDate(course.start)}
                        <span className="mx-1.5 font-normal text-soft-muted/45">
                          →
                        </span>
                        {formatDate(course.end)}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-[13px] text-soft-muted">
                      {duration}
                    </td>
                    <td className="px-4 py-4 text-[13px] capitalize text-soft-muted">
                      {course.route || "—"}
                    </td>
                    <td className="max-w-[200px] px-4 py-4">
                      <p className="text-[13px] font-medium text-soft-ink">
                        {frequency}
                      </p>
                      <p
                        className="mt-0.5 truncate text-[12px] text-soft-muted"
                        title={times}
                      >
                        {times}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      {empty ? (
                        <p className="text-[13px] text-soft-muted">No doses yet</p>
                      ) : (
                        <>
                          <p className="text-[13px] font-semibold tabular-nums text-soft-ink">
                            {compliance.completedDoses} of{" "}
                            {compliance.totalDoses}
                          </p>
                          <p className="mt-0.5 text-[11px] tabular-nums text-soft-muted">
                            {[
                              compliance.missedDoses
                                ? `${compliance.missedDoses} missed`
                                : null,
                              compliance.remainingDoses
                                ? `${compliance.remainingDoses} left`
                                : null,
                            ]
                              .filter(Boolean)
                              .join(" · ") || "All accounted for"}
                          </p>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-4 last:pr-5">
                      {pct == null ? (
                        <span className="text-[13px] font-semibold text-soft-muted">
                          —
                        </span>
                      ) : (
                        <div className="flex min-w-[110px] items-center gap-2.5">
                          <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-soft-canvas">
                            <div
                              className={`h-full rounded-full ${barTone(pct)}`}
                              style={{
                                width: `${Math.min(100, Math.max(0, pct))}%`,
                              }}
                            />
                          </div>
                          <span
                            className={`shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-bold tabular-nums ${adherenceTone(pct)}`}
                            title="Based on doses already due — upcoming doses don’t lower this"
                          >
                            {pct}%
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="border-t border-black/[0.04] px-5 py-2.5 text-[11px] text-soft-muted">
          Adherence is scored from doses already due. Upcoming doses aren’t
          counted against you.
        </p>
      </div>
    </div>
  );
};

export default DrugCourses;
