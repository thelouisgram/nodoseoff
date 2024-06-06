import React from "react";
import Image from "next/image";

const Reports = () => {
  return (
    <div className="h-full flex flex-col justify-center">
      <h2 className="font-semibold mb-3 ss:mb-4 text-[14px] leading-none">
        05 July, 2024
      </h2>
      <div className="flex flex-col gap-3 text-[14px]">
        <div className="flex gap-2 items-center bg-white rounded-[10px]  p-4 shadow-md">
          <Image
            src="/assets/daily-reports/drug.png"
            width="512"
            height="512"
            alt="meds"
            className="w-5 h-5"
          />
          <div>
            <h2 className="font-semibold text-[14px] text-[#7E1CE6] ">
              Medications:
            </h2>
            <p className="capitalize">Paracetamol, Ampicillin</p>
          </div>
        </div>
        <div className="flex gap-2 items-center bg-white rounded-[10px] p-4 shadow-md">
          <Image
            src="/assets/daily-reports/check.png"
            width="512"
            height="512"
            alt="check"
            className="w-5 h-5"
          />
          <div className="flex flex-col">
            <h2 className="font-semibold text-[14px] text-[#D4389B]">
              Dose Status:
            </h2>
            <p>2/4 (50%)</p>
          </div>
        </div>
        <div className="flex gap-2 items-center bg-white rounded-[10px] p-4 shadow-md">
          <Image
            src="/assets/daily-reports/sick.png"
            width="512"
            height="512"
            alt="check"
            className="w-5 h-5"
          />
          <div className="flex flex-col">
            <h2 className="font-semibold text-[14px] text-darkBlue">
              Side Effects:
            </h2>
            <p className="capitalize">Cough, Headache</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
