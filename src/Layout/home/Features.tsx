import Image from "next/image";
import React from "react";

const Features = () => {
  return (
    <div className="bg-white py-24 font-Inter">
      <div className="container md:w-[1165px] lg:w-[1165px] mx-auto px-4 md:px-0 w-full grid grid-cols-2 gap-5">
        <div className="px-6 py-12 bg-lightBlue flex justify-between rounded-[16px] w-full gap-6">
          <div className="flex flex-col text-grey w-[325px] gap-2 pt-14">
            <h2 className="font-bold leading-none text-[18px]">
              Medication Calendar and Report
            </h2>
            <p className="text-[16px] leading-tight font-[500]">
              Track your meds with our responsive calendar and get daily reports
              for updates.
            </p>
          </div>
          <div className="relative w-full">
            <Image
              src="/assets/calendar.png"
              width={459}
              height={439}
              alt="calendar"
              className="rounded-[16px] shadow-xl w-full h-auto"
            />
          </div>
        </div>
        <div className="px-6 py-12 bg-lightGreen flex justify-between rounded-[16px] w-full gap-6">
          <div className="flex flex-col text-grey w-[325px] gap-2 pt-14">
            <h2 className="font-bold leading-none text-[18px]">
              Medication Tracker
            </h2>
            <p className="text-[16px] leading-tight font-[500]">
              Easily mark off today&apos;s taken meds and never miss a dose.
            </p>
          </div>
          <div className="relative w-full flex items-center justify-center">
            <Image
              src="/assets/tracker.png"
              width={1012}
              height={728}
              alt="calendar"
              className="h-auto w-full"
            />
          </div>
        </div>
        <div className="px-6 py-12 bg-lightPurple flex justify-between rounded-[16px] w-full gap-6">
          <div className="flex flex-col text-grey w-[325px] gap-2 pt-14">
            <h2 className="font-bold leading-none text-[18px]">
              Generate a Drug History Summary
            </h2>
            <p className="text-[16px] leading-tight font-[500]">
              Share your drug history with your physician easily today
            </p>
          </div>
          <div className="relative w-full bg-[#FEFEFE] rounded-[16px] shadow-xl flex items-center justify-center">
            <Image
              src="/assets/tracker.png"
              width={459}
              height={439}
              alt="calendar"
              className="h-auto w-[275px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
