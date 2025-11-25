/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Image from "next/image";
import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { ReportsProps, ScheduleItem } from "../../../../types/dashboard";
import dayjs from "dayjs";
import { ListCheck, Pill } from "lucide-react";

const Reports: React.FC<ReportsProps> = ({ today, selectDate }) => {
  const { schedule } = useSelector((state: RootState) => state.app);

  const currentDate = selectDate ?? today;
  const formattedDateFull = dayjs(currentDate).format("DD MMMM, YYYY");
  const formattedDate = dayjs(currentDate).format("YYYY-MM-DD");

  const filteredDrugs = schedule?.filter(
    (dose: ScheduleItem) => dose?.date === formattedDate
  );

  if (!filteredDrugs || filteredDrugs.length === 0) {
    return (
      <div className="w-full h-full rounded-[12px] py-6 text-gray-600">
        <h2 className="font-semibold text-[16px] leading-none mb-4 ss:mb-8">
          {formattedDateFull}
        </h2>
        <div className="h-full flex gap-3 items-center border border-gray-300 p-5 rounded-[10px] ">
          <FaExclamationTriangle className="text-red-500" />
          <span className="ml-2">No data for this day</span>
        </div>
      </div>
    );
  }

  const uniqueDrugs: string[] = Array.from(
    new Set(filteredDrugs.map((drug) => drug.drug))
  );
  const drugsString: string = uniqueDrugs.join(", ");

  const totalDoses = filteredDrugs.length;
  const completedDoses = filteredDrugs.filter((drug) => drug.completed).length;
  const completedPercentage =
    totalDoses > 0 ? (completedDoses / totalDoses) * 100 : 0;

  const displayValue = `${completedDoses}/${totalDoses} (${completedPercentage.toFixed(0)}%)`;

  return (
    <div className="w-full h-full rounded-[12px] pt-5 text-[15px] text-gray-600 font-karla">
      <h2 className="font-semibold mb-4 ss:mb-6 text-[16px] leading-none">
        {formattedDateFull}
      </h2>
      <div className="h-full flex gap-6 ip:gap-8 flex-col leading-tight">
        {/* Medications */}
        <div className="flex gap-3 items-center border border-[#7E1CE6] rounded-[10px] p-4">
          <Pill className="size-6 text-[#7E1CE6]" strokeWidth={1.5} />
          <div>
            <h2 className="font-semibold text-[16px] text-[#7E1CE6] ">
              Medications:
            </h2>
            <p className="capitalize">{drugsString || "N/A"}</p>
          </div>
        </div>

        {/* Dose Status */}
        <div className="flex gap-3 items-center border border-[#D4389B] rounded-[10px] p-4">
          <ListCheck className="size-6 text-[#D4389B]" strokeWidth={1.5} />
          <div className="flex flex-col">
            <h2 className="font-semibold text-[16px] text-[#D4389B]">
              Dose Status:
            </h2>
            <p>{displayValue}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
