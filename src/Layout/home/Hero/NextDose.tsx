import React from "react";
import Image from "next/image";

const NextDose = () => {
  return (
    <div
      className="absolute top-[28%] -left-6 ss:-left-20 bg-white rounded-[8px] ss:rounded-[16px] p-2 ss:py-3 ss:pl-3 flex gap-2 ss:gap-3 
              items-center ss:pr-10 shadow-sm"
    >
      <div className="bg-lightPurple p-1 ss:p-2 rounded-[5px] ss:rounded-[10px]">
        <Image
          src="/assets/hero/timer.png"
          alt="timer"
          width={256}
          height={256}
          className="ss:w-6 ss:h-6 w-4 h-4"
        />
      </div>
      <div className="flex flex-col justify-start h-full leading-tight text-darkPurple">
        <h3 className="font-bold text-[12px] ss:text-[14px]">Next dose in</h3>
        <p className="text-black font-bold text-[14px] ss:text-[18px]">
          08:27:44
        </p>
      </div>
    </div>
  );
};

export default NextDose;
