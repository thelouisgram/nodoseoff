import React from "react";
import { ongoingProps } from "../../../../../types/dashboardDrugs";
import Image from "next/image";

const Ongoing: React.FC<ongoingProps> = ({ renderedDrugs, drugs }) => {
  return (
    <div>
      {drugs.length > 0 ? (
        <div className="border-[1px] border-gray-100 rounded-lg text-darkGrey">
          <div className=" w-full justify-between flex py-6 px-4 bg-lightGrey rounded-t-lg items-center">
            <h2 className="font-[500] text-[14px] ss:text-[20px] font-Inter text-navyBlue">
              Current Drug List
            </h2>
            <div className="flex w-[150px] ss:w-[300px] items-center py-1 px-2 ss:p-2 border-[1px] rounded-md text-navyBlue gap-1 ss:gap-3">
              <Image
                src="/assets/mobile-dashboard/search.png"
                width="24"
                height="24"
                alt="search"
                className="w-[16px] h-[16px] ss:w-[24px] ss:h-[24px]"
              />
              <input  placeholder="Search" className="bg-transparent outline-none w-full"/>
            </div>
          </div>
          <div className="w-full flex justify-between px-4 border-y-[1px] border-gray-100 ">
            <h2 className="w-[25%] sm:w-[14%]  py-4 uppercase text-[13px] font-semibold ">
              Name
            </h2>
            <h2 className="w-[30%] sm:w-[10%] flex justify-center py-4 uppercase text-[13px] font-semibold">
              Route
            </h2>
            <h2 className="md:w-[14%] hidden md:flex justify-center py-4 uppercase text-[13px] font-semibold">
              Duration
            </h2>
            <h2 className="w-[35%] sm:w-[14%] flex justify-center py-4 uppercase text-[13px] font-semibold">
              Frequency
            </h2>
            <h2 className="md:w-[20%] hidden sm:flex justify-center py-4 uppercase text-[13px] font-semibold">
              Start Date
            </h2>
            <h2 className="md:w-[20%] hidden sm:flex justify-center py-4 uppercase text-[13px] font-semibold">
              End Date
            </h2>
            <h2 className="w-[10%] md:w-[6%] flex justify-center py-4 uppercase text-[13px] font-semibold"></h2>
          </div>
          <div className="w-full flex flex-col">{renderedDrugs} </div>
        </div>
      ) : (
        <div className="w-full h-[400px] flex justify-center items-center">
          {" "}
          <h1 className="text-[20px] text-navyBlue font-semibold font-montserrant text-center opacity-30">
            Add a drug to get started!
          </h1>
        </div>
      )}
    </div>
  );
};

export default Ongoing;
