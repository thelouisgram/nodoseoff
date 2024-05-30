import React from "react";
import DownloadableReport from "./DownloadableReport";
import Image from "next/image";

interface ReportProps {
  setTab: Function;
}

const Report: React.FC<ReportProps> = ({ setTab }) => {
  return (
    <div className="h-[100dvh] overflow-y-scroll w-full md:py-16 md:px-12 px-4 pt-10 pb-24 ss:p-10 ss:pb-24  mb-10 text-navyBlue font-karla relative">
      <button
        onClick={() => setTab("Account")}
        className="flex gap-1 items-center font-Inter mb-6"
      >
        <Image
          src="/assets/down.png"
          alt="back"
          width={20}
          height={20}
          className="rotate-90"
        />
        <p className="font-[500] text-[18px]">Back</p>
      </button>
     
      <DownloadableReport />
    </div>
  );
};

export default Report;
