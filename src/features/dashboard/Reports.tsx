/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import { useAppSelector } from "@/store";
import { useSchedule } from "@/hooks/useDashboardData";
import dayjs from "dayjs";
import { CalendarDays, ListChecks, Tablets } from "lucide-react";
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
  isMobile: boolean;
}

function ReportRow({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-soft-md border border-black/[0.05] bg-white px-3.5 py-3">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-soft-canvas text-soft-ink">
        <Icon className="size-[18px]" strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <h3 className="text-[14px] font-semibold text-soft-ink">{title}</h3>
        <p className="mt-0.5 text-[13px] leading-snug text-soft-muted">{body}</p>
      </div>
    </div>
  );
}

const Reports: React.FC<ReportsProps> = ({ today, selectDate }) => {
  const { userId } = useAppSelector((state) => state.app);
  const { data: schedule = [] } = useSchedule(userId);

  const currentDate = selectDate ?? today;
  const formattedDateFull = dayjs(currentDate).format("DD MMMM, YYYY");
  const formattedDate = dayjs(currentDate).format("YYYY-MM-DD");

  const filteredDrugs: ScheduleItem[] = schedule?.filter(
    (dose: ScheduleItem) => dose?.date === formattedDate
  );

  if (!filteredDrugs || filteredDrugs.length === 0) {
    return (
      <div className="h-full w-full font-jakarta">
        <h2 className="mb-2.5 text-[15px] font-semibold text-soft-ink">
          {formattedDateFull}
        </h2>
        <ReportRow
          icon={CalendarDays}
          title="Schedule"
          body="No medication doses scheduled for this day."
        />
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
    <div className="h-full w-full font-jakarta">
      <AnimatePresence mode="wait">
        <motion.div
          key={formattedDate}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="mb-2.5 text-[15px] font-semibold text-soft-ink">
            {formattedDateFull}
          </h2>
          <div className="flex flex-col gap-2">
            <ReportRow
              icon={Tablets}
              title="Medications"
              body={drugsString || "N/A"}
            />
            <ReportRow
              icon={ListChecks}
              title="Dose status"
              body={displayValue}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Reports;
