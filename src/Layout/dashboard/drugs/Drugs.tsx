/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use-client";
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { frequencyToPlaceholder } from "../../../../utils/dashboard";
import Image from "next/image";
import {
  setDrugs,
  updateActiveDrug,
  updateSchedule,
} from "../../../../store/stateSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Drug } from "./../../../../types";
import RenderedDrugs from "./RenderedDrugs";

interface DrugsProps {
  screen: boolean;
  setScreen: Function;
  setDrugsForm: Function;
  setEditForm: Function;
  modal: boolean;
  setModal: Function;
}

type RefObject<T> = React.RefObject<T>;

const Drugs: React.FC<DrugsProps> = ({
  setScreen,
  setDrugsForm,
  setEditForm,
  modal,
  setModal,
}) => {
  const { drugs, schedule } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();
  const [activeDrug, setActiveDrug] = useState("");
  const dropdownRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent): void => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setScreen(false);
      setModal(false);
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

  useEffect(() => {
    dispatch(updateActiveDrug(activeDrug));
  }, [activeDrug]);

  const handleDelete = () => {
    dispatch(setDrugs(drugs.filter((drug: Drug) => drug.drug !== activeDrug)));
    toast.success(`'${activeDrug.toUpperCase()}' deleted Successfully!`);
    dispatch(
      updateSchedule(schedule.filter((drug: Drug) => drug.drug !== activeDrug))
    );
  };

  const renderedDrugs = drugs?.map((drug: any, index: number) => {
    const startDate: any = new Date(drug.start);
    const endDate: any = new Date(drug.end);
    const durationInDays = Math.floor(
      (endDate - startDate) / (1000 * 60 * 60 * 24)
    );
    const durationInYears = Math.floor(durationInDays / 365);
    const remainingDaysAfterYears = durationInDays % 365;

    const durationInMonths = Math.floor(remainingDaysAfterYears / 30);
    const remainingDaysAfterMonths = remainingDaysAfterYears % 30;

    const durationInWeeks = Math.floor(remainingDaysAfterMonths / 7);
    const remainingDaysAfterWeeks = remainingDaysAfterMonths % 7;

    const accurateDurationText = [];

    if (durationInYears > 0) {
      accurateDurationText.push(
        `${durationInYears} year${durationInYears > 1 ? "s" : ""}`
      );
    }

    if (durationInMonths > 0) {
      accurateDurationText.push(
        `${durationInMonths} month${durationInMonths > 1 ? "s" : ""}`
      );
    }

    if (durationInWeeks > 0) {
      accurateDurationText.push(
        `${durationInWeeks} week${durationInWeeks > 1 ? "s" : ""}`
      );
    }

    if (remainingDaysAfterWeeks > 0) {
      accurateDurationText.push(
        `${remainingDaysAfterWeeks} day${
          remainingDaysAfterWeeks > 1 ? "s" : ""
        }`
      );
    }

    const finalDurationText =
      accurateDurationText.length > 0
        ? `${accurateDurationText.join(", ")} `
        : "Less than a day";

    return (
      <RenderedDrugs
        key={index}
        drug={drug}
        frequencyToPlaceholder={frequencyToPlaceholder}
        finalDurationText={finalDurationText}
        setActiveDrug={setActiveDrug}
        setEditForm={setEditForm}
        setModal={setModal}
        setScreen={setScreen}
      />
    );
  });

  return (
    <div className="h-[100dvh] ss:pb-28 overflow-y-scroll w-full md:py-16 md:px-12 px-4 pt-10 pb-24 ss:p-10 text-navyBlue font-karla relative">
      <div className="mb-[28px]">
        <h1 className="text-[24px] ss:text-[32px] font-semibold font-montserrant ">
          Drug Regimen
        </h1>
        <p className="text-[16px] text-[#718096]">Manage medications wisely!</p>
      </div>
      <button
        onClick={() => {
          setDrugsForm(true);
        }}
        className="mb-6 w-[160px] cursor-pointer h-[40px] bg-navyBlue rounded-[10px] rounded-bl-none flex justify-center items-center 
          font-bold text-white"
      >
        + ADD DRUG
      </button>
      {drugs.length > 0 ? (
        <div className="w-full grid grid-cols-2 md:grid-cols-3 md:px-0 gap-4">
          {renderedDrugs}{" "}
        </div>
      ) : (
        <div className="w-full h-[400px] flex justify-center items-center">
          {" "}
          <h1 className="text-[20px] text-navyBlue font-semibold font-montserrant text-center opacity-30">
            Add a drug to get started!
          </h1>
        </div>
      )}

      {modal ? (
        <div className="w-full h-full fixed flex top-0 left-0 justify-center items-center z-[143] p-4 font-Inter">
          <div
            ref={dropdownRef}
            className="bg-white rounded-[10px] p-4 ss:p-10 text-white relative flex flex-col justify-center items-center"
          >
            <Image
              src="/assets/x.png"
              alt="cancel"
              width={18}
              height={18}
              quality={100}
              className="absolute -top-8 right-1 cursor-pointer"
              onClick={() => {
                setActiveDrug(""), setModal(false), setScreen(false);
              }}
            />
            <h1 className="text-navyBlue font-semibold text-center text-[20px] leading-tight">
              Delete Drug
            </h1>
            <h2 className="text-navyBlue mb-6 text-center">
              Are you sure you want to delete '{activeDrug.toUpperCase()}' ?
            </h2>
            <div className="w-full flex gap-3 justify-center">
              <button
                onClick={() => {
                  handleDelete(),
                    setModal(false),
                    setScreen(false),
                    setActiveDrug("");
                }}
                className="px-3 py-1 flex items-center gap-2 bg-navyBlue rounded-md rounded-bl-none w-[100px]"
              >
                <Image src='/assets/delete-white.png' width={16} height={16} alt='delete' />
                Delete
              </button>
              <button
                onClick={() => {
                  setActiveDrug(""), setModal(false), setScreen(false);
                }}
                className="px-3 py-1 flex items-center gap-2 bg-none border text-navyBlue border-navyBlue rounded-md rounded-bl-none w-[100px]"
              >
                <Image src='/assets/cancel.png' width={16} height={16} alt='cancel' />
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Drugs;
