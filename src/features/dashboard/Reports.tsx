/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

import { useAppStore } from "@/store/useAppStore";
import { useSchedule } from "@/hooks/useDashboardData";
import dayjs from "dayjs";
import { ListCheck, Pill } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const { userId } = useAppStore((state) => state);
  const { data: schedule = [] } = useSchedule(userId);

  const currentDate = selectDate ?? today;
  const formattedDateFull = dayjs(currentDate).format("DD MMMM, YYYY");
  const formattedDate = dayjs(currentDate).format("YYYY-MM-DD");

  const filteredDrugs: ScheduleItem[] = schedule?.filter(
    (dose: ScheduleItem) => dose?.date === formattedDate
  );

  if (!filteredDrugs || filteredDrugs.length === 0) {
    return (
      <div className="w-full h-full rounded-xl py-2 text-gray-600">
        <h2 className="font-semibold text-lg leading-none mb-4 text-gray-800 dark:text-gray-200">
          {formattedDateFull}
        </h2>
        {/* Minimalist 'No Doses' Warning: subtle background with a distinct icon color */}
        <div className="flex gap-4 items-center border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700 p-4 rounded-xl shadow-inner text-yellow-800 dark:text-yellow-400">
          <FaExclamationTriangle className="text-yellow-600 size-5 flex-shrink-0" />
          <span className="text-sm font-medium">
            No medication doses scheduled for this day.
          </span>
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
    <div className="w-full h-full rounded-[12px] pt-1 text-[15px] text-gray-600 dark:text-gray-400 font-karla">
      <AnimatePresence mode="wait">
        <motion.div
          key={formattedDate}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="font-semibold mb-3 text-[16px] leading-none text-gray-800 dark:text-slate-100">
            {formattedDateFull}
          </h2>
          <div className="h-full flex gap-4 flex-col leading-tight">
            {/* Medications Card */}
            <div className="flex gap-3 items-center border border-purple-600 rounded-[10px] p-4 bg-purple-50/20 dark:bg-purple-900/20">
              <Pill
                className="size-6 text-purple-600 dark:text-purple-400"
                strokeWidth={1.5}
              />
              <div>
                <h2 className="font-semibold text-[16px] text-[#7E1CE6] dark:text-purple-400">
                  Medications:
                </h2>
                <p className="capitalize text-navyBlue dark:text-slate-200">
                  {drugsString || "N/A"}
                </p>
              </div>
            </div>

            {/* Dose Status Card */}
            <div className="flex gap-3 items-center border border-pink-600 rounded-[10px] p-4 bg-pink-50/20 dark:bg-pink-900/20">
              <ListCheck
                className="size-6 text-pink-600 dark:text-pink-400"
                strokeWidth={1.5}
              />
              <div className="flex flex-col">
                <h2 className="font-semibold text-[16px] text-pink-600 dark:text-pink-400">
                  Dose Status:
                </h2>
                <p className="text-navyBlue dark:text-slate-200">
                  {displayValue}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Reports;
