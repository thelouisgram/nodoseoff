import React from "react";
import { ChevronLeft } from "lucide-react";
import {
  updateActiveDrug,
  updateActiveDrugId,
} from "../../../../../store/stateSlice";
import { useDispatch } from "react-redux";
import OptionModal from "../optionModal";

interface Props {
  options: boolean;
  activeView: string;
  setActiveView:  React.Dispatch<SetStateAction<"details" | "list">>
  setOptions: React.Dispatch<React.SetStateAction<boolean>>;
  setScreen: React.Dispatch<React.SetStateAction<boolean>>;
  tab: string;
  drug: string;
  dropdownRef: React.RefObject<HTMLDivElement>;
  activeAction: string;
  setActiveAction: (value: string) => void;
}

const DrugDetailsHeader: React.FC<Props> = ({
  activeView,
  setActiveView,
  options,
  setOptions,
  setScreen,
  tab,
  dropdownRef,
  drug,
  activeAction,
  setActiveAction,
}) => {
  const dispatch = useDispatch();
  return (
    <div>
      <button
        onClick={() => {
          dispatch(updateActiveDrug(""));
          dispatch(updateActiveDrugId(""));
          setActiveView('list')
        }}
        className="flex gap-2 items-center font-semibold text-blue-600 hover:text-blue-800 transition-colors mb-8 group"
      >
        <ChevronLeft className="size-5 transition-transform group-hover:-translate-x-0.5" />
        <p className="text-base">Back to Drugs</p>
      </button>

      <div className="w-full flex justify-between relative items-center mb-6">
        <h1 className="text-3xl ss:text-4xl font-extrabold capitalize text-slate-800 border-b-4 border-blue-500 pb-1">
          {drug}
        </h1>
        <OptionModal
          activeView={activeView}
          setActiveView= {setActiveView}
          options={options}
          setOptions={setOptions}
          setScreen={setScreen}
          tab={tab}
          dropdownRef={dropdownRef}
          drug={drug}
          activeAction={activeAction}
          setActiveAction={setActiveAction}
        />
      </div>
    </div>
  );
};

export default DrugDetailsHeader;
