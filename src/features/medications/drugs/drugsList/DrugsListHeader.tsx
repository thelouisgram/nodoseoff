import React from "react";
import { Search } from "lucide-react";

// Define the type for props
interface DrugsListHeaderProps {
  tab: string;
  searched: string;
  setSearched: (value: string) => void;
  setCurrentPage: (value: number) => void;
  total: number;
}

const DrugsListHeader: React.FC<DrugsListHeaderProps> = ({
  tab,
  searched,
  setSearched,
  setCurrentPage,
  total,
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearched(value);
    setCurrentPage(1);
  };
  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 rounded-t-lg">
      <h2 className="text-md sm:text-2xl font-sans text-gray-800 dark:text-slate-100 font-semibold capitalize">
        {tab} List ({total})
      </h2>
      <div
        className="flex w-36 sm:w-64 items-center p-2 gap-2 border border-gray-100 dark:border-slate-800 
             rounded-lg text-gray-600 dark:text-slate-400 bg-white dark:bg-slate-900 transition duration-150 ease-in-out 
             focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
      >
        <Search className="size-5 text-blue-500" />
        <input
          placeholder="Search"
          value={searched}
          onChange={handleSearchChange}
          className="bg-transparent outline-none w-full text-sm text-gray-700 dark:text-slate-100 placeholder-gray-400"
        />
      </div>
    </div>
  );
};

export default DrugsListHeader;
