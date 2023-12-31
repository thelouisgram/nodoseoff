import React, { useState, useRef, useEffect } from "react";
import { formatDate } from "../../../../utils/dashboard";
import Image from "next/image";

interface DrugProps {
  drug: string;
  end: string;
  frequency: string;
  reminder: boolean;
  route: string;
  start: string;
  time: string[];
}

interface thisProps {
  drug: DrugProps;
  frequencyToPlaceholder: { [key: string]: string };
  setScreen: Function;
  setActiveDrug: Function;
  finalDurationText: string;
  setAllergyModal: Function;
  setEditModal: Function;
  setDeleteModal: Function;
}

type RefObject<T> = React.RefObject<T>;

const RenderedDrugs: React.FC<thisProps> = ({
  drug,
  frequencyToPlaceholder,
  finalDurationText,
  setActiveDrug,
  setScreen,
  setEditModal,
  setDeleteModal,
  setAllergyModal,
}) => {
  const [options, setOptions] = useState(false);
  const dropdownRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent): void => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOptions(false);
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

  function convertTo12Hour(time: string) {
    if (!time) return ""; // Handle the case where time is undefined or null

    const [hours, minutes] = time.split(":");
    let period = "am";
    let hour = parseInt(hours, 10);

    if (hour >= 12) {
      period = "pm";
      if (hour > 12) {
        hour -= 12;
      }
    }

    return `${hour}:${minutes}${period}`;
  }

  // Assuming drug.time is an array of 24-hour format times ['13:30', '16:45', ...]
  const formattedTimes = drug.time
    ?.map((time) => convertTo12Hour(time))
    .join(", ");

  return (
    <div className="relative rounded-lg rounded-bl-none bg-lightBlue py-6 px-3 ss:py-8 ss:px-6 flex flex-col gap-[1px] font-Inter text-[14px] h-auto">
      <Image
        src={`/assets/drugs/${drug.route}.png`}
        alt=""
        width={30}
        height={30}
        className="mb-4"
      />
      <h1 className="capitalize text-[15px] ss:text-[20px] font-montserrant font-bold mb-4">
        {drug.drug}
      </h1>
      <p className="mb-4 text-[11px] ss:text-[14px] leading-normal">
        {frequencyToPlaceholder[drug.frequency]} at {formattedTimes} for{" "}
        {finalDurationText}
        until {formatDate(drug.end)}.
      </p>
      <h2 className="capitalize font-semibold text-[13px] ss:text-[18px] leading-none">
        {drug.route}
      </h2>
      <button
        onClick={() => {
          setOptions((prev) => !prev);
        }}
        className="absolute top-5 ss:top-6 right-3 flex flex-col gap-1 cursor-pointer w-7 h-7 justify-center items-center rounded-full"
      >
        <div className="w-[3px] h-[3px] rounded-full bg-navyBlue" />
        <div className="w-[3px] h-[3px] rounded-full bg-navyBlue" />
        <div className="w-[3px] h-[3px] rounded-full bg-navyBlue" />
      </button>
      {options && (
        <div
          ref={dropdownRef}
          className="absolute right-3 top-10 text-navyBlue flex flex-col items-start justify-center mt-3 rounded-[10px] 
        bg-white shadow-md w-[150px] ss:w-[250px] py-3 text-[13px] ss:text-[16px]"
        >
          <button
            onClick={() => {
              setActiveDrug(drug.drug), setEditModal(true), setScreen(true);
            }}
            className="h-8 hover:bg-gray-100 flex items-center gap-2 w-full px-3"
          >
            <Image
              src="/assets/edit.png"
              alt="edit"
              width={20}
              height={20}
              className="ss:w-[20px] w-[16px]"
            />
            Edit Drug
          </button>
          <button
            onClick={() => {
              setActiveDrug(drug.drug), setScreen(true), setDeleteModal(true);
            }}
            className="h-8 hover:bg-gray-100 flex items-center gap-2 w-full px-3"
          >
            <Image
              src="/assets/delete.png"
              alt="edit"
              width={20}
              height={20}
              className="ss:w-[20px] w-[16px]"
            />
            Delete Drug
          </button>
          <button
            onClick={() => {
              setActiveDrug(drug.drug), setScreen(true), setAllergyModal(true);
            }}
            className="h-8 hover:bg-gray-100 flex items-center gap-2 w-full px-3 pl-[14px]"
          >
            <Image
              src="/assets/disabled.png"
              alt="disabled"
              width={20}
              height={20}
              className="ss:w-[16px] w-[12px]"
            />
            Add to Allergies
          </button>
        </div>
      )}
    </div>
  );
};

export default RenderedDrugs;
