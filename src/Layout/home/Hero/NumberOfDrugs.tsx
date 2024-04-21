import React from 'react'
import Image from "next/image";

const NumberOfDrugs = () => {
  return (
    <div
      className="absolute bottom-16 ss:bottom-36 md:bottom-48 -left-6 ss:-left-[72px] md:-left-20 bg-white rounded-[8px] ss:rounded-[16px] p-2 ss:py-3 ss:pl-3 flex 
            gap-2 ss:gap-3 items-center ss:pr-6 shadow-sm"
    >
      <div className="bg-lightGreen p-1 ss:p-2 rounded-[5px] ss:rounded-[10px]">
        <Image
          src="/assets/hero/pill.png"
          alt="pills"
          width={256}
          height={256}
          className="ss:w-6 ss:h-6 w-4 h-4"
        />
      </div>
      <div className="flex flex-col justify-start h-full leading-tight text-darkGreen">
        <h3 className="font-bold text-[12px] ss:text-[14px]">
          Number of Drugs
        </h3>
        <p className="text-black font-bold text-[14px] ss:text-[18px]">06</p>
      </div>
    </div>
  );
}

export default NumberOfDrugs
