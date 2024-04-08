/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { updateActiveDrug } from "../../../../store/stateSlice";
import {
  formatDate,
  frequencyToPlaceholder,
} from "../../../../utils/dashboard";
import { calculateTimePeriod, convertedTimes } from "../../../../utils/drugs";

interface drugDetailsProps {
  setDisplayDrugs: Function;
  tab: string;
  setAllergyModal: Function;
  setDeleteModal: Function;
  setEditModal: Function;
  setScreen: Function;
  handleAllergies: Function;
  handleDelete: Function;
  deleteModal: boolean;
  editModal: boolean;
  allergyModal: boolean;
  handleDeleteAllergy: Function;
  setEditForm: Function;
}

type RefObject<T> = React.RefObject<T>;

interface detail {
  name: string;
  details: string;
}

const DrugDetails: React.FC<drugDetailsProps> = ({
  setDisplayDrugs,
  tab,
  setAllergyModal,
  setDeleteModal,
  setEditModal,
  setScreen,
  handleAllergies,
  handleDelete,
  deleteModal,
  editModal,
  allergyModal,
  handleDeleteAllergy,
  setEditForm,
}) => {
  const { drugs, completedDrugs, activeDrug } = useSelector(
    (state: RootState) => state.app
  );
  const dropdownRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent): void => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOptions(false);
      setDeleteModal(false);
      setEditModal(false);
      setAllergyModal(false);
      setScreen(false);
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

  const dispatch = useDispatch();
  const [options, setOptions] = useState(false);
  const drugsArray = tab === "Ongoing" ? drugs : completedDrugs;
  const drugDetails = drugsArray.find((drug) => drug.drug === activeDrug);
  if (!drugDetails) {
    return setDisplayDrugs(true);
  }
  const { drug, route, frequency, start, end, time, reminder } = drugDetails;
  const Duration = calculateTimePeriod(start, end);
  const Details = [
    {
      name: "Current Status",
      details: tab === "Ongoing" ? "Ongoing" : "Completed",
    },
    { name: "Route of Administration", details: route },
    { name: "Frequency", details: frequencyToPlaceholder[frequency] },
    { name: "Time", details: convertedTimes(time).join(", ") },
    { name: "Duration", details: Duration },
    { name: "Reminder", details: reminder ? "Yes" : "No" },
    { name: "Start Date", details: formatDate(start) },
    { name: "End Date", details: formatDate(end) },
  ];

  const RenderedDetails = Details.map((detail: detail, index: number) => {
    return (
      <div key={index} className="border rounded-md  p-5">
        <h2 className="text-[12px] ss:text-[14px] font-semibold text-grey font-karla">
          {detail.name}
        </h2>
        <h3 className="text-[14px] ss:text-[16px] capitalize font-Inter">
          {detail.details}
        </h3>
      </div>
    );
  });

  return (
    <div className="h-[100dvh] ss:pb-28 overflow-y-scroll w-full md:py-16 md:px-12 px-4 pt-10 pb-24 ss:p-10 text-navyBlue relative">
      <button
        onClick={() => {
          setDisplayDrugs(true);
        }}
        className="flex gap-1 items-center font-Inter"
      >
        <Image
          src="/assets/down.png"
          alt="back"
          width={20}
          height={20}
          className="rotate-90"
        />
        <p className="font-[500] text-[18px]">Back</p>
      </button>

      <section className="mt-8 ">
        <div className="w-full flex justify-between relative items-center mb-[28px]">
          <h1 className="text-[28px] ss:text-[36px] font-semibold font-karla capitalize">
            {drug}
          </h1>
          <button
            onClick={() => {
              setOptions((prev) => !prev), dispatch(updateActiveDrug(drug));
            }}
            className="flex gap-[5px] cursor-pointer justify-center items-center rounded-full rotate-90 w-[50px] h-[50px]"
          >
            <div className="w-[4px] h-[4px] rounded-full bg-navyBlue" />
            <div className="w-[4px] h-[4px] rounded-full bg-navyBlue" />
            <div className="w-[4px] h-[4px] rounded-full bg-navyBlue" />
          </button>
          {options && (
            <div
              ref={dropdownRef}
              className="absolute font-Inter border-[1px] border-gray-300 right-0 z-[200] top-10 text-navyBlue flex flex-col items-start justify-center mt-3 rounded-[10px] 
        bg-white shadow-md w-[175px] ss:w-[250px] py-4 text-[16px]"
            >
              {tab !== "Completed" && (
                <button
                  onClick={() => {
                    dispatch(updateActiveDrug(drug)),
                      setEditModal(true),
                      setScreen(true);
                    setOptions(false);
                  }}
                  className="h-8 hover:bg-gray-100 flex items-center gap-3 w-full px-3"
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
                  dispatch(updateActiveDrug(drug)),
                    setScreen(true),
                    setDeleteModal(true);
                  setOptions(false);
                }}
                className="h-8 hover:bg-gray-100 flex items-center gap-3 w-full px-3"
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
                    dispatch(updateActiveDrug(drug)),
                      setScreen(true),
                      setAllergyModal(true);
                    setOptions(false);
                  }}
                  className="h-8 hover:bg-gray-100 flex items-center gap-3 w-full px-3 pl-[14px]"
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
        <div className="grid ss:grid-cols-2 gap-4">{RenderedDetails}</div>
      </section>
      {deleteModal && (
        <div className="w-full h-full fixed flex top-0 left-0 justify-center items-center z-[143] p-4 font-Inter">
          <div
            ref={dropdownRef}
            className="bg-white rounded-[10px] text-white relative flex flex-col justify-center items-center"
          >
            <h1 className="text-navyBlue font-semibold py-4 px-4 border-b-[1px] text-left w-full text-[13px] ss:text-[16px] leading-tight">
              Confirm to delete {activeDrug.toUpperCase()}?
            </h1>
            <h2 className="text-navyBlue border-b-[1px] text-left px-4 py-4 text-[12px] ss:text-[14px]">
              Are you sure you want to delete the selected drug? <br /> This
              action cannot be undone.
            </h2>
            <div className="w-full flex gap-3 justify-start flex-row-reverse text-[12px] py-4 px-4">
              <button
                onClick={() => {
                  tab !== "Allergies"
                    ? handleDelete()
                    : handleDeleteAllergy(activeDrug),
                    setScreen(false),
                    dispatch(updateActiveDrug(""));
                  setDisplayDrugs(true);
                  setDeleteModal(false);
                }}
                className="px-4 py-1 flex items-center gap-2 bg-navyBlue rounded-[10px]  "
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setScreen(false), setDeleteModal(false);
                }}
                className="px-4 py-1 flex items-center gap-2 bg-none border text-navyBlue border-navyBlue rounded-[10px]  "
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {allergyModal && (
        <div className="w-full h-full fixed flex top-0 left-0 justify-center items-center z-[143] p-4 font-Inter">
          <div
            ref={dropdownRef}
            className="bg-white rounded-[10px] text-white relative flex flex-col justify-center items-center"
          >
            <h1 className="text-navyBlue font-semibold py-4 px-4 border-b-[1px] text-left w-full text-[13px] ss:text-[16px] leading-tight">
              Confirm to add &apos;{activeDrug}&apos; to Allergies?
            </h1>
            <h2 className="text-navyBlue border-b-[1px] text-left px-4 py-4 text-[12px] ss:text-[14px]">
              Are you sure you want to mark the selected drug as Allergy? <br />{" "}
              This action cannot be undone.
            </h2>
            <div className="w-full flex gap-3 justify-start flex-row-reverse text-[12px] py-4 px-4">
              <button
                onClick={() => {
                  setScreen(false), setAllergyModal(false), handleAllergies();
                  tab !== "Allergies" &&
                    (dispatch(updateActiveDrug("")), setDisplayDrugs(true));
                }}
                className="px-4 py-1 flex items-center gap-2 bg-navyBlue rounded-[10px]  "
              >
                Add to Allergies
              </button>
              <button
                onClick={() => {
                  setScreen(false), setAllergyModal(false);
                }}
                className="px-4 py-1 flex items-center gap-2 bg-none border text-navyBlue border-navyBlue rounded-[10px]  "
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {editModal && (
        <div className="w-full h-full fixed flex top-0 left-0 justify-center items-center z-[143] p-4 font-Inter">
          <div
            ref={dropdownRef}
            className="bg-white rounded-[10px] text-white relative flex flex-col justify-center items-center"
          >
            <h1 className="text-navyBlue font-semibold py-4 px-4 border-b-[1px] text-left w-full text-[13px] ss:text-[16px] leading-tight">
              Continue to Edit {activeDrug.toUpperCase()} ?
            </h1>
            <h2 className="text-navyBlue border-b-[1px] text-left px-4 py-4 text-[12px] ss:text-[14px]">
              Proceed to edit the selected drug. Changes apply only
              <br className="hidden ss:flex" />
              to doses from Today forward.
            </h2>
            <div className="w-full flex gap-3 justify-start flex-row-reverse text-[12px] py-4 px-4">
              <button
                onClick={() => {
                  setEditForm(true), setScreen(false), setEditModal(false);
                }}
                className="px-4 py-1 flex items-center gap-2 bg-navyBlue rounded-[10px]  "
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setScreen(false), setEditForm(false), setEditModal(false);
                }}
                className="px-4 py-1 flex items-center gap-2 bg-none border text-navyBlue border-navyBlue rounded-[10px]  "
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrugDetails;
