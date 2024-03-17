/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";

interface Stats {
  setShowStats: Function;
  showStats: boolean;
}

type RefObject<T> = React.RefObject<T>;

const Statistics: React.FC<Stats> = ({
  setShowStats,
  showStats,
}) => {
  const { drugs, effects, schedule } = useSelector(
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
        <div className={` h-[100dvh] w-full bg-white p-8 `}>
          <div className="w-full flex justify-end mb-10">
            <Image
              src="/assets/x (1).png"
              width={24}
              height={24}
              alt="cancel"
              onClick={() => {
                setShowStats(false);
              }}
              className="cursor-pointer"
            />
          </div>
          <div className="mb-10">
            <h1 className="text-[24px] text-darkBlue font-bold">
              Basic Statistics
            </h1>
          </div>
          <div className="w-full flex flex-col gap-4">
            <div className="w-full border border-gray-300 rounded-lg rounded-bl-none py-4 px-4 flex gap-2">
              <h2 className="font-semibold">Number of Drugs:</h2>
              <p>{drugs.length}</p>
            </div>
            <div className="w-full border border-gray-300 rounded-lg rounded-bl-none py-4 px-4 flex gap-2">
              <h2 className="font-semibold">Number of side effects:</h2>
              <p>{effects.length}</p>
            </div>
            <div className="w-full border border-gray-300 rounded-lg rounded-bl-none py-4 px-4 flex gap-2">
              <h2 className="font-semibold">Drug compliance:</h2>
              <p>{percentageCompleted.toFixed(1)}%</p>
            </div>
            <div className="w-full border border-gray-300 rounded-lg rounded-bl-none py-4 px-4 flex gap-2">
              <h2 className="font-semibold">Missed Doses:</h2>
              <p>{missedDoses}</p>
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={() => {
          setShowStats(false);
        }}
        className="absolute w-full h-full bg-blackII opacity-[40] z-[3]"
      />
    </div>
  );
};

export default Statistics;
