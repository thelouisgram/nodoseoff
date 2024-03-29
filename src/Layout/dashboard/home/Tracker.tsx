import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import Image from "next/image";

interface TrackerProps {
  tracker: string;
  setAllDoses: Function;
  displayedDoses: JSX.Element[];
  setTracker: Function;
}

const Tracker: React.FC<TrackerProps> = ({
  tracker,
  setAllDoses,
  displayedDoses,
  setTracker,
}) => {
  return (
    <section className="mb-10 ss:mb-16 px-4 ss:px-8 md:px-0">
      <h3 className="text-[18px] font-semibold text-navyBlue mb-3">
        Medication Tracker
      </h3>
      <div className="w-[300px] h-auto flex border border-gray-300 rounded-[6px]  mb-8 overflow-hidden">
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
          <div className="grid md:grid-cols-2 gap-4 ss:gap-6 mb-6">
            {displayedDoses}
          </div>
          <div className="w-full flex justify-center">
            <button
              onClick={() => {
                setAllDoses(true);
              }}
              className=" text-navyBlue gap-1 flex items-center px-4 py-1"
            >
              VIEW ALL
              <Image
                src="/assets/down.png"
                width="16"
                height="16"
                alt="turned down"
                className="-rotate-90"
              />
            </button>
          </div>
        </>
      ) : (
        <div className="w-full md:w-1/2 py-6 px-4  border border-gray-300 rounded-[10px] items-center  flex gap-3">
          <FaExclamationTriangle /> No dose for this day
        </div>
      )}
    </section>
  );
};

export default Tracker;
