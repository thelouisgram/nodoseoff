import React, { SetStateAction } from "react";
import { calculateTimePeriod, GroupedDrug, sameDrugName } from "@/utils/drugs";
import OptionModal from "../../optionModal";
import { useAppSelector, useAppDispatch } from "@/store";
import { setActiveDrug, setActiveDrugId } from "@/store/appSlice";
import { AnimatePresence, motion } from "framer-motion";
import { DRUGS_GRID } from "./DrugsListTitle";

interface AllergyProps {
  drug: string;
}

interface DrugsListProps {
  newData: GroupedDrug[] | AllergyProps[] | undefined;
  tab: string;
  options: boolean;
  setOptions: React.Dispatch<SetStateAction<boolean>>;
  activeAction: string;
  setActiveAction: (value: string) => void;
  setActiveView: React.Dispatch<SetStateAction<"details" | "list">>;
  activeView: string;
  startIndex?: number;
}

const formatFrequency = (freq: string) => {
  if (!freq) return "—";
  const map: Record<string, string> = {
    qd: "1× daily",
    od: "1× daily",
    bid: "2× daily",
    tid: "3× daily",
    qid: "4× daily",
    prn: "As needed",
    eod: "Every other day",
    w: "Weekly",
    bw: "Biweekly",
    m: "Monthly",
  };

  return map[freq.toLowerCase().trim()] ?? freq;
};

const DrugsList: React.FC<DrugsListProps> = ({
  newData,
  tab,
  options,
  setOptions,
  activeAction,
  setActiveAction,
  setActiveView,
  activeView,
  startIndex = 0,
}) => {
  const { activeDrug, activeDrugId } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();

  if (tab === "allergies") {
    const allergies = newData as AllergyProps[];

    return (
      <div className="flex flex-col">
        <AnimatePresence mode="popLayout">
          {allergies?.map((item, index) => {
            const isActive = activeDrugId === item.drug;
            const rowKey = `${item.drug}-${startIndex + index}`;

            return (
              <motion.div
                key={rowKey}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-between border-b border-black/[0.05] bg-white px-4 py-3.5 text-sm last:border-0 ss:px-6"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-soft-canvas text-[12px] font-semibold text-soft-muted">
                    {startIndex + index + 1}
                  </span>
                  <span className="truncate font-semibold capitalize text-soft-ink">
                    {item.drug}
                  </span>
                </div>

                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative flex shrink-0 justify-end"
                >
                  <OptionModal
                    options={options && isActive}
                    setOptions={setOptions}
                    tab={tab}
                    drug={item.drug}
                    drugId={item.drug}
                    activeAction={activeAction}
                    setActiveAction={setActiveAction}
                    setActiveView={setActiveView}
                    activeView={activeView}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    );
  }

  const drugs = newData as GroupedDrug[];

  return (
    <div className="flex flex-col">
      <AnimatePresence mode="popLayout">
        {drugs?.map((drug, index) => {
          const isActive =
            sameDrugName(activeDrug, drug.drug) ||
            activeDrugId === drug.drugId;
          const courseCount = drug.courseCount || drug.courses?.length || 1;
          const duration =
            courseCount > 1
              ? `${courseCount} courses`
              : calculateTimePeriod(drug.start, drug.end);

          const freqs = new Set(
            (drug.courses || [drug]).map((c) =>
              (c.frequency || "").toLowerCase().trim()
            )
          );
          const frequency =
            freqs.size > 1
              ? "Varies"
              : formatFrequency(drug.frequency);

          const routes = new Set(
            (drug.courses || [drug]).map((c) =>
              (c.route || "").toLowerCase().trim()
            )
          );
          const route =
            routes.size > 1
              ? "Mixed"
              : drug.route?.trim()
                ? drug.route.trim().replace(/^\w/, (c) => c.toUpperCase())
                : "—";

          const rowKey = `name-${drug.drug.toLowerCase()}-${startIndex + index}`;

          return (
            <motion.div
              key={rowKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => {
                dispatch(setActiveDrug(drug.drug));
                dispatch(setActiveDrugId(drug.drugId));
                setActiveView("details");
              }}
              className={`${DRUGS_GRID} cursor-pointer border-b border-black/[0.05] bg-white px-4 py-3.5 text-sm last:border-0 hover:bg-soft-canvas/80 ss:px-6`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-[10px] text-[12px] font-semibold ${
                    isActive
                      ? "bg-soft-primary text-soft-card"
                      : "bg-soft-canvas text-soft-muted"
                  }`}
                >
                  {startIndex + index + 1}
                </span>
                <div className="min-w-0">
                  <span className="block truncate font-semibold capitalize text-soft-ink">
                    {drug.drug}
                  </span>
                  {courseCount > 1 ? (
                    <span className="text-[11px] text-soft-muted">
                      {courseCount} courses
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="hidden min-w-0 ss:block">
                <span
                  title={route}
                  className="inline-block max-w-full truncate rounded-[10px] bg-soft-canvas px-2.5 py-1 text-[12px] font-medium capitalize text-soft-muted"
                >
                  {route}
                </span>
              </div>

              <div className="hidden min-w-0 ss:block">
                <span
                  title={duration}
                  className="inline-block max-w-full truncate rounded-[10px] bg-soft-mint px-2.5 py-1 text-[12px] font-medium text-soft-mint-ink"
                >
                  {duration}
                </span>
              </div>

              <div className="min-w-0">
                <span
                  title={frequency}
                  className="inline-block max-w-full truncate rounded-[10px] bg-soft-primary-soft px-2.5 py-1 text-[12px] font-medium text-soft-primary"
                >
                  {frequency}
                </span>
              </div>

              <div
                onClick={(e) => e.stopPropagation()}
                className="relative flex justify-end"
              >
                <OptionModal
                  options={options && isActive}
                  setOptions={setOptions}
                  tab={tab}
                  drug={drug.drug}
                  drugId={drug.drugId}
                  activeAction={activeAction}
                  setActiveAction={setActiveAction}
                  setActiveView={setActiveView}
                  activeView={activeView}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default DrugsList;
