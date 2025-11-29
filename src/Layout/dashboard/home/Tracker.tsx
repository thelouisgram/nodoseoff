import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TrackerProps {
  tracker: string;
  setActiveModal: (value: string) => void
  dosesToDisplay: JSX.Element[];
  totalDoses: number;
  setTracker: Function;
}

const DOSES_PER_PAGE = 4;

const Tracker: React.FC<TrackerProps> = ({
  tracker,
  setActiveModal,
  dosesToDisplay,
  totalDoses,
  setTracker,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(dosesToDisplay.length / DOSES_PER_PAGE);

  // Reset to page 1 when tracker changes
  useEffect(() => {
    setCurrentPage(1);
  }, [tracker, dosesToDisplay.length]);

  const paginatedDoses = dosesToDisplay.slice(
    (currentPage - 1) * DOSES_PER_PAGE,
    currentPage * DOSES_PER_PAGE
  );

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="px-4 ss:px-8 md:px-0 mb-8">
      {/* Tracker Tabs */}
      <div className="flex justify-between items-center mb-4">
        <div className="bg-lightGrey border border-gray-200 p-1 rounded-[8px] flex justify-between w-full ss:w-[320px]">
          <button
            onClick={() => setTracker("Yesterday")}
            className={`
              px-3 py-2 ss:px-4
              text-[14px] font-Inter font-[500]
              w-full
              rounded-[6px] capitalize
              border
              transition-all duration-200
              ${
                tracker === "Yesterday"
                  ? "text-blue-700 bg-white shadow-sm border-gray-300"
                  : "text-grey bg-transparent border-transparent hover:text-blue-600"
              }
            `}
          >
            Yesterday
          </button>

          <button
            onClick={() => setTracker("Today")}
            className={`
              px-3 py-2 ss:px-4
              text-[14px] font-Inter font-[500]
              w-full
              rounded-[6px] capitalize
              border
              transition-all duration-200
              ${
                tracker === "Today"
                  ? "text-blue-700 bg-white shadow-sm border-gray-300"
                  : "text-grey bg-transparent border-transparent hover:text-blue-600"
              }
            `}
          >
            Today
          </button>
        </div>

        {/* Dose count indicator */}
        {totalDoses > 0 && (
          <span className="text-sm text-grey font-Inter hidden ss:inline">
            {totalDoses} {totalDoses === 1 ? "dose" : "doses"}
          </span>
        )}
      </div>

      {/* Dose Cards */}
      <div className="grid ss:grid-cols-2 gap-4 mb-6">
        {paginatedDoses.length > 0 ? (
          paginatedDoses
        ) : (
          <div className="text-center text-grey py-12 bg-white rounded-[10px] border border-gray-200 col-span-2">
            <p className="font-Inter text-[14px]">
              No doses scheduled for {tracker.toLowerCase()}
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="p-2 rounded-[8px] border border-gray-300 text-grey disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
              aria-label="Previous page"
            >
              <ChevronLeft className="size-5" strokeWidth={2} />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => {
                if (page === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-3 py-2 text-grey font-Inter text-[14px]"
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page as number)}
                    className={`min-w-[40px] px-3 py-2 rounded-[8px] font-Inter text-[14px] font-semibold transition-all ${
                      page === currentPage
                        ? "bg-blue-700 text-white shadow-sm"
                        : "text-grey bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="p-2 rounded-[8px] border border-gray-300 text-grey disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
              aria-label="Next page"
            >
              <ChevronRight className="size-5" strokeWidth={2} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracker;