import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import Image from "next/image";
import { days } from "../../../../utils/dashboard";

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

  const renderedDaysTab = days.map((item, index) => {
    return (
      <button
        key={index}
        onClick={() => {
          setTracker(item);
        }}
        className={`${
          item === tracker
            ? "text-darkBlue bg-white rounded-[6px] border shadow-sm"
            : "text-blackII"
        } px-3 py-2 ss:px-4 text-[14px] font-Inter w-full font-[500]`}
      >
        {item}
      </button>
    );
  })

  return (
    <section className="mb-10 ss:mb-16 px-4 ss:px-8 md:px-0">
      <h3 className="text-[18px] font-semibold text-navyBlue mb-3">
        Medication Tracker
      </h3>
      <div className="mb-8 bg-lightGrey border p-1 rounded-[6px] flex justify-between w-full ss:w-[400px]">
        {renderedDaysTab}
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
        <div className="w-full md:w-1/2 py-6 px-4  border border-gray-300 rounded-[10px] items-center text-blackII flex gap-3">
          <FaExclamationTriangle /> No dose for this day
        </div>
      )}
    </section>
  );
};

export default Tracker;
