import React from "react";
import { drugsTab } from "../../../../../utils/drugs";

interface DrugsTabProps {
  setTab: (value: string) => void;
  tab: string;
}

const DrugsTab: React.FC<DrugsTabProps> = ({ setTab, tab }) => {
  return (
    <div className="mb-8 bg-lightGrey border p-1 rounded-[6px] flex justify-between w-full ss:w-[450px]">
      {drugsTab.map((item: string, index: number) => (
        <button
          key={index}
          onClick={() => setTab(item)}
          className={`
            px-3 py-2 ss:px-4
            text-[14px] font-Inter font-[500]
            w-full
            rounded-[6px]
            border
            transition-all duration-200
            ${
              item === tab
                ? "text-blue-700 bg-white shadow-sm border-gray-300"
                : "text-grey bg-transparent border-transparent"
            }
          `}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default DrugsTab;
