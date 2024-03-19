import React, { useState, useRef, useEffect } from "react";
import { formatDateToSlash, formatDate } from "../../../../utils/dashboard";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { updateActiveDrug } from "../../../../store/stateSlice";
import { calculateTimePeriod } from "../../../../utils/drugs";
import { DrugProps } from "../../../../types/dashboard";

interface thisProps {
  drug: DrugProps;
  frequencyToPlaceholder: { [key: string]: string };
  setScreen: Function;
  setAllergyModal: Function;
  setEditModal: Function;
  setDeleteModal: Function;
  id: number;
  displayDrugs: boolean;
  setDisplayDrugs: Function;
  showEditButton: boolean;
  tab: string;
}

type RefObject<T> = React.RefObject<T>;

const RenderedDrugs: React.FC<thisProps> = ({
  drug,
  id,
  setScreen,
  setEditModal,
  setDeleteModal,
  setAllergyModal,
  frequencyToPlaceholder,
  displayDrugs,
  tab,
  showEditButton,
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

  return (
    <div
      className={`relative ${
        id % 2 ? "" : "bg-lightGrey"
      } flex font-Inter text-[14px] w-full justify-between px-4 text-navyBlue items-center border-b-[1px]`}
    >
      <h1 className="capitalize text-[12px] sm:text-[13px] font-montserrant font-semibold w-[25%] h-full sm:w-[14%] items-center py-4">
        {drug.drug}
      </h1>
      {tab !== "Allergies" ? (
        <>
          <h2 className="capitalize text-[12px] sm:text-[13px] leading-none w-[30%] sm:w-[10%] flex justify-center items-center py-4">
            {drug.route}
          </h2>
          <h2 className="capitalize text-[12px] sm:text-[13px] md:w-[24%] hidden md:flex justify-center items-center py-4 text-center">
            {calculateTimePeriod(drug.start, drug.end)}
          </h2>
          <h2 className=" text-[12px] sm:text-[13px] leading-none w-[35%] sm:w-[14%] flex justify-center items-center py-4">
            {frequencyToPlaceholder[drug.frequency]}
          </h2>
          <h2 className="capitalize md:hidden text-[12px] sm:text-[13px] leading-none md:w-[20%] hidden sm:flex justify-center items-center py-4">
            {formatDateToSlash(drug.start)}
          </h2>
          <h2 className="capitalize md:hidden hidden sm:flex text-[12px] sm:text-[13px] leading-none md:w-[20%] justify-center items-center py-4">
            {formatDateToSlash(drug.end)}
          </h2>
          <h2 className="capitalize hidden md:flex text-[12px] sm:text-[13px] leading-none md:w-[15%] justify-center items-center py-4">
            {formatDate(drug.start)}
          </h2>
          <h2 className="capitalize hidden md:flex text-[12px] sm:text-[13px] leading-none md:w-[15%] justify-center items-center py-4">
            {formatDate(drug.end)}
          </h2>
        </>
      ) : (
        ""
      )}
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
          className="absolute border-[1px] border-gray-300 right-8 z-[200] top-5 text-navyBlue flex flex-col items-start justify-center mt-3 rounded-[10px] 
        bg-white shadow-md w-[150px] ss:w-[250px] py-4 text-[13px] ss:text-[16px]"
        >
          {tab !== "Allergies" && (
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
          )}
          {showEditButton && (
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
          )}
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
          {tab !== "Allergies" && (
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
          )}
        </div>
      )}
    </div>
  );
};

export default RenderedDrugs;
