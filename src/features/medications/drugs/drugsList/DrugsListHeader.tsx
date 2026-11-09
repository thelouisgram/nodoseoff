import React from "react";
import { Search } from "lucide-react";

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
    <div className="flex w-full items-center justify-between gap-3 border-b border-black/[0.05] bg-soft-card p-4 sm:p-5">
      <h2 className="text-[15px] font-semibold capitalize text-soft-ink sm:text-lg">
        {tab}{" "}
        <span className="font-medium text-soft-muted">({total})</span>
      </h2>
      <div className="flex w-36 items-center gap-2.5 rounded-soft-sm border border-black/[0.06] bg-soft-canvas px-3 py-2.5 text-soft-muted transition focus-within:border-soft-primary/25 focus-within:bg-soft-card focus-within:ring-4 focus-within:ring-soft-primary/[0.08] sm:w-64">
        <Search className="size-[18px] shrink-0" strokeWidth={1.7} />
        <input
          placeholder="Search"
          value={searched}
          onChange={handleSearchChange}
          className="w-full bg-transparent text-sm text-soft-ink outline-none placeholder:text-soft-muted"
        />
      </div>
    </div>
  );
};

export default DrugsListHeader;
