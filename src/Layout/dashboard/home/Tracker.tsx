import React, { useEffect, useState } from "react";

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
        <div className="bg-lightGrey border border-gray-200 p-1 rounded-[8px] flex w-full ss:w-[320px]">
          {["Yesterday", "Today"].map((item) => (
            <button
              key={item}
              onClick={() => setTracker(item)}
              className={`
                px-3 py-2 ss:px-4 text-[14px]
                font-Inter font-medium w-full rounded-[6px]
                transition-all
                ${
                  tracker === item
                    ? "bg-white text-blue-600 border border-gray-300 shadow-sm"
                    : "text-grey hover:text-blue-600"
                }
              `}
            >
              {item}
            </button>
          ))}
        </div>

        {totalDoses > 0 && (
          <span className="hidden ss:inline text-sm text-grey">
            {totalDoses} {totalDoses === 1 ? "dose" : "doses"}
          </span>
        )}
      </div>

      {/* Dose Cards Grid */}
      <div className="grid ss:grid-cols-2 gap-4">
        {visibleDoses.length > 0 ? (
          visibleDoses
        ) : (
          <div className="col-span-2 text-center py-12 bg-white rounded-[10px] border border-gray-200">
            <p className="text-grey text-sm">
              No doses scheduled for {tracker.toLowerCase()}
            </p>
          </div>
        )}
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
              border border-gray-300
              text-grey
              disabled:opacity-40
              disabled:cursor-not-allowed
              hover:bg-gray-50
            "
          >
            Prev
          </button>

          <span className="text-sm text-grey font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="
              px-4 py-2 rounded-[8px]
              text-sm font-medium
              border border-gray-300
              text-grey
              disabled:opacity-40
              disabled:cursor-not-allowed
              hover:bg-gray-50
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
