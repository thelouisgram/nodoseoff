import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DoseCard from "./DoseCard";
import { ScheduleItem } from "@/types/dashboard";

interface TrackerProps {
  tracker: string;
  doses: ScheduleItem[];
  onUpdateCompleted: (item: ScheduleItem) => void | Promise<void>;
  setTracker: (value: string) => void;
  /** Unique layoutId scope so Home / Drugs tabs don’t fight */
  layoutScope?: string;
}

const DOSES_PER_PAGE = 4;

const Tracker: React.FC<TrackerProps> = ({
  tracker,
  doses,
  onUpdateCompleted,
  setTracker,
  layoutScope = "home",
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalDoses = doses.length;
  const totalPages = Math.ceil(totalDoses / DOSES_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [tracker, totalDoses]);

  const startIndex = (currentPage - 1) * DOSES_PER_PAGE;
  const visibleDoses = doses.slice(startIndex, startIndex + DOSES_PER_PAGE);

  return (
    <div className="mb-0">
      <div className="mb-4 flex items-center justify-between">
        <div className="relative flex w-full rounded-xl border border-black/[0.05] bg-soft-canvas p-1 ss:w-[320px]">
          {["Yesterday", "Today"].map((item) => (
            <button
              key={item}
              onClick={() => setTracker(item)}
              className={`relative z-10 w-full rounded-lg px-3 py-2 text-[14px] font-medium transition-colors duration-200 ss:px-4 ${
                tracker === item
                  ? "text-soft-ink"
                  : "text-soft-muted hover:text-soft-ink"
              }`}
            >
              {tracker === item && (
                <motion.div
                  layoutId={`dose-day-tab-${layoutScope}`}
                  className="absolute inset-0 z-[-1] rounded-lg border border-black/[0.04] bg-white shadow-soft-sm"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.55 }}
                />
              )}
              {item}
            </button>
          ))}
        </div>

        {totalDoses > 0 && (
          <span className="hidden text-sm text-soft-muted ss:inline">
            {totalDoses} {totalDoses === 1 ? "dose" : "doses"}
          </span>
        )}
      </div>

      <div className="grid auto-rows-min gap-3 ss:grid-cols-2">
        {visibleDoses.length > 0 ? (
          visibleDoses.map((item) => (
            <DoseCard
              key={`${item.id}-${item.drugId}-${item.time}`}
              item={item}
              onUpdateCompleted={onUpdateCompleted}
            />
          ))
        ) : (
          <div className="col-span-2 w-full rounded-soft-lg border border-black/[0.04] bg-soft-canvas py-10 text-center">
            <p className="text-sm text-soft-muted">
              No doses scheduled for {tracker.toLowerCase()}
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between gap-3 ss:justify-end">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-soft-sm border border-black/[0.08] bg-white px-4 py-2 text-sm font-medium text-soft-muted transition hover:bg-soft-canvas disabled:cursor-not-allowed disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-sm font-medium text-soft-muted">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded-soft-sm border border-black/[0.08] bg-white px-4 py-2 text-sm font-medium text-soft-muted transition hover:bg-soft-canvas disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Tracker;
