/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import {
  DrugDetailsProps,
  ExtendedDrugData,
} from "../../../../../types/dashboard/drug";

import DrugDetailsHeader from "../drugDetails/DrugDetailsHeader";
import DrugSummaryCard from "../drugDetails/DrugSummaryCard";
import DrugDetailsGrid from "../drugDetails/DrugDetailsGrid";

type RefObject<T> = React.RefObject<T>;

const DrugDetails: React.FC<DrugDetailsProps> = ({
  activeView,
  setActiveView,
  tab,
  setScreen,
  setActiveForm,
  activeAction,
  setActiveAction,
  options,
  setOptions,
}) => {
  const { schedule, drugs, completedDrugs, activeDrug, activeDrugId } =
    useSelector((state: RootState) => state.app);

  const dropdownRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOptions(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);
  const drugsArray = tab === "ongoing" ? drugs : completedDrugs;

  const drugDetailsData = drugsArray?.find((item) => item.drug === activeDrug);

  if (!drugDetailsData) return null;

  const { drug, frequency, start, end, time, reminder } = drugDetailsData;

  return (
    <div className="h-full w-full  text-gray-800 relative rounded-lg pb-20 md:pb-8">
      {/* Header */}
      <DrugDetailsHeader
        options={options}
        setOptions={setOptions}
        setScreen={setScreen}
        tab={tab}
        dropdownRef={dropdownRef}
        drug={drug}
        activeView={activeView}
        setActiveView={setActiveView}
        activeAction={activeAction}
        setActiveAction={setActiveAction}
      />

      {/* <DrugSummaryCard />

      <DrugDetailsGrid /> */}

    </div>
  );
};

export default DrugDetails;