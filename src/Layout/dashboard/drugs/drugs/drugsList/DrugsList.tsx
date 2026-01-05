import React, { SetStateAction } from "react";
import { DrugProps } from "../../../../../../types/dashboard";
import { calculateTimePeriod } from "../../../../../../utils/drugs";
import OptionModal from "../../optionModal";
import { useAppStore } from "../../../../../../store/useAppStore";

interface AllergyProps {
  drug: string;
}

interface DrugsListProps {
  newData: DrugProps[] | AllergyProps[] | undefined;
  tab: "drugs" | "allergies";
  options: boolean;
  setOptions: React.Dispatch<SetStateAction<boolean>>;
  activeAction: string;
  setActiveAction: (value: string) => void;
  setActiveView: React.Dispatch<SetStateAction<"details" | "list">>;
  activeView: string;
}

const formatFrequency = (freq: string) => {
  const map: Record<string, string> = {
    qd: "1x daily",
    od: "1x daily",
    bid: "2x daily",
    tid: "3x daily",
    qid: "4x daily",
    prn: "as needed",
    eod: "every other day",
    w: "weekly",
    bw: "biweekly",
    m: "monthly",
  };

  return map[freq.toLowerCase().trim()] ?? freq.toLowerCase();
};

const DrugsList: React.FC<DrugsListProps> = ({
  newData,
  tab,
  options,
  setOptions,
  activeAction,
  setActiveAction,
  setActiveView,
  activeView,
}) => {
  const {
    activeDrugId,
    setActiveDrug,
    setActiveDrugId,
  } = useAppStore((state) => state);

  /* ---------------- ALLERGIES ---------------- */
  if (tab === "allergies") {
    const allergies = newData as AllergyProps[];

    return (
      <div className="flex flex-col">
        {allergies?.map((item, index) => (
          <div
            key={index}
            className="flex items-center px-4 ss:px-6 py-3 border-b border-gray-200 bg-white text-sm"
          >
            <span className="w-6 h-6 mr-2 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
              {index + 1}
            </span>
            <span className="font-semibold text-slate-800 capitalize">
              {item.drug}
            </span>
          </div>
        ))}
      </div>
    );
  }

  /* ---------------- DRUGS ---------------- */
  const drugs = newData as DrugProps[];

  return (
    <div className="flex flex-col">
      {drugs?.map((drug, index) => {
        const isActive = activeDrugId === drug.drugId;

        return (
          <div
            key={drug.drugId}
            onClick={() => {
              setActiveDrug(drug.drug);
              setActiveDrugId(drug.drugId);
              setActiveView("details");
            }}
            className="relative flex justify-between items-center capitalize
              px-4 ss:px-6 py-3 border-b border-gray-200
              bg-white hover:bg-gray-50 cursor-pointer text-sm"
          >
            {/* Name */}
            <div className="flex-[1.5] font-semibold flex items-center gap-2 text-slate-800">
              <span
                className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
                ${isActive ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"}`}
              >
                {index + 1}
              </span>
              {drug.drug}
            </div>

            {/* Route */}
            <div className="flex-1 text-center text-gray-600 hidden ss:flex">
              <span className="p-1 bg-gray-100 rounded-md">
                {drug.route}
              </span>
            </div>

            {/* Duration */}
            <div className="flex-1 text-center text-emerald-700 hidden ss:flex">
              <span className="p-1 bg-emerald-100 rounded-md">
                {calculateTimePeriod(drug.start, drug.end)}
              </span>
            </div>

            {/* Frequency */}
            <div className="flex-1 text-center text-purple-700">
              <span className="p-1 bg-purple-100 rounded-md">
                {formatFrequency(drug.frequency)}
              </span>
            </div>

            {/* Options */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex-[0.3] justify-end"
            >
              <OptionModal
                options={options && isActive}
                setOptions={setOptions}
                tab={tab}
                drug={drug.drug}
                drugId={drug.drugId}
                activeAction={activeAction}
                setActiveAction={setActiveAction}
                setActiveView={setActiveView}
                activeView={activeView}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DrugsList;
