"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { calculateClosestDoseCountdown } from "../../../../utils/dashboard";
import { format } from "date-fns";
import { FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { updateSchedule } from "../../../../store/stateSlice";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Drug } from "../../../../types";

interface HomeProps {
  setEffectsForm: Function;
  setDrugsForm: Function;
}

interface DoseProps {
  id: number;
  drug: string;
  time: string;
  completed: boolean;
  date: string;
}

const Home: React.FC<HomeProps> = ({ setEffectsForm, setDrugsForm }) => {
  const { drugs, name, schedule } = useSelector(
    (state: RootState) => state.app
  );

  const dispatch = useDispatch();
  const [displayIndex, setDisplayIndex] = useState(0);

  const [countDown, setCountDown] = useState("");
  const [tracker, setTracker] = useState("Today");
  const today = new Date();
  const yesterday = new Date(today.getTime() - 86400000);

  const formattedToday = format(today, "yyyy-MM-dd");
  const formattedYesterday = format(yesterday, "yyyy-MM-dd");

  useEffect(() => {
    // Function to update the countdown value every second
    const updateCountdown = () => {
      const newCountdown = calculateClosestDoseCountdown(schedule);
      setCountDown(newCountdown); // Update the state with the new countdown value
    };

    // Call the function initially when the component mounts
    updateCountdown();

    // Update the countdown value every second
    const intervalId = setInterval(updateCountdown, 1000);

    // Clean up the interval to avoid memory leaks
    return () => clearInterval(intervalId);
  }, [schedule]);

  const todaysDose: Drug[] = schedule
    .filter((drug: Drug) => {
      return drug.date === formattedToday;
    })
    .sort((a: Drug, b: Drug) => {
      const timeA = a.time;
      const timeB = b.time;

      if (timeA < timeB) {
        return -1;
      } else if (timeA > timeB) {
        return 1;
      } else {
        return 0;
      }
    });

  const yesterdaysDose = schedule
    .filter((drug: Drug) => {
      return drug.date === formattedYesterday;
    })
    .sort((a: Drug, b: Drug) => {
      const timeA = a.time;
      const timeB = b.time;

      if (timeA < timeB) {
        return -1;
      } else if (timeA > timeB) {
        return 1;
      } else {
        return 0;
      }
    });

  function updateCompleted(item: DoseProps) {
    const rightDoseIndex = schedule.findIndex(
      (dose) =>
        dose.date === item.date &&
        dose.time === item.time &&
        dose.drug === item.drug
    );

    if (rightDoseIndex !== -1) {
      // Creating a deep copy of the array segment
      const updatedScheduleSegment = JSON.parse(
        JSON.stringify(schedule.slice(0, rightDoseIndex + 1))
      );

      // Modifying the deep copy
      updatedScheduleSegment[rightDoseIndex].completed =
        !updatedScheduleSegment[rightDoseIndex].completed;

      // Combining the updated segment with the remaining schedule
      const updatedSchedule = [
        ...updatedScheduleSegment,
        ...schedule.slice(rightDoseIndex + 1),
      ];

      // Assuming 'dispatch' is used to update the state (e.g., in Redux)
      dispatch(updateSchedule(updatedSchedule));
    }
  }

  const dosesToRender = (tracker === "Today" ? todaysDose : yesterdaysDose).map(
    (item: DoseProps, index: number) => {
      const [hourString, minutes] = item.time.split(":");
      const hour = parseInt(hourString); // Convert the hour string to a number

      let timeSuffix = "";
      if (hour < 12) {
        timeSuffix = "AM";
      } else {
        timeSuffix = "PM";
      }

      let convertedHour = hour;
      if (convertedHour > 12) {
        convertedHour -= 12;
      }

      const formattedTime = `${convertedHour}:${minutes}${timeSuffix}`;

      return (
        <div
          key={index}
          className="py-6 px-4 md:px-6 bg-none border border-gray-300 rounded-[10px] items-center rounded-bl-none flex justify-between w-full font-Inter text-[14px]"
        >
          <div className="flex gap-6 ss:gap-10 text-navyBlue ">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/tablet.png"
                width={512}
                height={512}
                alt="meds"
                className="w-[26px] h-[26px] hidden ss:flex"
              />
              <div className="flex flex-col">
                <h3 className="font-semibold text-[12px] hidden ss:flex">
                  Drug
                </h3>
                <p className="capitalize ">{item.drug}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Image
                src="/assets/clock.png"
                width={512}
                height={512}
                alt="clock"
                className="w-[24px] h-[24px] hidden ss:flex"
              />
              <div className="flex flex-col">
                <h3 className="font-semibold text-[12px] hidden ss:flex">
                  Time
                </h3>
                <p>{formattedTime}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <h2 className="font-montserrant">Taken:</h2>
            <button
              className={`${
                !item.completed ? "bg-none text" : "bg-navyBlue text-white"
              } border-[2px] border-navyBlue text-white px-1 py-1 rounded-full`}
              onClick={() => updateCompleted(item)}
            >
              <FaCheck className="text-[12px]" />
            </button>
          </div>
        </div>
      );
    }
  );

  const displayedDoses = dosesToRender.slice(displayIndex, displayIndex + 4);

  const handleNext = () => {
    if (displayIndex + 4 < dosesToRender.length) {
      setDisplayIndex(displayIndex + 4);
    }
  };

  const handlePrev = () => {
    if (displayIndex - 4 >= 0) {
      setDisplayIndex(displayIndex - 4);
    }
  };

  const currentTime = new Date(); // Get the current date and time

  const completedBeforeCurrentTime = schedule.filter((dose) => {
    const doseDateTime = new Date(`${dose.date}T${dose.time}`);
    return doseDateTime <= currentTime && dose.completed;
  });

  const totalBeforeCurrentTime = schedule.filter((dose) => {
    const doseDateTime = new Date(`${dose.date}T${dose.time}`);
    return doseDateTime <= currentTime;
  });

  let percentageCompleted = 0;

  if (totalBeforeCurrentTime.length > 0) {
    percentageCompleted =
      (completedBeforeCurrentTime.length / totalBeforeCurrentTime.length) * 100;
  }

  return (
    <div className="w-full h-[100dvh] overflow-y-scroll md:py-16 md:px-12 pt-10 pb-24 ss:py-10 text-navyBlue font-karla relative">
      <div className="mb-[28px] px-4 ss:px-8 md:px-0">
        <h1 className="text-[24px] ss:text-[32px] font-semibold font-montserrant ">
          {"Hello " + name},
        </h1>
        <p className="text-[16px] text-[#718096]">Your health matters!</p>
      </div>
      <div className="w-full flex justify-between items-center px-4 ss:px-8 md:px-0">
        <button
          onClick={() => {
            setDrugsForm(true);
          }}
          className="mb-3 w-[160px] cursor-pointer h-[40px] bg-navyBlue rounded-[10px] rounded-bl-none flex justify-center items-center 
          font-bold text-white"
        >
          + ADD DRUG
        </button>
      </div>
      <section className="md:w-full flex gap-4 ss:gap-5 mb-10 ss:mb-16 overflow-x-scroll md:overflow-hidden px-4 ss:px-8 md:px-0 bar">
        <div className="min-w-[300px] ss:w-full h-[120px] ss:h-[150px] bg-[#7E1CE6] rounded-[10px] rounded-bl-none flex justify-start items-center p-4 gap-2">
          <Image
            src="/assets/sandclock.png"
            alt="clock"
            width={512}
            height={512}
            quality={100}
            className="w-[50px] h-[50px]"
          />
          <div className="flex flex-col text-white justify-center w-full items-start gap-1">
            <h2 className="leading-none font-semibold text-[14px]">
              Next dose in
            </h2>
            <h4 className="font-bold text-[28px] tracking-wider leading-none">
              {countDown || "00:00:00"}
            </h4>
          </div>
        </div>
        <div className="min-w-[300px] ss:w-full h-[120px] ss:h-[150px] bg-blackBlue rounded-[10px] rounded-bl-none flex justify-start items-center p-4 gap-2">
          <Image
            src="/assets/pills.png"
            alt="drugs"
            width={100}
            height={100}
            className="w-[50px] h-[50px]"
          />
          <div className="flex flex-col text-white justify-center w-full items-start gap-1">
            <h2 className="leading-none font-semibold text-[14px]">
              Number of Drugs
            </h2>
            <h4 className="font-bold text-[28px] tracking-wider leading-none">
              {drugs.length}
            </h4>
          </div>
        </div>
        <div className="min-w-[300px] ss:w-full h-[120px] ss:h-[150px] bg-darkBlue rounded-[10px] rounded-bl-none flex justify-start items-center py-4 pl-4 gap-2">
          <Image
            src="/assets/shield.png"
            alt="shield"
            width={100}
            height={100}
            quality={100}
            className="w-[50px] h-[50px]"
          />
          <div className="flex flex-col text-white justify-center w-full items-start gap-1">
            <h2 className="leading-none font-semibold text-[14px]">
              Drug Compliance
            </h2>
            <h4 className="font-bold text-[28px] tracking-wider leading-none">
              {percentageCompleted.toFixed(0)}%
            </h4>
          </div>
        </div>
      </section>
      <section className="mb-10 ss:mb-16 px-4 ss:px-8 md:px-0">
        <h3 className="text-[18px] font-semibold text-navyBlue mb-3">
          Medication Tracker
        </h3>
        <div className="w-[300px] h-auto flex border border-gray-300 rounded-md rounded-bl-none mb-8 overflow-hidden">
          <div
            onClick={() => {
              setTracker("Yesterday");
            }}
            className={`${
              tracker === "Yesterday" ? "bg-navyBlue text-white" : "bg-none"
            } w-1/2 flex justify-center cursor-pointer py-1`}
          >
            Yesterday
          </div>
          <div
            onClick={() => {
              setTracker("Today");
            }}
            className={`${
              tracker === "Today" ? "bg-navyBlue text-white" : "bg-none"
            } w-1/2 flex justify-center cursor-pointer py-1`}
          >
            Today
          </div>
        </div>
        {displayedDoses.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 gap-6">{displayedDoses}</div>
            <div className="w-full flex gap-3 justify-center mt-8">
              <button
                onClick={handlePrev}
                disabled={displayIndex === 0}
                className={` ${
                  displayIndex === 0 ? "opacity-20" : "opacity-100"
                } border border-gray-300 rounded-md rounded-bl-none px-4 py-1 cursor-pointer`}
              >
                <FaArrowLeft />
              </button>
              <button
                className={` ${
                  displayIndex + 4 >= dosesToRender.length
                    ? "opacity-20"
                    : "opacity-100"
                } border border-gray-300 rounded-md rounded-bl-none px-4 py-1 cursor-pointer"`}
                onClick={handleNext}
                disabled={displayIndex + 4 >= dosesToRender.length}
              >
                <FaArrowRight />
              </button>
            </div>
          </>
        ) : (
          <div className="w-full md:w-1/2 py-6 px-4  border border-gray-300 rounded-md items-center rounded-bl-none flex gap-3">
            <FaExclamationTriangle /> No dose for this day
          </div>
        )}
      </section>
      <h3 className="text-[18px] font-semibold text-navyBlue mb-3 px-4 ss:px-8 md:px-0">
        Daily Reports
      </h3>
      <Calendar />
    </div>
  );
};

export default Home;
