import React from "react";
import { Pill, Shield, Clock } from "lucide-react";
import { calculateClosestDoseCountdown } from "../../../../../utils/dashboard/dashboard";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";

const SummaryCards = ({}) => {
  const { drugs, schedule } = useSelector((state: RootState) => state.app);
  return (
    <section className="md:w-full flex gap-4 ss:gap-5 mb-8 ss:mb-12 overflow-x-scroll md:overflow-hidden px-4 ss:px-8 md:px-0 bar">
      <div className="min-w-[300px] ss:w-full h-[120px] ss:h-[150px] bg-[#A755F7] rounded-[10px] flex justify-start items-center p-4 gap-2">
        <Clock className="w-12 h-12 text-white" strokeWidth={2} />
        <div className="flex flex-col text-white justify-center w-full items-start gap-1">
          <h2 className="leading-none font-semibold text-[14px]">
            Next dose in
          </h2>
          <h4 className="font-bold text-[28px] tracking-wider leading-none">
            {calculateClosestDoseCountdown(schedule) || "00:00:00"}
          </h4>
        </div>
      </div>

      <div className="min-w-[300px] ss:w-full h-[120px] ss:h-[150px] bg-grey rounded-[10px] flex justify-start items-center p-4 gap-2">
        <Pill className="w-12 h-12 text-white" strokeWidth={2} />
        <div className="flex flex-col text-white justify-center w-full items-start gap-1">
          <h2 className="leading-none font-semibold text-[14px]">
            Ongoing Drugs
          </h2>
          <h4 className="font-bold text-[28px] tracking-wider leading-none">
            {drugs.length}
          </h4>
        </div>
      </div>

      <div className="min-w-[300px] ss:w-full h-[120px] ss:h-[150px] bg-[#3B82F6] rounded-[10px] flex justify-start items-center py-4 pl-4 gap-2">
        <Shield className="w-12 h-12 text-white" strokeWidth={2} />
        <div className="flex flex-col text-white justify-center w-full items-start gap-1">
          <h2 className="leading-none font-semibold text-[14px]">
            Drug Compliance
          </h2>
          <h4 className="font-bold text-[28px] tracking-wider leading-none">
            {Math.round(
              (schedule.filter((d) => d.completed).length / schedule.length) *
                100 || 0
            )}
            %
          </h4>
        </div>
      </div>
    </section>
  );
};

export default SummaryCards;
