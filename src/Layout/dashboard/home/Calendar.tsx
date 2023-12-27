import dayjs, { Dayjs } from "dayjs"; // Importing dayjs and Dayjs types
import React, { useState } from "react"; // Importing React and useState hook
import { generateDate, months } from "../../../../utils/calendar"; // Importing utility functions for generating dates and months
import cn from "../../../../utils/cn"; // Importing a utility function for conditionally joining classNames
import { GrFormNext, GrFormPrevious } from "react-icons/gr"; // Importing next and previous icons
import DailyReports from "./DailyReports";

// Calendar component definition
export default function Calendar() {
  const days = ["S", "M", "T", "W", "T", "F", "S"]; // Array of weekdays abbreviated names

  const currentDate = dayjs(); // Get the current date using dayjs

  // State variables using the useState hook with specified types
  const [today, setToday] = useState<Dayjs>(currentDate);
  const [selectDate, setSelectDate] = useState<Dayjs>(currentDate);

  // Return the JSX structure for the calendar component
  return (
    <section className="w-full flex flex-col ip:flex-row items-start gap-6 md:gap-10 px-4 ss:px-6 md:px-0 ss:pb-20 md:pb-0 h-auto text-[16px]">
      <div className="flex gap-10 w-full md:w-1/2 flex-col p-3 ss:p-5 bg-lightBlue rounded-[12px] rounded-bl-none h-auto">
        <div className="w-auto h-full">
          <div className="flex justify-between items-center">
            {/* Displaying the current month and year */}
            <h1 className="select-none font-semibold">
              {months[today.month()]}, {today.year()}
            </h1>
            <div className="flex gap-10 items-center">
              {/* Buttons for navigating to the previous month, returning to the current month, and navigating to the next month */}
              <GrFormPrevious
                className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
                onClick={() => {
                  setToday(today.month(today.month() - 1)); // Update 'today' state to show the previous month
                }}
              />
              <h1
                className="cursor-pointer hover:scale-105 transition-all"
                onClick={() => {
                  setToday(currentDate); // Reset 'today' state to the current date
                }}
              >
                Today
              </h1>
              <GrFormNext
                className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
                onClick={() => {
                  setToday(today.month(today.month() + 1)); // Update 'today' state to show the next month
                }}
              />
            </div>
          </div>
          {/* Rendering weekdays */}
          <div className="flex justify-between w-full">
            {days.map((day, index) => {
              return (
                <h1
                  key={index}
                  className=" text-center w-full flex justify-center h-12 ss:h-14 items-center text-gray-500 select-none"
                >
                  {day}
                </h1>
              );
            })}
          </div>

          {/* Rendering dates for the current month */}
          <div className="grid grid-cols-7">
            {/* Mapping through the generated dates for the current month */}
            {generateDate(today.month(), today.year()).map(
              ({ date, currentMonth, today }, index) => {
                return (
                  <div
                    key={index}
                    className="p-2 text-center h-10 ss:h-14 grid place-content-center "
                  >
                    {/* Rendering individual date cells */}
                    <h1
                      className={cn(
                        // Conditionally applying classes based on date properties
                        currentMonth ? "" : "text-gray-400",
                        today ? "bg-darkBlue text-white" : "",
                        selectDate.toDate().toDateString() ===
                          date.toDate().toDateString()
                          ? "bg-navyBlue text-white"
                          : "",
                        "h-10 w-10 rounded-full grid place-content-center hover:bg-navyBlue hover:text-white transition-all cursor-pointer select-none"
                      )}
                      onClick={() => {
                        setSelectDate(date); // Update 'selectDate' state when a date is clicked
                      }}
                    >
                      {date.date()} {/* Displaying the date number */}
                    </h1>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
      <DailyReports today={today} selectDate={selectDate} />
    </section>
  );
}
