/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import dayjs from "dayjs";
import { ListCheck, Pill } from "lucide-react";

interface ScheduleItem {
    date: string;
    time: string;
    drug: string;
    completed: boolean;
}

interface ReportsProps {
  today: dayjs.Dayjs;
  selectDate: dayjs.Dayjs;
  isMobile: boolean; // Added for context, though styling is handled by parent
}


const Reports: React.FC<ReportsProps> = ({ today, selectDate, isMobile }) => {
  const { schedule } = useSelector((state: RootState) => state.app);

  const currentDate = selectDate ?? today;
  const formattedDateFull = dayjs(currentDate).format("DD MMMM, YYYY");
  const formattedDate = dayjs(currentDate).format("YYYY-MM-DD");

  const filteredDrugs: ScheduleItem[] = schedule?.filter(
    (dose: ScheduleItem) => dose?.date === formattedDate
  );

  if (!filteredDrugs || filteredDrugs.length === 0) {
    return (
      <div className="w-full h-full rounded-xl py-2 text-gray-600">
        <h2 className="font-semibold text-lg leading-none mb-4 text-gray-800">
          {formattedDateFull}
        </h2>
        {/* Minimalist 'No Doses' Warning: subtle background with a distinct icon color */}
        <div className="flex gap-4 items-center border border-yellow-200 bg-yellow-50 p-4 rounded-xl shadow-inner text-yellow-800">
          <FaExclamationTriangle className="text-yellow-600 size-5 flex-shrink-0" />
          <span className="text-sm font-medium">No medication doses scheduled for this day.</span>
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
    <div className="w-full h-full rounded-[12px] pt-1 text-[15px] text-gray-600 font-karla">
      <h2 className="font-semibold mb-3 text-[16px] leading-none">
        {formattedDateFull}
      </h2>
      <div className="h-full flex gap-4 flex-col leading-tight">
        {/* Medications Card */}
        <div className="flex gap-3 items-center border border-[#7E1CE6] rounded-[10px] p-4 bg-purple-50/50">
          <Pill className="size-6 text-[#7E1CE6]" strokeWidth={1.5} />
          <div>
            <h2 className="font-semibold text-[16px] text-[#7E1CE6] ">
              Medications:
            </h2>
            <p className="capitalize text-navyBlue">{drugsString || "N/A"}</p>
          </div>
        </div>

        {/* Dose Status Card */}
        <div className="flex gap-3 items-center border border-[#D4389B] rounded-[10px] p-4 bg-pink-50/50">
          <ListCheck className="size-6 text-[#D4389B]" strokeWidth={1.5} />
          <div className="flex flex-col">
            <h2 className="font-semibold text-[16px] text-[#D4389B]">
              Dose Status:
            </h2>
            <p className="text-navyBlue">{displayValue}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;