import dayjs, { Dayjs } from "dayjs";
import React, { useMemo, useState } from "react";
import { generateDate, months } from "@/utils/calendar";
import cn from "@/utils/cn";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import Reports from "../Reports";

import { useAppSelector } from "@/store";
import { useSchedule } from "@/hooks/useDashboardData";
import { motion, AnimatePresence } from "framer-motion";

export default function DailyReports() {
  const { userId } = useAppSelector((state) => state.app);
  const { data: schedule = [] } = useSchedule(userId);

  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const todaySystem = dayjs();

  const [viewMonth, setViewMonth] = useState<Dayjs>(todaySystem);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(todaySystem);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

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

  const injectionIndex = useMemo(() => {
    if (!isMobile) return -1;

    const idx = calendarDates.findIndex(
      ({ date }) =>
        date.toDate().toDateString() === selectedDate.toDate().toDateString()
    );

    if (idx === -1) return -1;
    return Math.min((Math.floor(idx / 7) + 1) * 7, calendarDates.length);
  }, [calendarDates, isMobile, selectedDate]);

  const calendarGrid = calendarDates.reduce<React.ReactElement[]>(
    (acc, { date, currentMonth }, idx) => {
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
            <div className="mb-4 mt-2">
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
            "relative flex h-12 flex-col items-center justify-center rounded-soft-sm border transition-all duration-200",
            currentMonth
              ? "border-black/[0.05] bg-white text-soft-ink"
              : "border-transparent bg-transparent text-soft-muted/50",
            isSelected && "border-transparent text-soft-ink"
          )}
        >
          {isSelected && (
            <motion.div
              layoutId="selectedDate"
              className="absolute inset-0 rounded-soft-sm border border-soft-ink/15 bg-soft-peach shadow-soft-sm"
              transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            />
          )}
          <span className="relative z-10 text-sm font-medium">{date.date()}</span>
          {currentMonth && isPast && (
            <span
              className={cn(
                "relative z-10 mt-1 h-1.5 w-1.5 rounded-full",
                !tally
                  ? "bg-black/15"
                  : percent === 100
                    ? "bg-green-400"
                    : percent > 0
                      ? "bg-yellow-400"
                      : "bg-red-400"
              )}
            />
          )}
        </button>
      );

      return acc;
    },
    []
  );

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
        <div className="mb-4 mt-2">
          <Reports today={viewMonth} selectDate={selectedDate} isMobile />
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <div className="mb-4 mt-8 px-4 ss:px-8 md:mt-10 md:px-0">
        <h3 className="text-[18px] font-semibold tracking-tight text-soft-ink">
          Daily reports
        </h3>
        <p className="mt-0.5 text-[13px] text-soft-muted">
          See how your week has been going
        </p>
      </div>

      <section className="flex flex-col gap-6 px-4 ss:px-6 ip:flex-row md:px-0">
        <div className="w-full rounded-2xl border border-black/[0.05] bg-white p-5 shadow-soft-sm ip:max-w-[520px]">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => setViewMonth(viewMonth.subtract(1, "month"))}
              className="rounded-soft-sm p-2 text-soft-ink transition hover:bg-white"
            >
              <GrFormPrevious />
            </button>

            <div className="flex gap-2">
              <div className="flex h-[38px] items-center rounded-soft-sm border border-black/[0.06] bg-white px-3">
                <select
                  value={viewMonth.month()}
                  onChange={(e) =>
                    setViewMonth(viewMonth.month(Number(e.target.value)))
                  }
                  className="w-full cursor-pointer border-none bg-transparent p-0 text-sm text-soft-ink outline-none"
                >
                  {months.map((m, i) => (
                    <option key={i} value={i}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex h-[38px] items-center rounded-soft-sm border border-black/[0.06] bg-white px-3">
                <select
                  value={viewMonth.year()}
                  onChange={(e) =>
                    setViewMonth(viewMonth.year(Number(e.target.value)))
                  }
                  className="w-full cursor-pointer border-none bg-transparent p-0 text-sm text-soft-ink outline-none"
                >
                  {Array.from(
                    { length: 11 },
                    (_, i) => todaySystem.year() - 5 + i
                  ).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => setViewMonth(viewMonth.add(1, "month"))}
              className="rounded-soft-sm p-2 text-soft-ink transition hover:bg-white"
            >
              <GrFormNext />
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 text-center text-xs text-soft-muted">
            {days.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="relative grid min-h-[300px] grid-cols-7 gap-2 overflow-hidden">
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

        <div className="hidden w-full ss:block">
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
