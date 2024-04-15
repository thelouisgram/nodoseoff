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

  // Function to generate a random color from a predefined array of colors
  const generateRandomColor = () => {
    const colors = ['#4FCB83', '#FFD166', '#EF476F'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  // Generating rendered dates with random color circles
  const renderedDates = generateNumbersArray().map((num, index) => {
    const color = generateRandomColor();
    const circleStyle = {
      width: '0.25rem',
      height: '0.25rem',
      borderRadius: '50%',
      backgroundColor: color,
      marginTop: '0rem'
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
    <div className="w-full h-auto px-5 py-6 bg-white rounded-[16px]">
      <div w-full>
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
        <div className="w-full grid grid-cols-7 gap-3 text-[14px]">{renderedDates}</div>
      </div>
    </div>
  );
};

export default Calendar;