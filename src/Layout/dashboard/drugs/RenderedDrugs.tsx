import React, { useState, useRef, useEffect } from "react";
import { formatDateToSlash, formatDate } from "../../../../utils/dashboard";
import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { updateActiveDrug } from "../../../../store/stateSlice";

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
  finalDurationText: string;
  setAllergyModal: Function;
  setEditModal: Function;
  setDeleteModal: Function;
  id: number;
  displayDrugs: boolean;
  setDisplayDrugs: Function;
}

type RefObject<T> = React.RefObject<T>;

const RenderedDrugs: React.FC<thisProps> = ({
  drug,
  id,
  setScreen,
  setEditModal,
  setDeleteModal,
  setAllergyModal,
  finalDurationText,
  frequencyToPlaceholder,
  displayDrugs,
  setDisplayDrugs,
}) => {
  const { activeDrug } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();
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
    <div
      className={`relative ${
        id % 2 ? "" : "bg-lightGrey"
      } flex font-Inter text-[14px] w-full justify-between px-4 text-navyBlue border-b-[1px]`}
    >
      <h1 className="capitalize text-[11px] sm:text-[13px] font-montserrant font-semibold w-[25%] sm:w-[14%] items-center py-4">
        {drug.drug}
      </h1>
      <h2 className="capitalize  text-[11px] sm:text-[13px] leading-none w-[30%] sm:w-[10%] flex justify-center items-center py-4">
        {drug.route}
      </h2>
      <h2 className="capitalize  text-[11px] sm:text-[13px] leading-none  md:w-[14%] hidden md:flex justify-center items-center py-4">
        {finalDurationText}
      </h2>
      <h2 className=" text-[11px] sm:text-[13px] leading-none w-[35%] sm:w-[14%] flex justify-center items-center py-4">
        {frequencyToPlaceholder[drug.frequency]}
      </h2>
      <h2 className="capitalize md:hidden text-[11px] sm:text-[13px] leading-none md:w-[20%] hidden sm:flex justify-center items-center py-4">
        {formatDateToSlash(drug.start)}
      </h2>
      <h2 className="capitalize md:hidden hidden sm:flex text-[11px] sm:text-[13px] leading-none md:w-[20%] justify-center items-center py-4">
        {formatDateToSlash(drug.end)}
      </h2>
      <h2 className="capitalize hidden md:flex text-[11px] sm:text-[13px] leading-none md:w-[20%] justify-center items-center py-4">
        {formatDate(drug.start)}
      </h2>
      <h2 className="capitalize hidden md:flex text-[11px] sm:text-[13px] leading-none md:w-[20%] justify-center items-center py-4">
        {formatDate(drug.end)}
      </h2>
      <button
        onClick={() => {
          setOptions((prev) => !prev), dispatch(updateActiveDrug(drug.drug));
        }}
        className="flex flex-col gap-1 cursor-pointer justify-center items-center rounded-full w-[10%] md:w-[6%] rotate-90"
      >
        <div className="w-[3px] h-[3px] rounded-full bg-navyBlue" />
        <div className="w-[3px] h-[3px] rounded-full bg-navyBlue" />
        <div className="w-[3px] h-[3px] rounded-full bg-navyBlue" />
      </button>
      {options && (
        <div
          ref={dropdownRef}
          className="absolute border-[1px] border-gray-100 right-8 z-[200] top-5 text-navyBlue flex flex-col items-start justify-center mt-3 rounded-[10px] 
        bg-white shadow-md w-[150px] ss:w-[250px] py-4 text-[13px] ss:text-[16px]"
        >
          <button
            onClick={() => {
              dispatch(updateActiveDrug(drug.drug));
              setDisplayDrugs(false);
              setOptions(false);
            }}
            className="h-8 hover:bg-gray-100 flex items-center gap-2 w-full px-3"
          >
            <Image
              src="/assets/info.png"
              alt="edit"
              width={20}
              height={20}
              className="ss:w-[20px] w-[16px]"
            />
            View Details
          </button>
          <button
            onClick={() => {
              dispatch(updateActiveDrug(drug.drug)),
                setEditModal(true),
                setScreen(true);
              setOptions(false);
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
              dispatch(updateActiveDrug(drug.drug)),
                setScreen(true),
                setDeleteModal(true);
              setOptions(false);
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
              dispatch(updateActiveDrug(drug.drug)),
                setScreen(true),
                setAllergyModal(true);
              setOptions(false);
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
