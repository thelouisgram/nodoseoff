"use client";

import React, { SetStateAction, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store";
import { setActiveDrug, setActiveDrugId } from "@/store/appSlice";
import { useSchedule } from "@/hooks/useDashboardData";
import { DrugProps } from "@/types/dashboard";
import { calculateTimePeriod, convertedTimes } from "@/utils/drugs";
import { formatDate, frequencyToPlaceholder } from "@/utils/dashboard/dashboard";
import { calculateDrugCompliance } from "@/utils/dashboard/drugs";
import OptionModal from "../optionModal";

interface CompletedCoursesTableProps {
  courses: DrugProps[];
  startIndex?: number;
  options: boolean;
  setOptions: React.Dispatch<SetStateAction<boolean>>;
  activeAction: string;
  setActiveAction: (value: string) => void;
  setActiveView: React.Dispatch<SetStateAction<"details" | "list">>;
  activeView: string;
}

function formatFrequency(freq: string) {
  if (!freq) return "—";
  const key = freq.trim().toUpperCase();
  return frequencyToPlaceholder[key] || freq;
}

export default function CompletedCoursesTable({
  courses,
  startIndex = 0,
  options,
  setOptions,
  activeAction,
  setActiveAction,
  setActiveView,
  activeView,
}: CompletedCoursesTableProps) {
  const dispatch = useAppDispatch();
  const { userId, activeDrugId } = useAppSelector((state) => state.app);
  const { data: schedule = [] } = useSchedule(userId);

  const rows = useMemo(() => {
    return [...courses].sort((a, b) => {
      const aEnd = Date.parse(a.end || "") || 0;
      const bEnd = Date.parse(b.end || "") || 0;
      if (bEnd !== aEnd) return bEnd - aEnd;
      return (a.drug || "").localeCompare(b.drug || "", undefined, {
        sensitivity: "base",
      });
    });
  }, [courses]);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
        <thead>
          <tr className="border-b border-black/[0.05] bg-soft-canvas text-[11px] font-semibold uppercase tracking-wide text-soft-muted">
            <th className="px-4 py-3 ss:px-6">#</th>
            <th className="px-3 py-3">Medication</th>
            <th className="px-3 py-3">Route</th>
            <th className="px-3 py-3">Start</th>
            <th className="px-3 py-3">End</th>
            <th className="px-3 py-3">Duration</th>
            <th className="px-3 py-3">Frequency</th>
            <th className="px-3 py-3">Times</th>
            <th className="px-3 py-3">Adherence</th>
            <th className="px-4 py-3 text-right ss:px-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence mode="popLayout">
            {rows.map((course, index) => {
              const isActive = activeDrugId === course.drugId;
              const compliance = calculateDrugCompliance(
                schedule,
                course.drugId
              );
              const duration = calculateTimePeriod(course.start, course.end);
              const times = Array.isArray(course.time)
                ? convertedTimes(course.time).join(", ") || "—"
                : "—";
              const rowKey =
                course.drugId ||
                `${course.drug}-${course.start}-${course.end}-${startIndex + index}`;

              return (
                <motion.tr
                  key={rowKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => {
                    dispatch(setActiveDrug(course.drug));
                    dispatch(setActiveDrugId(course.drugId));
                    setActiveView("details");
                  }}
                  className={`cursor-pointer border-b border-black/[0.05] last:border-0 hover:bg-soft-canvas/80 ${
                    isActive ? "bg-soft-primary-soft/40" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3.5 ss:px-6">
                    <span
                      className={`flex size-8 items-center justify-center rounded-[10px] text-[12px] font-semibold ${
                        isActive
                          ? "bg-soft-primary text-soft-card"
                          : "bg-soft-canvas text-soft-muted"
                      }`}
                    >
                      {startIndex + index + 1}
                    </span>
                  </td>
                  <td className="max-w-[160px] truncate px-3 py-3.5 font-semibold capitalize text-soft-ink">
                    {course.drug}
                  </td>
                  <td className="px-3 py-3.5 capitalize text-soft-muted">
                    {course.route?.trim() || "—"}
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
                  <td className="px-3 py-3.5">
                    <span className="inline-block max-w-[120px] truncate rounded-[10px] bg-soft-primary-soft px-2.5 py-1 text-[12px] font-medium text-soft-primary">
                      {formatFrequency(course.frequency)}
                    </span>
                  </td>
                  <td
                    className="max-w-[140px] truncate px-3 py-3.5 text-soft-muted"
                    title={times}
                  >
                    {times}
                  </td>
                  <td className="px-3 py-3.5">
                    <span className="font-semibold text-soft-ink">
                      {compliance.compliance}%
                    </span>
                  </td>
                  <td
                    className="px-4 py-3.5 text-right ss:px-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative inline-flex justify-end">
                      <OptionModal
                        options={options && isActive}
                        setOptions={setOptions}
                        tab="completed"
                        drug={course.drug}
                        drugId={course.drugId}
                        activeAction={activeAction}
                        setActiveAction={setActiveAction}
                        setActiveView={setActiveView}
                        activeView={activeView}
                      />
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
