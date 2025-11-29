import React from "react";

const DrugsListTitle = ({ tab }: { tab: string }) => {
  const titles = ["Name", "Route", "Duration", "Frequency", ""];

  return (
    <div className="px-4 ss:px-6 py-3 flex justify-between items-center uppercase text-blue-600 font-semibold text-[12px] ss:text-[13px] border-b border-gray-100 bg-slate-50">
      {tab !== "allergies" ? (
        <>
          <span className="flex-[1.5]">Name</span>
          <span className="hidden ss:flex flex-1 text-center">Route</span>
          <span className="hidden ss:flex flex-1 text-center">Duration</span>
          <span className="flex-1 text-center">Frequency</span>
          <span className="flex-[0.3]"></span>
        </>
      ) : (
        <span className="flex-[1.5]">Name</span>
      )}
    </div>
  );
};

export default DrugsListTitle;
