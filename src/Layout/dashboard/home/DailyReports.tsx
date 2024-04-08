import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";
import { generateDate, months } from "../../../../utils/calendar";
import cn from "../../../../utils/cn";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import Reports from "./Reports";
import { RootState } from "../../../../store";
import { useSelector } from "react-redux";

export default function DailyReports() {
  const { schedule } = useSelector((state: RootState) => state.app);
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const currentDate = dayjs();
  const [today, setToday] = useState<Dayjs>(currentDate);
  const [selectDate, setSelectDate] = useState<Dayjs>(currentDate);

  // Calculate completion tally based on schedule data
  const completionTally: Record<string, { total: number; completed: number }> =
    {};
  schedule.forEach((item) => {
    const date = dayjs(item.date).format("YYYY-MM-DD");
    if (!completionTally[date]) {
      completionTally[date] = { total: 0, completed: 0 };
    }
    completionTally[date].total++;
    if (item.completed) {
      completionTally[date].completed++;
    }
  });

  // Return the JSX structure for the calendar component
  return (
    <section className="w-full flex flex-col ip:flex-row items-start gap-4 ip:gap-10 px-4 ss:px-6 md:px-0 ss:pb-20 md:pb-0 h-auto text-[16px] font-Karla text-navyBlue">
      <div className="flex gap-10 w-full ip:max-w-[500px] bg-white border border-gray-300 rounded-[16px] flex-col p-3 ss:p-5 h-auto pb-4 ss:pb-5 font-karla text">
        <div className="w-auto h-full">
          <div className="flex justify-between items-center">
            <div className="flex justify-between w-full items-center mb-4">
              <GrFormPrevious
                className="w-12 md:w-14 h-5 cursor-pointer hover:scale-105 transition-all"
                onClick={() => {
                  setToday(today.month(today.month() - 1));
                }}
              />
              <h1 className="select-none font-[500] p-2 ss:p-3 text-[16px] ss:text-[18px]">
                {months[today.month()]} {today.year()}
              </h1>
              <GrFormNext
                className="w-12 md:w-14 h-5 cursor-pointer hover:scale-105 transition-all"
                onClick={() => {
                  setToday(today.month(today.month() + 1));
                }}
              />
            </div>
          </div>
          <div className="flex justify-between w-full mb-4">
            {days.map((day, index) => (
              <h1
                key={index}
                className="text-center w-full flex text-grey justify-center items-center select-none"
              >
                {day}
              </h1>
            ))}
          </div>
          <div className="grid grid-cols-7 mb-4">
            {generateDate(today.month(), today.year()).map(
              ({ date, currentMonth, today }, index) => {
                // Check if the date is in the past
                // Check if the date is in the past (including today)
                const isPastDate = date.isBefore(
                  dayjs().startOf("day").add(1, "day")
                );

                // Calculate completion percentage
                const completionPercentage =
                  (completionTally[dayjs(date).format("YYYY-MM-DD")]
                    ?.completed /
                    completionTally[dayjs(date).format("YYYY-MM-DD")]?.total) *
                    100 || 0;

                // Check if the date is currently selected
                const isSelected =
                  selectDate.toDate().toDateString() ===
                  date.toDate().toDateString();

                return (
                  <div
                    key={index}
                    className={cn(
                      "p-2 text-center relative h-12 md:h-14 grid place-content-center",
                      {
                        "border-[4px] border-dotted border-darkBlue":
                          today && !isPastDate && !isSelected,
                        "border border-[#0054DB]": isSelected && !isPastDate,
                        "hover:border hover:border-gray-300 border-darkBlue hover:text-white transition-all cursor-pointer select-none":
                          true,
                      }
                    )}
                    onClick={() => {
                      setSelectDate(date);
                    }}
                  >
                    <h1
                      className={cn(
                        // Conditionally applying classes based on date properties
                        currentMonth ? "" : "text-gray-400",
                        today
                          ? "border-[4px] border-dotted border-darkBlue"
                          : "",
                        selectDate.toDate().toDateString() ===
                          date.toDate().toDateString()
                          ? "border border-[#0054DB]"
                          : "",
                        `h-10 w-10 rounded-full grid place-content-center ${
                          today
                            ? "hover-border-[4px] border-darkBlue"
                            : "hover:border hover:border-gray-400"
                        } 0 transition-all cursor-pointer select-none`
                      )}
                      onClick={() => {
                        setSelectDate(date); // Update 'selectDate' state when a date is clicked
                      }}
                    >
                      {date.date()} {/* Displaying the date number */}
                      {/* Display the dot element based on completion percentage */}
                      {!today &&
                        isPastDate &&
                        completionTally[dayjs(date).format("YYYY-MM-DD")]
                          ?.total > 0 && (
                          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
                            <div
                              className="w-[5px] h-[5px] rounded-full"
                              style={{
                                backgroundColor:
                                  completionPercentage === 100
                                    ? "#4FCB83" // Green dot
                                    : completionPercentage > 0
                                    ? "#FFD166" // Yellow dot
                                    : "#EF476F", // Red dot
                              }}
                            />
                          </div>
                        )}
                    </h1>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
      <Reports today={today} selectDate={selectDate} />
    </section>
  );
}
