import React from "react";
import ImageWithText from "./ImageWithText";
import Image from "next/image";

interface ReportProps{
  setTab: Function;
}

const Report:React.FC<ReportProps> = ({setTab}) => {
  return (
    <div className="h-[100dvh] overflow-y-scroll w-full md:py-16 md:px-12 px-4 pt-10 pb-24 ss:p-10 ss:pb-24  mb-10 text-navyBlue font-karla relative">
      <div
        onClick={() => setTab("Account")}
        className="flex gap-3 items-center mb-4 font-semibold text-[14px] ss:text-[18px] cursor-pointer"
      >
        <Image
          src="/assets/back.png"
          width={512}
          height={512}
          alt="back"
          className="w-6 h-6"
        />
        Back
      </div>
      <div className="mb-[28px] ">
        <h1 className="text-[24px] ss:text-[32px] font-semibold font-montserrant ">
          Reports
        </h1>
        <p className="text-[16px] text-[#718096]">
          Share your Drug History with your Physician!
        </p>
      </div>
      <ImageWithText />
    </div>
  );
};

export default Report;
