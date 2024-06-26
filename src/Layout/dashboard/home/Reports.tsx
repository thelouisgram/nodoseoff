/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Image from "next/image";
import React from 'react';
import { FaExclamationTriangle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { ReportsProps, ScheduleItem } from "../../../../types/dashboard";

export interface Effect {
  date: string;
  effect: string;
  severity: string;
}

const Reports: React.FC<ReportsProps> = ({ today, selectDate }) => {
  const { effects, schedule } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch()

  const formattedDateFull = (selectDate ?? today).format("DD MMMM, YYYY");
  const formattedDate = (selectDate ?? today).format("YYYY-MM-DD");
  const dateEffects: Effect[] = effects.filter(
    (effect: Effect) => effect.date === formattedDate
  );

  const filteredDrugs = schedule?.filter(
    (dose: ScheduleItem) => dose?.date === formattedDate
  );

  const uniqueDrugs: string[] = Array.from(
    new Set(filteredDrugs.map((drug) => drug.drug))
  );
  const drugsString: string = uniqueDrugs.join(", ");

  const totalDoses = filteredDrugs.length;
  const completedDoses = filteredDrugs.filter((drug) => drug.completed).length;
  const completedFraction = completedDoses / totalDoses;
  const completedPercentage = completedFraction * 100;

  if (uniqueDrugs.length > 0 || dateEffects.length > 0) {
    const effectCount: Record<string, number> = dateEffects.reduce(
      (countMap: Record<string, number>, { effect }: Effect) => {
        countMap[effect] = (countMap[effect] || 0) + 1;
        return countMap;
      },
      {}
    );

    const joinedEffects = Object.entries(effectCount)
      .map(([effect, count]) => {
        if (count > 1) {
          return `${effect} (${count})`;
        }
        return effect;
      })
      .join(", ");

    const displayValue = isNaN(completedPercentage)
      ? "0%"
      : `${completedDoses}/${totalDoses} (${completedPercentage.toFixed(0)}%)`;

      

    return (
      <div className="w-full h-full rounded-[12px]  pt-5 text-[15px] text-gray-600 font-karla">
        <h2 className="font-semibold mb-4 ss:mb-6 text-[16px] leading-none">
          {formattedDateFull}
        </h2>
        <div className="h-full flex gap-6 ip:gap-8 flex-col leading-tight">
          <div className="flex gap-3 items-center border border-[#7E1CE6] rounded-[10px]  p-4">
            <Image
              src="/assets/daily-reports/drug.png"
              width="512"
              height="512"
              alt="meds"
              className="w-6 h-6"
            />
            <div>
              <h2 className="font-semibold text-[16px] text-[#7E1CE6] ">
                Medications:
              </h2>
              <p className="capitalize">{drugsString || "N/A"}</p>
            </div>
          </div>
          <div className="flex gap-3 items-center border border-[#D4389B] rounded-[10px] p-4">
            <Image
              src="/assets/daily-reports/check.png"
              width="512"
              height="512"
              alt="check"
              className="w-6 h-6"
            />
            <div className="flex flex-col">
              <h2 className="font-semibold text-[16px] text-[#D4389B]">
                Dose Status:
              </h2>
              <p>{displayValue}</p>
            </div>
          </div>
          <div className="flex gap-3 items-center border border-darkBlue rounded-[10px]  p-4">
            <Image
              src="/assets/daily-reports/sick.png"
              width="512"
              height="512"
              alt="check"
              className="w-6 h-6"
            />
            <div className="flex flex-col">
              <h2 className="font-semibold text-[16px] text-darkBlue">
                Side Effects:
              </h2>
              <p className="capitalize">{joinedEffects || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full h-full rounded-[12px]  py-6 text-gray-600">
        <h2 className="font-semibold text-[16px] leading-none mb-4 ss:mb-8">
          {formattedDateFull}
        </h2>
        <div className="h-full flex gap-3 items-center border border-gray-300 p-5 rounded-[10px] ">
          <FaExclamationTriangle /> No data for this day
        </div>
      </div>
    );
  }
};

export default Reports;
