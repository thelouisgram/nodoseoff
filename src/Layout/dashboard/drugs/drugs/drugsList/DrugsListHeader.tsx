import React from "react";
import { Search } from "lucide-react";

// Define the type for props
interface DrugsListHeaderProps {
  tab: string;
  searched: string;
  setSearched: (value: string) => void;
  setCurrentPage: (value: number) => void;
}

const DrugsListHeader: React.FC<DrugsListHeaderProps> = ({
  tab,
  searched,
  setSearched,
  setCurrentPage,
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearched(value);
    setCurrentPage(1);
  };
  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 bg-white border-b border-gray-100 rounded-t-lg">
      <h2 className="text-xl sm:text-2xl font-sans text-gray-800 font-semibold capitalize">
        {tab} List
      </h2>
      <div
        className="flex w-40 sm:w-64 items-center p-2 border border-gray-200 
             rounded-lg text-gray-600 gap-2 bg-white transition duration-150 ease-in-out 
             focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
      >
        <Search className="size-5 text-blue-500" />
        <input
          placeholder="Search medications..."
          value={searched}
          onChange={handleSearchChange}
          className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400"
        />
      </div>
    </div>
  );
};

export default DrugsListHeader;
