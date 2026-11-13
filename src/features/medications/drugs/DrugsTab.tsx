import React from "react";
import { drugsTab } from "@/utils/drugs";
import { motion } from "framer-motion";

interface DrugsTabProps {
  setTab: (value: string) => void;
  tab: string;
}

const DrugsTab: React.FC<DrugsTabProps> = ({ setTab, tab }) => {
  return (
    <div className="relative mb-6 flex w-full justify-between rounded-xl border border-black/[0.05] bg-white p-1 shadow-soft-sm ss:w-[450px]">
      {drugsTab.map((item: string, index: number) => {
        const isActive = item === tab;
        return (
          <button
            key={index}
            onClick={() => setTab(item)}
            className={`ndo-press relative z-10 w-full rounded-lg px-3 py-2 text-[14px] font-medium capitalize ss:px-4 ${
              isActive
                ? "text-soft-ink"
                : "text-soft-muted hover:text-soft-ink"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="drugs-tab"
                className="absolute inset-0 rounded-lg border border-black/[0.04] bg-soft-canvas"
                transition={{ type: "spring", bounce: 0.2, duration: 0.55 }}
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
