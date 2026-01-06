import React, { SetStateAction } from "react";
import { DrugProps } from "@/types/dashboard";
import { calculateTimePeriod } from "@/utils/drugs";
import OptionModal from "../../optionModal";
import { useAppStore } from "@/store/useAppStore";
import { AnimatePresence, motion } from "framer-motion";

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
  const { activeDrugId, setActiveDrug, setActiveDrugId } = useAppStore(
    (state) => state
  );

  /* ---------------- ALLERGIES ---------------- */
  if (tab === "allergies") {
    const allergies = newData as AllergyProps[];

    return (
      <div className="flex flex-col">
        <AnimatePresence mode="popLayout">
          {allergies?.map((item, index) => (
            <motion.div
              key={item.drug}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex items-center px-4 ss:px-6 py-3 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-transparent text-sm last:border-0"
            >
              <span className="w-6 h-6 mr-2 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:text-slate-400 dark:bg-slate-800 text-xs font-bold">
                {index + 1}
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-100 capitalize">
                {item.drug}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  }

  /* ---------------- DRUGS ---------------- */
  const drugs = newData as DrugProps[];

  return (
    <div className="flex flex-col">
      <AnimatePresence mode="popLayout">
        {drugs?.map((drug, index) => {
          const isActive = activeDrugId === drug.drugId;

          return (
            <motion.div
              key={drug.drugId}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                setActiveDrug(drug.drug);
                setActiveDrugId(drug.drugId);
                setActiveView("details");
              }}
              className="relative flex justify-between items-center capitalize
                px-4 ss:px-6 py-3 border-b border-gray-100 dark:border-slate-800
                bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer
                 text-sm last:border-0"
            >
              {/* Name */}
              <div className="flex-[1.5] font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <span
                  className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
                  ${isActive ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400"}`}
                >
                  {index + 1}
                </span>
                {drug.drug}
              </div>

              {/* Route */}
              <div className="flex-1 text-center text-gray-600 dark:text-slate-400 hidden ss:flex">
                <span className="p-1 px-2 bg-gray-100 dark:bg-slate-800 rounded-md text-[13px]">
                  {drug.route}
                </span>
              </div>

              {/* Duration */}
              <div className="flex-1 text-center text-emerald-700 dark:text-emerald-400 hidden ss:flex">
                <span className="p-1 px-2 bg-emerald-50 dark:bg-emerald-900/40 rounded-md text-[13px]">
                  {calculateTimePeriod(drug.start, drug.end)}
                </span>
              </div>

              {/* Frequency */}
              <div className="flex-1 text-center text-purple-700 dark:text-purple-400">
                <span className="p-1 px-2 bg-purple-50 dark:bg-purple-900/40 rounded-md text-[13px]">
                  {formatFrequency(drug.frequency)}
                </span>
              </div>

              <div
                onClick={(e) => e.stopPropagation()}
                className="flex-[0.3] justify-end relative"
                style={{ position: "static" }} // Change positioning context
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
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default DrugsList;
