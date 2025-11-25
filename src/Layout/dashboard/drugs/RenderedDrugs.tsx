import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateActiveDrug,
  updateActiveDrugId,
} from "../../../../store/stateSlice";
import { DrugProps } from "../../../../types/dashboard";
import { formatDate } from "../../../../utils/dashboard";
import { calculateTimePeriod } from "../../../../utils/drugs";
import { CircleX, EllipsisVertical, Info, Pencil, Trash2 } from "lucide-react";

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
  currentPage: number;
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
  tab,
  showEditButton,
  setDisplayDrugs,
  currentPage,
}) => {
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

  return (
    <div
      className={`relative ${
        id % 2 ? "" : "bg-lightGrey"
      } flex font-Inter w-full justify-between px-4 text-navyBlue items-center border-b-[1px] text-[13px] sm:text-[14px] leading-none capitalize`}
    >
      <div className="w-[31%] sm:w-[15%] md:w-[16%] h-full font-semibold  items-center py-4 flex gap-1">
        {currentPage === 1 ? id + 1 : id + 1 + 6 * (currentPage - 1)}.
        <h1>{drug.drug}</h1>
      </div>
      {tab !== "Allergies" ? (
       <>
  <h2 className="w-[31%] sm:w-[13.5%] md:w-[12%] flex justify-center items-center py-4">
    {drug.route}
  </h2>
  <h2 className="hidden md:flex md:w-[18%] justify-center items-center py-4 text-center">
    {calculateTimePeriod(drug.start, drug.end)}
  </h2>
  <h2 className="w-[31%] sm:w-[20.5%] md:w-[17%] flex justify-center items-center py-4">
    {frequencyToPlaceholder[drug.frequency]}
  </h2>
  <h2 className="hidden sm:flex sm:w-[23.5%] md:w-[15%] justify-center items-center py-4">
    {formatDate(drug.start)}
  </h2>
  <h2 className="hidden sm:flex sm:w-[23.5%] md:w-[15%] justify-center items-center py-4">
    {formatDate(drug.end)}
  </h2>
</>
      ) : (
        ""
      )}
      <button
        onClick={() => {
          setOptions((prev) => !prev),
            dispatch(updateActiveDrug(drug.drug)),
            dispatch(updateActiveDrugId(drug.drugId));
        }}
        className="flex flex-col gap-1 cursor-pointer justify-center items-center rounded-full w-[7%] sm:w-[4%] md:w-[6%] rotate-90"
      >
        <EllipsisVertical className="size-6 text-navyBlue" />
      </button>
      {options && (
        <div
          ref={dropdownRef}
          className="absolute border-[1px] border-gray-300 right-4 md:right-8 z-[200] top-5 text-navyBlue flex flex-col items-start justify-center mt-3 rounded-[10px] 
        bg-white shadow-xl w-[190px] ss:w-[250px] py-4 text-[16px]"
        >
          {tab !== "Allergies" && (
            <button
              onClick={() => {
                dispatch(updateActiveDrug(drug.drug));
                dispatch(updateActiveDrugId(drug.drugId));
                setDisplayDrugs(false);
                setOptions(false);
              }}
              className="h-8 hover:bg-gray-100 flex items-center gap-2 w-full px-3"
            >
              <Info className="size-6 text-navyBlue" strokeWidth={1.5} />
              View Details
            </button>
          )}
          {showEditButton && (
            <button
              onClick={() => {
                dispatch(updateActiveDrug(drug.drug)),
                  dispatch(updateActiveDrugId(drug.drugId)),
                  setEditModal(true),
                  setScreen(true);
                setOptions(false);
              }}
              className="h-8 hover:bg-gray-100 flex items-center gap-2 w-full px-3"
            >
              <Pencil className="size-6 text-navyBlue" strokeWidth={1.5} />
              Edit Drug
            </button>
          )}
          <button
            onClick={() => {
              dispatch(updateActiveDrug(drug.drug)),
                dispatch(updateActiveDrugId(drug.drugId));
              setScreen(true), setDeleteModal(true);
              setOptions(false);
            }}
            className="h-8 hover:bg-gray-100 flex items-center gap-2 w-full px-3"
          >
            <Trash2 className="size-6 text-navyBlue" strokeWidth={1.5} />
            Delete Drug
          </button>
          {tab !== "Allergies" && (
            <button
              onClick={() => {
                dispatch(updateActiveDrugId(drug.drugId));
                dispatch(updateActiveDrug(drug.drug)),
                  setScreen(true),
                  setAllergyModal(true);
                setOptions(false);
              }}
              className="h-8 hover:bg-gray-100 flex items-center gap-2 w-full px-3 pl-[14px]"
            >
              <CircleX className="size-6 text-navyBlue" strokeWidth={1.5} />
              Add to Allergies
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RenderedDrugs;
