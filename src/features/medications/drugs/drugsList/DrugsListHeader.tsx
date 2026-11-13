import React from "react";
import { Search, X } from "lucide-react";

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
    setSearched(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="flex w-full flex-col gap-3 border-b border-black/[0.05] px-4 py-4 ss:flex-row ss:items-end ss:justify-between ss:px-5 ss:py-5">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-soft-muted">
          Library
        </p>
        <h2 className="mt-0.5 flex items-baseline gap-2 text-[18px] font-bold tracking-tight text-soft-ink ss:text-[20px]">
          <span className="capitalize">{tab}</span>
          <span className="text-[13px] font-semibold tabular-nums text-soft-muted">
            {total}
          </span>
        </h2>
      </div>

      <div className="relative w-full ss:max-w-[240px]">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-soft-muted"
          strokeWidth={1.75}
        />
        <input
          placeholder="Search medications…"
          value={searched}
          onChange={handleSearchChange}
          className="w-full rounded-xl border border-black/[0.06] bg-soft-canvas py-2.5 pl-9 pr-9 text-[13px] text-soft-ink outline-none transition placeholder:text-soft-muted focus:border-soft-primary/25 focus:bg-white focus:ring-4 focus:ring-soft-primary/[0.06]"
          aria-label="Search medications"
        />
        {searched ? (
          <button
            type="button"
            onClick={() => {
              setSearched("");
              setCurrentPage(1);
            }}
            className="ndo-press absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-soft-muted hover:bg-white hover:text-soft-ink"
            aria-label="Clear search"
          >
            <X className="size-3.5" strokeWidth={2} />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default DrugsListHeader;
