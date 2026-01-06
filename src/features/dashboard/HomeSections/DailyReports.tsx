import dayjs, { Dayjs } from "dayjs";
import React, { useMemo, useState } from "react";
import { generateDate, months } from "@/utils/calendar";
import cn from "@/utils/cn";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import Reports from "../Reports";

import { useAppStore } from "@/store/useAppStore";
import { useSchedule } from "@/hooks/useDashboardData";
import { motion, AnimatePresence } from "framer-motion";

export default function DailyReports() {
  const { userId } = useAppStore((state) => state);
  const { data: schedule = [] } = useSchedule(userId);

  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const todaySystem = dayjs();

  const [viewMonth, setViewMonth] = useState<Dayjs>(todaySystem);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(todaySystem);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Map of date -> completion tally
  const completionTally = useMemo(() => {
    const map: Record<string, { total: number; completed: number }> = {};
    schedule.forEach((item) => {
      const key = dayjs(item.date).format("YYYY-MM-DD");
      map[key] ??= { total: 0, completed: 0 };
      map[key].total++;
      if (item.completed) map[key].completed++;
    });
    return map;
  }, [schedule]);

  const calendarDates = generateDate(viewMonth.month(), viewMonth.year());

  // Mobile injection index
  const injectionIndex = useMemo(() => {
    if (!isMobile) return -1;

    const idx = calendarDates.findIndex(
      ({ date }) =>
        date.toDate().toDateString() === selectedDate.toDate().toDateString()
    );

    if (idx === -1) return -1;
    return Math.min((Math.floor(idx / 7) + 1) * 7, calendarDates.length);
  }, [calendarDates, isMobile, selectedDate]);

  // Calendar grid with injection
  const calendarGrid = calendarDates.reduce<JSX.Element[]>(
    (acc, { date, currentMonth }, idx) => {
      // Inject report for mobile if needed (not last row)
      if (isMobile && idx === injectionIndex && idx !== calendarDates.length) {
        acc.push(
          <motion.div
            key="mobile-report"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="col-span-7 overflow-hidden"
          >
            <div className="mt-2 mb-4">
              <Reports today={viewMonth} selectDate={selectedDate} isMobile />
            </div>
          </motion.div>
        );
      }

      const key = date.format("YYYY-MM-DD");
      const tally = completionTally[key];
      const isSelected =
        date.toDate().toDateString() === selectedDate.toDate().toDateString();
      const isPast = date.isBefore(todaySystem.startOf("day").add(1, "day"));
      const percent =
        tally && tally.total ? (tally.completed / tally.total) * 100 : 0;

      acc.push(
        <button
          key={idx}
          onClick={() => setSelectedDate(date)}
          className={cn(
            "h-12 flex flex-col items-center justify-center rounded-lg border transition-all duration-200 relative",
            currentMonth
              ? "bg-white border-gray-200 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200"
              : "bg-gray-50 text-gray-400 border-gray-100 dark:bg-slate-900 dark:border-slate-800 dark:text-gray-500",
            isSelected &&
              "border-transparent dark:border-transparent text-blue-600 dark:text-blue-400"
          )}
        >
          {isSelected && (
            <motion.div
              layoutId="selectedDate"
              className="absolute inset-0 bg-blue-50 dark:bg-blue-900/30 border border-blue-500 rounded-lg shadow-sm"
              transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            />
          )}
          <span className="text-sm font-medium relative z-10">
            {date.date()}
          </span>
          {currentMonth && isPast && (
            <span
              className={cn(
                "mt-1 h-2 w-2 rounded-full relative z-10",
                !tally
                  ? "bg-gray-300"
                  : percent === 100
                    ? "bg-green-500"
                    : percent > 0
                      ? "bg-yellow-400"
                      : "bg-red-500"
              )}
            />
          )}
        </button>
      );

      return acc;
    },
    []
  );

  // Inject report at the end if last row is selected
  if (isMobile && injectionIndex === calendarDates.length) {
    calendarGrid.push(
      <motion.div
        key="mobile-report-end"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="col-span-7 overflow-hidden"
      >
        <div className="mt-2 mb-4">
          <Reports today={viewMonth} selectDate={selectedDate} isMobile />
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <h3 className="mt-10 mb-4 px-4 ss:px-8 md:px-0 text-[18px] font-semibold text-gray-800 dark:text-slate-100">
        Daily Reports
      </h3>

      <section className="flex flex-col ip:flex-row gap-6 px-4 ss:px-6 md:px-0">
        {/* Calendar Card */}
        <div className="w-full ip:max-w-[520px] bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setViewMonth(viewMonth.subtract(1, "month"))}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-slate-200 transition"
            >
              <GrFormPrevious />
            </button>

            <div className="flex gap-2">
              <select
                value={viewMonth.month()}
                onChange={(e) =>
                  setViewMonth(viewMonth.month(Number(e.target.value)))
                }
                className="text-sm border border-gray-200 dark:border-gray-600 rounded px-3 py-1 bg-transparent dark:text-gray-200"
              >
                {months.map((m, i) => (
                  <option key={i} value={i} className="dark:bg-dark">
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={viewMonth.year()}
                onChange={(e) =>
                  setViewMonth(viewMonth.year(Number(e.target.value)))
                }
                className="text-sm border border-gray-200 dark:border-gray-600 rounded px-3 py-1 bg-transparent dark:text-gray-200"
              >
                {Array.from(
                  { length: 11 },
                  (_, i) => todaySystem.year() - 5 + i
                ).map((y) => (
                  <option key={y} value={y} className="dark:bg-dark">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setViewMonth(viewMonth.add(1, "month"))}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 transition"
            >
              <GrFormNext />
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 mb-2 text-xs text-gray-400 text-center">
            {days.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 overflow-hidden relative min-h-[300px]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={viewMonth.format("YYYY-MM")}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="col-span-7 grid grid-cols-7 gap-2"
              >
                {calendarGrid}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Desktop Reports */}
        <div className="hidden ss:block w-full">
          <Reports
            today={viewMonth}
            selectDate={selectedDate}
            isMobile={false}
          />
        </div>
      </section>
    </>
  );
}
