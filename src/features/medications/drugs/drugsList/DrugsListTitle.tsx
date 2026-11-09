import React from "react";

/** Shared column template — keep in sync with DrugsList rows. */
export const DRUGS_GRID =
  "grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_2rem] items-center gap-x-3 ss:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_2rem]";

const DrugsListTitle = ({ tab }: { tab: string }) => {
  if (tab === "allergies") {
    return (
      <div className="grid grid-cols-[minmax(0,1fr)_2rem] items-center gap-x-3 border-b border-black/[0.05] bg-soft-canvas px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-soft-muted ss:px-6 ss:text-[12px]">
        <span>Name</span>
        <span />
      </div>
    );
  }

  return (
    <div
      className={`${DRUGS_GRID} border-b border-black/[0.05] bg-soft-canvas px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-soft-muted ss:px-6 ss:text-[12px]`}
    >
      <span className="text-left">Name</span>
      <span className="hidden text-left ss:block">Route</span>
      <span className="hidden text-left ss:block">Duration</span>
      <span className="text-left">Frequency</span>
      <span />
    </div>
  );
};

export default DrugsListTitle;
