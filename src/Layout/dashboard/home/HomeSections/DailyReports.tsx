import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";
import { generateDate, months } from "../../../../../utils/calendar";
import cn from "../../../../../utils/cn";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import Reports from "../Reports";
import { RootState } from "../../../../../store";
import { useSelector } from "react-redux";

export default function DailyReports() {
  const { schedule } = useSelector((state: RootState) => state.app);
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const currentDate = dayjs();

  const [today, setToday] = useState<Dayjs>(currentDate);
  const [selectDate, setSelectDate] = useState<Dayjs>(currentDate);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Tally completion status for easy calendar lookup
  const completionTally: Record<string, { total: number; completed: number }> =
    {};
  schedule.forEach((item) => {
    const dateKey = dayjs(item.date).format("YYYY-MM-DD");
    completionTally[dateKey] = completionTally[dateKey] || {
      total: 0,
      completed: 0,
    };
    completionTally[dateKey].total++;
    if (item.completed) completionTally[dateKey].completed++;
  });

  const calendarDates = generateDate(today.month(), today.year());

  // Calculate the index after the row of the selected date for mobile report injection
  let reportInjectionIndex = -1;
  if (isMobile) {
    const selectedDateIndex = calendarDates.findIndex(
      ({ date }) =>
        selectDate.toDate().toDateString() === date.toDate().toDateString()
    );
    if (selectedDateIndex !== -1) {
      reportInjectionIndex = Math.min(
        (Math.floor(selectedDateIndex / 7) + 1) * 7,
        calendarDates.length
      );
    }
  }

  const calendarElements = calendarDates.reduce(
    (acc, { date, currentMonth, today: isToday }, idx) => {
      // Mobile Injection Point
      if (isMobile && idx === reportInjectionIndex) {
        acc.push(
          <div
            key="mobile-reports-insert"
            className="col-span-7 mt-2 mb-2 bg-white rounded-lg p-2"
          >
            <Reports today={today} selectDate={selectDate} isMobile={true} />
          </div>
        );
      }

      const dateKey = dayjs(date).format("YYYY-MM-DD");
      const tally = completionTally[dateKey];
      const isPast = date.isBefore(currentDate.startOf("day").add(1, "day"));
      const percentage = (tally?.completed / tally?.total) * 100 || 0;
      const isSelected =
        selectDate.toDate().toDateString() === date.toDate().toDateString();
      const isTodayDate = isToday && !isSelected;

      acc.push(
        <div
          key={idx}
          className="relative flex flex-col items-center justify-center h-14 cursor-pointer transition-all duration-200 rounded-2xl group"
          onClick={() => setSelectDate(date)}
        >
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full font-normal transition-all duration-200",
              !currentMonth && "text-gray-400",
              currentMonth &&
                !isSelected &&
                !isTodayDate &&
                "text-gray-700 hover:bg-gray-100",
              currentMonth &&
                isTodayDate &&
                "bg-blue-500 text-white ring-4 ring-blue-300 shadow-lg scale-110",
              currentMonth &&
                isSelected &&
                "bg-pink-500 text-white ring-4 ring-pink-300 shadow-xl scale-110"
            )}
          >
            {date.date()}
          </div>

          {/* Completion Dot underneath - only show for current month */}
          {currentMonth && tally && tally.total > 0 && isPast && (
            <div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full"
              style={{
                backgroundColor:
                  percentage === 100
                    ? "#4FCB83" // Green for 100%
                    : percentage > 0
                      ? "#FFD166" // Yellow for partial
                      : "#EF476F", // Red for 0%
              }}
            />
          )}
        </div>
      );
      return acc;
    },
    [] as JSX.Element[]
  );

  // If the last element of the calendar is selected, the report needs to be injected after the loop ends
  if (isMobile && reportInjectionIndex === calendarDates.length) {
    calendarElements.push(
      <div
        key="mobile-reports-insert-end"
        className="col-span-7 mt-2 mb-2 bg-white rounded-lg p-2"
      >
        <Reports today={today} selectDate={selectDate} isMobile={true} />
      </div>
    );
  }

  return (
    <>
      <h3 className=" mt-10 text-[18px] font-semibold text-navyBlue mb-3 px-4 ss:px-8 md:px-0">
        Daily Reports
      </h3>
      <section className="w-full flex flex-col ip:flex-row items-start gap-6 px-4 ss:px-6 md:px-0 ss:pb-20 md:pb-0 text-[16px] font-Karla text-navyBlue">
        {/* Modern Calendar Container */}
        <div className="flex flex-col w-full ip:max-w-[520px] bg-white rounded-3xl p-6 gap-5 border border-gray-200">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 gap-2">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95"
              onClick={() => setToday(today.subtract(1, "month"))}
            >
              <GrFormPrevious className="w-5 h-5" />
            </button>

            <div className="flex gap-2 items-center">
              <select
                value={today.month()}
                onChange={(e) =>
                  setToday(today.month(parseInt(e.target.value)))
                }
                className="font-semibold text-lg text-gray-800 bg-white border-2 border-gray-200 rounded-xl px-4 py-2 hover:border-blue-400 focus:border-blue-500 focus:outline-none cursor-pointer transition-all appearance-none bg-no-repeat bg-right pr-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundSize: "1.5rem",
                  backgroundPosition: "right 0.5rem center",
                }}
              >
                {months.map((month, idx) => (
                  <option key={idx} value={idx}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                value={today.year()}
                onChange={(e) => setToday(today.year(parseInt(e.target.value)))}
                className="font-semibold text-lg text-gray-800 bg-white border-2 border-gray-200 rounded-xl px-4 py-2 hover:border-blue-400 focus:border-blue-500 focus:outline-none cursor-pointer transition-all appearance-none bg-no-repeat bg-right pr-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundSize: "1.5rem",
                  backgroundPosition: "right 0.5rem center",
                }}
              >
                {Array.from(
                  { length: 11 },
                  (_, i) => currentDate.year() - 5 + i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95"
              onClick={() => setToday(today.add(1, "month"))}
            >
              <GrFormNext className="w-5 h-5" />
            </button>
          </div>

          {/* Days of the week */}
          <div className="grid grid-cols-7 text-gray-500 font-normal mb-2 text-center text-sm">
            {days.map((day, idx) => (
              <div key={idx} className="py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">{calendarElements}</div>
        </div>

        {/* Desktop View: Reports */}
        <div className="hidden ip:block w-full">
          <Reports today={today} selectDate={selectDate} isMobile={false} />
        </div>
      </section>
    </>
  );
}
