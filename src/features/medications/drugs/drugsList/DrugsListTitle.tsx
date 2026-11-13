import React from "react";

/** Shared column template — keep in sync with DrugsList rows. */
export const DRUGS_GRID =
  "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 ss:grid-cols-[minmax(0,1.7fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1fr)_2.25rem] ss:gap-x-4";

const DrugsListTitle = ({ tab }: { tab: string }) => {
  if (tab === "allergies") {
    return (
      <div className="grid grid-cols-[minmax(0,1fr)_2.25rem] items-center gap-x-3 border-b border-black/[0.05] px-4 py-2.5 ss:px-5">
        <span className="text-[11px] font-semibold tracking-[0.08em] text-soft-muted">
          Allergen
        </span>
        <span />
      </div>
    );
  }

  return (
    <div
      className={`${DRUGS_GRID} border-b border-black/[0.05] px-4 py-2.5 ss:px-5`}
    >
      <span className="text-[11px] font-semibold tracking-[0.08em] text-soft-muted">
        Medication
      </span>
      <span className="hidden text-[11px] font-semibold tracking-[0.08em] text-soft-muted ss:block">
        Route
      </span>
      <span className="hidden text-[11px] font-semibold tracking-[0.08em] text-soft-muted ss:block">
        Duration
      </span>
      <span className="hidden text-[11px] font-semibold tracking-[0.08em] text-soft-muted ss:block">
        Frequency
      </span>
      <span aria-hidden />
    </div>
  );
};

export default DrugsListTitle;
