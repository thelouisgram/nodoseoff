/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { X } from "lucide-react";

interface Stats {
  setShowStats: Function;
  showStats: boolean;
}

type RefObject<T> = React.RefObject<T>;

const Statistics: React.FC<Stats> = ({ setShowStats, showStats }) => {
  const { drugs, schedule } = useSelector(
    (state: RootState) => state.app
  );

  const currentTime = new Date(); // Get the current date and time

  const dropdownRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent): void => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowStats(false);
    }
  };
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      handleClickOutside(event);
    };

    // add event listener for clicks outside of dropdown
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      // remove event listener when component unmounts
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const completedBeforeCurrentTime = schedule.filter((dose) => {
    const doseDateTime = new Date(`${dose?.date}T${dose?.time}`);
    return doseDateTime <= currentTime && dose?.completed;
  });

  const totalBeforeCurrentTime = schedule.filter((dose) => {
    const doseDateTime = new Date(`${dose?.date}T${dose?.time}`);
    return doseDateTime <= currentTime;
  });

  const missedDoses =
    totalBeforeCurrentTime.length - completedBeforeCurrentTime.length;

  let percentageCompleted = 0;

  if (totalBeforeCurrentTime.length > 0) {
    percentageCompleted =
      (completedBeforeCurrentTime.length / totalBeforeCurrentTime.length) * 100;
  }

  return (
    <div
      className={`${
        showStats ? "w-full min-h-[100dvh] h-full" : "w-0 h-0"
      } right-0 bg-none fixed z-[32]`}
    >
      <div
        ref={dropdownRef}
        className={`${
          showStats
            ? "right-0 ss:w-[450px] h-full"
            : "-right-[450px] ss:w-[450px] h-full"
        } transition-all duration-300 absolute  bg-white h-full w-full z-[4] `}
      >
        <div
          className={` h-[100dvh] w-full bg-white p-8 overflow-y-scroll text-navyBlue text-[14px]`}
        >
          <div className="w-full flex justify-end mb-10">
            <button
              onClick={() => {
                setShowStats(false);
              }}
              className="cursor-pointer"
            >
              <X className="text-gray-800 size-6" />
            </button>
          </div>
          <div className="mb-10">
            <h1 className="text-[24px] text-blue-700 font-bold">
              Basic Statistics
            </h1>
          </div>
          <div className="w-full flex flex-col gap-4">
            <div className="w-full border border-gray-300 rounded-lg  py-4 px-4 flex flex-col-reverse">
              <h2 className="text-grey">Number of Drugs</h2>
              <p className="font-semibold text-[18px]">{drugs.length}</p>
            </div>
            <div className="w-full border border-gray-300 rounded-lg  py-4 px-4 flex flex-col-reverse">
              <h2 className="text-grey">Drug compliance</h2>
              <p className="font-semibold text-[18px]">
                {percentageCompleted.toFixed(1)}%
              </p>
            </div>
            <div className="w-full border border-gray-300 rounded-lg  py-4 px-4 flex flex-col-reverse">
              <h2 className="text-grey">Missed Doses</h2>
              <p className="font-semibold text-[18px]">{missedDoses}</p>
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={() => {
          setShowStats(false);
        }}
        className="absolute w-full h-full bg-grey opacity-[40] z-[3]"
      />
    </div>
  );
};

export default Statistics;
