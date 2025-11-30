import dayjs, { Dayjs } from "dayjs";
import React, { useMemo, useState } from "react";
import { generateDate, months } from "../../../../../utils/calendar";
import cn from "../../../../../utils/cn";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import Reports from "../Reports";
import { RootState } from "../../../../../store";
import { useSelector } from "react-redux";

export default function DailyReports() {
  const { schedule } = useSelector((state: RootState) => state.app);

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
  const calendarGrid = calendarDates.reduce<JSX.Element[]>((acc, { date, currentMonth }, idx) => {
    // Inject report for mobile if needed (not last row)
    if (isMobile && idx === injectionIndex && idx !== calendarDates.length) {
      acc.push(
        <div key="mobile-report" className="col-span-7 mt-2 mb-2">
          <Reports today={viewMonth} selectDate={selectedDate} isMobile />
        </div>
      );
    }

    const key = date.format("YYYY-MM-DD");
    const tally = completionTally[key];
    const isSelected = date.toDate().toDateString() === selectedDate.toDate().toDateString();
    const isPast = date.isBefore(todaySystem.startOf("day").add(1, "day"));
    const percent = tally && tally.total ? (tally.completed / tally.total) * 100 : 0;

    acc.push(
      <button
        key={idx}
        onClick={() => setSelectedDate(date)}
        className={cn(
          "h-12 flex flex-col items-center justify-center rounded-lg border transition-all duration-200",
          currentMonth
            ? "bg-white border-gray-200 "
            : "bg-gray-50 text-gray-400 border-gray-100",
          isSelected && "border-blue-500 bg-blue-10 text-blue-700"
        )}
      >
        <span className="text-sm font-medium">{date.date()}</span>
        {currentMonth && isPast && (
          <span
            className={cn(
              "mt-1 h-2 w-2 rounded-full",
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
  }, []);

  // Inject report at the end if last row is selected
  if (isMobile && injectionIndex === calendarDates.length) {
    calendarGrid.push(
      <div key="mobile-report-end" className="col-span-7 mt-2 mb-2">
        <Reports today={viewMonth} selectDate={selectedDate} isMobile />
      </div>
    );
  }

  return (
    <>
      <h3 className="mt-10 mb-4 px-4 ss:px-8 md:px-0 text-[18px] font-semibold text-slate-800">
        Daily Reports
      </h3>

      <section className="flex flex-col ip:flex-row gap-6 px-4 ss:px-6 md:px-0">
        {/* Calendar Card */}
        <div className="w-full ip:max-w-[520px] bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setViewMonth(viewMonth.subtract(1, "month"))}
              className="p-2 rounded hover:bg-gray-100 transition"
            >
              <GrFormPrevious />
            </button>

            <div className="flex gap-2">
              <select
                value={viewMonth.month()}
                onChange={(e) => setViewMonth(viewMonth.month(Number(e.target.value)))}
                className="text-sm border border-gray-200 rounded px-3 py-1"
              >
                {months.map((m, i) => (
                  <option key={i} value={i}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={viewMonth.year()}
                onChange={(e) => setViewMonth(viewMonth.year(Number(e.target.value)))}
                className="text-sm border border-gray-200 rounded px-3 py-1"
              >
                {Array.from({ length: 11 }, (_, i) => todaySystem.year() - 5 + i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setViewMonth(viewMonth.add(1, "month"))}
              className="p-2 rounded hover:bg-gray-100 transition"
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
          <div className="grid grid-cols-7 gap-2">{calendarGrid}</div>
        </div>

        {/* Desktop Reports */}
        <div className="hidden ss:block w-full">
          <Reports today={viewMonth} selectDate={selectedDate} isMobile={false} />
        </div>
      </section>
    </>
  );
}
