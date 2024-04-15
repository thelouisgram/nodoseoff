import Image from "next/image";
import React from "react";
import Tracker from "./features/tracker";
import Calendar from "./features/Calendar";

const Features = () => {
  return (
    <div className="bg-white py-24 font-Inter">
      <div className="container md:w-[1165px] lg:w-[1165px] mx-auto px-4 xs:px-1 ss:px-5 md:px-0 w-full grid ss:grid-cols-2 gap-5">
        <div className="px-6 py-10 md:py-12 bg-lightBlue flex flex-col md:flex-row justify-between rounded-[16px] w-full gap-6">
          <div className="flex flex-col text-grey md:w-[325px] gap-2 md:pt-14">
            <h2 className="font-bold leading-none text-[18px]">
              Medication Calendar and Report
            </h2>
            <p className="text-[16px] leading-tight font-[500]">
              Track your meds with our responsive calendar and get daily reports
              for updates.
            </p>
          </div>
          <div className="relative w-full">
            <Calendar />
          </div>
        </div>
        <div className="px-6 py-10 md:py-12 bg-lightGreen flex flex-col md:flex-row justify-between rounded-[16px] w-full gap-6">
          <div className="flex flex-col text-grey md:w-[325px] gap-2 md:pt-14">
            <h2 className="font-bold leading-none text-[18px]">
              Medication Tracker
            </h2>
            <p className="text-[16px] leading-tight font-[500]">
              Easily mark off today&apos;s taken meds and never miss a dose.
            </p>
          </div>
          <div className="relative w-full h-full flex items-start justify-center">
            <Tracker />
          </div>
        </div>
        <div className="px-6 py-10 md:py-12 bg-lightPurple flex flex-col md:flex-row justify-between rounded-[16px] w-full gap-6">
          <div className="flex flex-col text-grey md:w-[325px] gap-2 h-auto md:pt-14">
            <h2 className="font-bold leading-none text-[18px]">
              Generate your Drug History Summary
            </h2>
            <p className="text-[16px] leading-tight font-[500]">
              Share your drug history with your physician easily today
            </p>
          </div>
          <div className="relative w-full bg-[#FEFEFE] rounded-[16px] shadow-xl flex flex-col gap-5 items-center px-6 pt-4 pb-8">
            <h2 className="font-semibold text-[14px] mb-1">Drug History</h2>
            <div className="w-full flex gap-1">
              <h2 className="text-[14px] text-black w-20">Name</h2>
              <div className="w-1 h-5 bg-darkBlue"></div>
              <div className="w-full bg-gray-100 h-5"></div>
            </div>
            <div className="w-full flex gap-1">
              <h2 className="text-[14px] text-black w-20">Email</h2>
              <div className="w-1 h-5 bg-darkBlue"></div>
              <div className="w-full bg-gray-100 h-5"></div>
            </div>
            <div className="w-full flex gap-1">
              <h2 className="text-[14px] text-black w-20">Drugs</h2>
              <div className="w-1 h-5 bg-darkBlue"></div>
              <div className="w-full bg-gray-100 h-5"></div>
            </div>
            <div className="w-full flex gap-1">
              <h2 className="text-[14px] text-black w-20">Allergies</h2>
              <div className="w-1 h-5 bg-darkBlue"></div>
              <div className="w-full bg-gray-100 h-5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
