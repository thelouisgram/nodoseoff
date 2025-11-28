import React, { SetStateAction } from "react";
import { DrugProps } from "../../../../../../types/dashboard/dashboard";
import { calculateTimePeriod } from "../../../../../../utils/drugs";
import OptionModal from "../../optionModal";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../store";

interface AllergyProps { drug: string }

interface DrugsListProps {
  newData: DrugProps[] | AllergyProps[] | undefined;
  tab: string;
  options: boolean;
  setOptions: React.Dispatch<SetStateAction<boolean>>;
  setScreen: React.Dispatch<SetStateAction<boolean>>;
  dropdownRef: React.RefObject<HTMLDivElement>;
  activeAction: string;
  setActiveAction: (value: string) => void;
  setActiveView: React.Dispatch<SetStateAction<"details" | "list">>;
  activeView: string;
}

const DrugsList: React.FC<DrugsListProps> = ({
  newData, tab, options, setOptions, setScreen,
  dropdownRef, activeAction, setActiveAction, setActiveView, activeView
}) => {
  const { activeDrug } = useSelector((state: RootState) => state.app);

  const isDrugProps = (data: DrugProps | AllergyProps): data is DrugProps =>
    "route" in data && "frequency" in data && "start" in data && "end" in data;

  const formatFrequency = (freq: string) => {
    const map: Record<string, string> = {
      qd: "once daily",
      od: "once daily",
      bid: "twice daily",
      tid: "three times daily",
      qid: "four times daily",
      prn: "as needed",
      eod: "every other day",
      w: "weekly",
      bw: "biweekly",
      m: "monthly"
    };
    return map[freq.toLowerCase().trim()] ?? freq.toLowerCase();
  };

  return (
    <div className="flex flex-col">
      {newData?.map((data, index) => {
        const isActive = activeDrug === data.drug;

        return (
          <div
            key={index}
            className={`
              relative flex flex-row justify-between items-center capitalize
              px-4 ss:px-6 py-3 border-b border-gray-100
              transition-colors duration-200
              ${isActive ? "bg-blue-50" : "bg-white hover:bg-gray-50"}
            `}
          >
            {/* Name */}
            <div className="flex-[2] font-semibold flex items-center gap-2 text-slate-800 text-[14px] ss:text-[16px]">
              <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
                ${isActive ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"}`}>
                {index + 1}
              </span>
              {data.drug}
            </div>

            {/* Route (hidden on small screens) */}
            {tab !== "allergies" && isDrugProps(data) && (
              <>
                <div className="flex-1 text-center text-gray-600 hidden ss:flex">{data.route}</div>
                <div className="flex-1 text-center text-emerald-700 hidden ss:flex">
                  {calculateTimePeriod(data.start, data.end)}
                </div>
                {/* Frequency (always visible) */}
                <div className="flex-1 text-center text-purple-700">{formatFrequency(data.frequency)}</div>
              </>
            )}

            {/* Options */}
            <div onClick={(e)=>{e.stopPropagation()}} className="flex-[0.2] flex justify-end">
              <OptionModal
                options={options && activeDrug === data.drug}
                setOptions={setOptions}
                setScreen={setScreen}
                tab={tab}
                dropdownRef={dropdownRef}
                drug={data.drug}
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
