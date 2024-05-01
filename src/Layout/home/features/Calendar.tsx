import React from "react";
import Image from "next/image";
import { days } from "../../../../utils/landingpage";

// Calendar component
const Calendar = () => {
  // Function to generate an array of numbers from 1 to 31
  const generateNumbersArray = () => {
    const numbersArray = [];
    for (let i = 1; i <= 31; i++) {
      numbersArray.push(i);
    }
    return numbersArray;
  };

  // Function to check if a number is prime
  const isPrime = (num:number) => {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
  };

  // Function to get the color based on date number
  const getColorForDate = (num:number) => {
    if (isPrime(num)) {
      // Prime numbers will have yellow color
      return "#FFD166";
    } else if (num % 2 === 0) {
      // Even numbers will have red color
      return "#EF476F";
    } else {
      // Odd numbers will have green color
      return "#4FCB83";
    }
  };

  // Generating rendered dates with specified color circles
  const renderedDates = generateNumbersArray().map((num, index) => {
    const color = getColorForDate(num);
    const circleStyle = {
      width: "0.25rem",
      height: "0.25rem",
      borderRadius: "50%",
      backgroundColor: color,
    };

    return (
      <div key={index} className="flex flex-col items-center">
        <h1>{num}</h1>
        <div style={circleStyle} />
      </div>
    );
  });

  // Return the Calendar component
  return (
    <div className="w-full h-auto px-5 py-6 bg-white rounded-[16px] shadow-md">
      <div>
        {/* Month navigation */}
        <div className="flex items-center justify-between">
          <Image
            src="/assets/down.png"
            width="16"
            height="16"
            alt="arrow"
            className="rotate-90"
          />
          <h3 className="font-[500]">April 2024</h3>
          <Image
            src="/assets/down.png"
            width="16"
            height="16"
            alt="arrow"
            className="-rotate-90"
          />
        </div>

        {/* Days of the week */}
        <div className="grid grid-cols-7 gap-3 my-4">
          {days.map((day, index) => (
            <h1
              key={index}
              className="text-[14px] text-center flex text-grey justify-center items-center select-none"
            >
              {day}
            </h1>
          ))}
        </div>

        {/* Rendered dates */}
        <div className="w-full grid grid-cols-7 gap-3 text-[14px]">
          {renderedDates}
        </div>
      </div>
    </div>
  );
};

export default Calendar;