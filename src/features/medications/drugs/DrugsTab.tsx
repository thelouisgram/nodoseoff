import React from "react";
import { drugsTab } from "@/utils/drugs";
import { motion } from "framer-motion";

interface DrugsTabProps {
  setTab: (value: string) => void;
  tab: string;
}

const DrugsTab: React.FC<DrugsTabProps> = ({ setTab, tab }) => {
  return (
    <div className="mb-8 bg-lightGrey dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 p-1 rounded-[8px] flex justify-between w-full ss:w-[450px] relative">
      {drugsTab.map((item: string, index: number) => {
        const isActive = item === tab;
        return (
          <button
            key={index}
            onClick={() => setTab(item)}
            className={`
              relative px-3 py-2 ss:px-4
              text-[14px] font-Inter font-[500]
              w-full
              rounded-[6px] capitalize
              transition-all duration-200 z-10
              ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-grey dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
              }
            `}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white dark:bg-slate-800 rounded-[6px] shadow-sm border border-gray-200 dark:border-slate-700"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-20">{item}</span>
          </button>
        );
      })}
    </div>
  );
};

export default DrugsTab;
