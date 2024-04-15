import React from "react";
import Image from "next/image";
import { FaCheck } from "react-icons/fa";

const Tracker = () => {
  return (
    <div className="w-full h-auto flex flex-col gap-3">
      <div
        className="p-5 md:p-4 shadow-md rounded-[10px] items-center  flex justify-between
          bg-white w-full font-Inter text-[14px]"
      >
        <div className="flex gap-3 text-navyBlue items-center ">
          <Image
            src="/assets/shell.png"
            width={512}
            height={512}
            alt="pill"
            className="w-10 h-10 "
          />
          <div className="flex flex-col gap-0 items-start">
            <p className="capitalize font-semibold w-[125px] ss:w-auto">
              Ampicillin
            </p>
            <p>8:00AM</p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <h2 className="font-karla">Taken:</h2>
          <div
            className={`${"bg-navyBlue text-white"} border-[1px] border-navyBlue px-1 py-1 rounded-full`}
          >
            <FaCheck className="text-[12px]" />
          </div>
        </div>
      </div>
      <div
        className="p-5 md:p-4 shadow-md rounded-[10px] items-center  flex justify-between
          bg-white w-full font-Inter text-[14px]"
      >
        <div className="flex gap-3 text-navyBlue items-center ">
          <Image
            src="/assets/shell.png"
            width={512}
            height={512}
            alt="pill"
            className="w-10 h-10 "
          />
          <div className="flex flex-col gap-0 items-start">
            <p className="capitalize font-semibold w-[125px] ss:w-auto">
              Rifampicin
            </p>
            <p>8:00AM</p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <h2 className="font-karla">Taken:</h2>
          <div
            className={`${"bg-navyBlue text-white"} border-[1px] border-navyBlue px-1 py-1 rounded-full`}
          >
            <FaCheck className="text-[12px]" />
          </div>
        </div>
      </div>
      <div
        className="p-5 md:p-4 shadow-md rounded-[10px] items-center  flex justify-between
          bg-white w-full font-Inter text-[14px]"
      >
        <div className="flex gap-3 text-navyBlue items-center ">
          <Image
            src="/assets/shell.png"
            width={512}
            height={512}
            alt="pill"
            className="w-10 h-10 "
          />
          <div className="flex flex-col gap-0 items-start">
            <p className="capitalize font-semibold w-[125px] ss:w-auto">
              Paracetamol
            </p>
            <p>2:00PM</p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <h2 className="font-karla">Taken:</h2>
          <div
            className={`${"bg-none text-white"} border-[1px] border-navyBlue px-1 py-1 rounded-full`}
          >
            <FaCheck className="text-[12px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracker;
