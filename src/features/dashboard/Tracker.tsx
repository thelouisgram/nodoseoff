import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TrackerProps {
  tracker: string;
  dosesToDisplay: JSX.Element[];
  totalDoses: number;
  setTracker: (value: string) => void;
}

const DOSES_PER_PAGE = 4;

const Tracker: React.FC<TrackerProps> = ({
  tracker,
  dosesToDisplay,
  totalDoses,
  setTracker,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(dosesToDisplay.length / DOSES_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [tracker, dosesToDisplay.length]);

  const startIndex = (currentPage - 1) * DOSES_PER_PAGE;
  const visibleDoses = dosesToDisplay.slice(
    startIndex,
    startIndex + DOSES_PER_PAGE
  );

  return (
    <div className="px-4 ss:px-8 md:px-0 mb-8">
      {/* Tabs */}
      <div className="flex justify-between items-center mb-4">
        <div className="bg-lightGrey dark:bg-slate-800 border border-gray-200 dark:border-gray-700 p-1 rounded-[8px] flex w-full ss:w-[320px] relative">
          {["Yesterday", "Today"].map((item) => (
            <button
              key={item}
              onClick={() => setTracker(item)}
              className={`
                px-3 py-2 ss:px-4 text-[14px]
                font-Inter font-medium w-full rounded-[6px]
                transition-colors duration-200 relative z-10
                ${
                  tracker === item
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-grey dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                }
              `}
            >
              {tracker === item && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 shadow-sm rounded-[6px] z-[-1]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {item}
            </button>
          ))}
        </div>

        {totalDoses > 0 && (
          <span className="hidden ss:inline text-sm text-grey dark:text-gray-400">
            {totalDoses} {totalDoses === 1 ? "dose" : "doses"}
          </span>
        )}
      </div>

      {/* Dose Cards Grid */}
      <div className="grid ss:grid-cols-2 gap-4 auto-rows-min">
        <AnimatePresence mode="popLayout" initial={false}>
          {visibleDoses.length > 0 ? (
            visibleDoses.map((dose) => (
              <motion.div
                key={dose.key}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {dose}
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-2 text-center py-8 bg-white dark:bg-slate-800 rounded-[10px] border border-gray-200 dark:border-gray-700 w-full"
            >
              <p className="text-grey dark:text-gray-400 text-sm">
                No doses scheduled for {tracker.toLowerCase()}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between ss:justify-end gap-3 items-center mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="
              px-4 py-2 rounded-[8px]
              text-sm font-medium
              border border-gray-300 dark:border-gray-600
              text-grey dark:text-gray-400
              disabled:opacity-40
              disabled:cursor-not-allowed
              hover:bg-gray-50 dark:hover:bg-slate-700
            "
          >
            Prev
          </button>

          <span className="text-sm text-grey dark:text-gray-400 font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="
              px-4 py-2 rounded-[8px] text-sm font-medium border border-gray-300 dark:border-gray-600
               text-grey dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700
            "
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Tracker;
