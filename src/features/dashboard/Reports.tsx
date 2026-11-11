/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useMemo } from "react";
import { useAppSelector } from "@/store";
import { useHealthJournal, useSchedule } from "@/hooks/useDashboardData";
import dayjs from "dayjs";
import { CalendarDays, CircleAlert, ListChecks, Tablets } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { HealthJournalEntry } from "@/types/dashboard";

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
  children,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  body?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-soft-md border border-black/[0.05] bg-white px-3.5 py-3">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-soft-canvas text-soft-ink">
        <Icon className="size-[18px]" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-[14px] font-semibold text-soft-ink">{title}</h3>
        {body ? (
          <p className="mt-0.5 text-[13px] leading-snug text-soft-muted">
            {body}
          </p>
        ) : null}
        {children}
      </div>
    </div>
  );
}

function SideEffectLine({ entry }: { entry: HealthJournalEntry }) {
  const severity =
    entry.severity != null ? ` · ${entry.severity}/5` : "";
  const med = entry.drug ? ` · ${entry.drug}` : "";
  return (
    <li className="text-[13px] leading-snug text-soft-muted">
      <span className="font-medium text-soft-ink">
        {entry.symptom || "Symptom"}
      </span>
      {severity}
      {med}
      {entry.notes ? (
        <span className="block truncate text-[12px] text-soft-muted/90">
          {entry.notes}
        </span>
      ) : null}
    </li>
  );
}

const Reports: React.FC<ReportsProps> = ({ today, selectDate }) => {
  const { userId } = useAppSelector((state) => state.app);
  const { data: schedule = [] } = useSchedule(userId);
  const { data: journal = [] } = useHealthJournal(userId);

  const currentDate = selectDate ?? today;
  const formattedDateFull = dayjs(currentDate).format("DD MMMM, YYYY");
  const formattedDate = dayjs(currentDate).format("YYYY-MM-DD");

  const filteredDrugs: ScheduleItem[] = schedule?.filter(
    (dose: ScheduleItem) => dose?.date === formattedDate
  );

  const daySideEffects = useMemo(
    () =>
      journal.filter(
        (e) =>
          e.kind === "side_effect" &&
          dayjs(e.loggedAt).format("YYYY-MM-DD") === formattedDate
      ),
    [journal, formattedDate]
  );

  const sideEffectsByMed = useMemo(() => {
    const map = new Map<string, HealthJournalEntry[]>();
    const unlinked: HealthJournalEntry[] = [];

    for (const entry of daySideEffects) {
      const key = (entry.drug || "").trim().toLowerCase();
      if (!key) {
        unlinked.push(entry);
        continue;
      }
      const list = map.get(key) ?? [];
      list.push(entry);
      map.set(key, list);
    }
    return { map, unlinked };
  }, [daySideEffects]);

  if ((!filteredDrugs || filteredDrugs.length === 0) && daySideEffects.length === 0) {
    return (
      <div className="h-full w-full font-jakarta">
        <h2 className="mb-2.5 text-[15px] font-semibold text-soft-ink">
          {formattedDateFull}
        </h2>
        <ReportRow
          icon={CalendarDays}
          title="Schedule"
          body="No medication doses or side effects logged for this day."
        />
      </div>
    );
  }

  const uniqueDrugs: string[] = Array.from(
    new Set((filteredDrugs || []).map((drug) => drug.drug))
  );
  const drugsString: string = uniqueDrugs.join(", ");

  const totalDoses = filteredDrugs?.length || 0;
  const completedDoses =
    filteredDrugs?.filter((drug) => drug.completed).length || 0;
  const completedPercentage =
    totalDoses > 0 ? (completedDoses / totalDoses) * 100 : 0;

  const displayValue = totalDoses
    ? `${completedDoses}/${totalDoses} (${completedPercentage.toFixed(0)}%)`
    : "No doses scheduled";

  const linkedMedKeys = new Set(
    uniqueDrugs.map((name) => name.trim().toLowerCase())
  );
  const orphanEffects = [
    ...sideEffectsByMed.unlinked,
    ...[...sideEffectsByMed.map.entries()]
      .filter(([key]) => !linkedMedKeys.has(key))
      .flatMap(([, entries]) => entries),
  ];

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
            {uniqueDrugs.length > 0 ? (
              <ReportRow
                icon={Tablets}
                title="Medications"
                body={drugsString}
              >
                <ul className="mt-2 space-y-2 border-t border-black/[0.04] pt-2">
                  {uniqueDrugs.map((name) => {
                    const effects =
                      sideEffectsByMed.map.get(name.trim().toLowerCase()) ||
                      [];
                    return (
                      <li key={name} className="min-w-0">
                        <p className="text-[13px] font-semibold capitalize text-soft-ink">
                          {name}
                        </p>
                        {effects.length > 0 ? (
                          <ul className="mt-1 space-y-1 pl-0.5">
                            {effects.map((entry) => (
                              <li
                                key={entry.id}
                                className="flex items-start gap-1.5 text-[12px] text-soft-muted"
                              >
                                <CircleAlert className="mt-0.5 size-3 shrink-0 text-soft-peach-ink" />
                                <span>
                                  <span className="font-medium text-soft-ink">
                                    {entry.symptom}
                                  </span>
                                  {entry.severity != null
                                    ? ` · ${entry.severity}/5`
                                    : ""}
                                  {entry.notes ? ` — ${entry.notes}` : ""}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-0.5 text-[12px] text-soft-muted">
                            No side effects logged
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </ReportRow>
            ) : null}

            {totalDoses > 0 ? (
              <ReportRow
                icon={ListChecks}
                title="Dose status"
                body={displayValue}
              />
            ) : null}

            {uniqueDrugs.length === 0 && daySideEffects.length > 0 ? (
              <ReportRow icon={CircleAlert} title="Side effects">
                <ul className="mt-1.5 space-y-1.5">
                  {daySideEffects.map((entry) => (
                    <SideEffectLine key={entry.id} entry={entry} />
                  ))}
                </ul>
              </ReportRow>
            ) : orphanEffects.length > 0 ? (
              <ReportRow icon={CircleAlert} title="Other side effects">
                <ul className="mt-1.5 space-y-1.5">
                  {orphanEffects.map((entry) => (
                    <SideEffectLine key={entry.id} entry={entry} />
                  ))}
                </ul>
              </ReportRow>
            ) : null}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Reports;
