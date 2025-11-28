import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DrugProps } from "../../../../../../types/dashboard/dashboard";

interface AllergyProps {
  drug: string;
}

interface DrugsListPaginationProps {
  currentPage: number;
  newData: DrugProps[] | AllergyProps[] | undefined;
  setCurrentPage: (value: number) => void;
}

const DrugsListPagination: React.FC<DrugsListPaginationProps> = ({
  currentPage,
  newData,
  setCurrentPage,
}) => {
  const itemsPerPage = 6;

  if (!newData || newData.length === 0) return null;

  const totalPages = Math.ceil(newData.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-full flex justify-end items-center gap-3 px-6 py-4 text-sm font-medium text-gray-700">
      {/* Prev */}
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className={`
          flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all
          ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-50 text-gray-700"
          }
        `}
      >
        <ChevronLeft className="w-4 h-4" />
        Prev
      </button>

      {/* Page text */}
      <span className="px-3 py-1.5 rounded-md bg-slate-50 text-gray-600 font-semibold">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next */}
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={`
          flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all
          ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-50 text-gray-700"
          }
        `}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default DrugsListPagination;
