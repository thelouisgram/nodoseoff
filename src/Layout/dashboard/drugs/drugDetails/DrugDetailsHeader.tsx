import React, { SetStateAction } from "react";
import { useDispatch } from "react-redux";
import OptionModal from "../optionModal";
import { useAppStore } from "../../../../../store/useAppStore";

interface Props {
  options: boolean;
  activeView: string;
  setActiveView: React.Dispatch<SetStateAction<"details" | "list">>;
  setOptions: React.Dispatch<React.SetStateAction<boolean>>;
  tab: string;
  drug: string;
  activeAction: string;
  setActiveAction: (value: string) => void;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const DrugDetailsHeader: React.FC<Props> = ({
  activeView,
  setActiveView,
  options,
  setOptions,
  tab,
  drug,
  activeAction,
  setActiveAction,
}) => {
  const dispatch = useDispatch();
  const { setActiveDrug, setActiveDrugId, activeDrugId} = useAppStore((state) => state);

  const handleBreadcrumbClick = (level: "list") => {
    if (level === "list") {
      setActiveDrug("");
      setActiveDrugId("");
      setActiveView("list");
    }
  };

  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 flex items-center gap-1 mb-4">
        <button
          onClick={() => handleBreadcrumbClick("list")}
          className="hover:text-blue-600 transition-colors"
        >
          {capitalize(tab)}
        </button>
        <span className="mx-1">/</span>
        <span className="text-gray-800 font-semibold capitalize">{drug}</span>
      </nav>

      {/* Title and Options */}
      <div className="w-full flex justify-between items-center">
        <h1 className="text-3xl ss:text-4xl font-extrabold capitalize text-slate-800 pb-1">
          {drug}
        </h1>
        <OptionModal
          activeView={activeView}
          setActiveView={setActiveView}
          options={options}
          setOptions={setOptions}
          tab={tab}
          drug={drug}
          drugId={activeDrugId}
          activeAction={activeAction}
          setActiveAction={setActiveAction}
        />
      </div>
    </div>
  );
};

export default DrugDetailsHeader;
