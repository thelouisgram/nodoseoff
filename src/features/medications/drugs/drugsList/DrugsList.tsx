import React, { SetStateAction } from "react";
import {
  calculateTimePeriod,
  drugDisplayName,
  GroupedDrug,
  isAllergicToDrug,
  sameDrugName,
} from "@/utils/drugs";
import OptionModal from "../../optionModal";
import { useAppSelector, useAppDispatch } from "@/store";
import { setActiveDrug, setActiveDrugId } from "@/store/appSlice";
import { useAllergies } from "@/hooks/useDashboardData";
import { AnimatePresence, motion } from "framer-motion";
import { ndoEase } from "@/components/landing/motion";
import { DRUGS_GRID } from "./DrugsListTitle";
import { AlertTriangle, ChevronRight } from "lucide-react";

interface AllergyProps {
  drug: string;
  nickname?: string;
  imageUrl?: string;
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
  const { activeDrug, activeDrugId, userId } = useAppSelector(
    (state) => state.app
  );
  const { data: allergies = [] } = useAllergies(userId);
  const dispatch = useAppDispatch();

  if (tab === "allergies") {
    const allergies = newData as AllergyProps[];

    return (
      <div className="flex flex-col" role="list">
        <AnimatePresence mode="popLayout">
          {allergies?.map((item, index) => {
            const isActive = activeDrugId === item.drug;
            const rowKey = `${item.drug}-${startIndex + index}`;

            return (
              <motion.div
                key={rowKey}
                role="listitem"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{
                  duration: 0.28,
                  ease: ndoEase,
                  delay: Math.min(index * 0.035, 0.2),
                }}
                className="group relative flex items-center justify-between gap-3 border-b border-black/[0.04] px-4 py-3.5 last:border-0 ss:px-5"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <span className="w-5 shrink-0 text-right text-[11px] font-semibold tabular-nums text-soft-muted/80">
                    {String(startIndex + index + 1).padStart(2, "0")}
                  </span>
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="size-9 shrink-0 rounded-lg object-cover"
                    />
                  ) : null}
                  <div className="min-w-0">
                    <span className="block truncate text-[14px] font-semibold capitalize tracking-tight text-soft-ink">
                      {drugDisplayName(item)}
                    </span>
                    {item.nickname?.trim() ? (
                      <span className="mt-0.5 block truncate text-[12px] capitalize text-soft-muted">
                        {item.drug}
                      </span>
                    ) : null}
                  </div>
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
    <div className="flex flex-col" role="list">
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
            freqs.size > 1 ? "Varies" : formatFrequency(drug.frequency);

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
          const isAllergyMed =
            tab === "ongoing" && isAllergicToDrug(drug.drug, allergies);

          return (
            <motion.div
              key={rowKey}
              role="listitem"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{
                duration: 0.28,
                ease: ndoEase,
                delay: Math.min(index * 0.035, 0.2),
              }}
              onClick={() => {
                dispatch(setActiveDrug(drug.drug));
                dispatch(setActiveDrugId(drug.drugId));
                setActiveView("details");
              }}
              title={
                isAllergyMed
                  ? "On your allergy list — added with override"
                  : undefined
              }
              className={`${DRUGS_GRID} group cursor-pointer border-b px-4 py-3.5 last:border-0 ss:px-5 ${
                isAllergyMed
                  ? "border-amber-200/80 bg-amber-50 hover:bg-amber-100/70"
                  : isActive
                    ? "border-black/[0.04] bg-soft-primary-soft/50"
                    : "border-black/[0.04] hover:bg-soft-canvas/70"
              }`}
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <span
                  className={`w-5 shrink-0 text-right text-[11px] font-semibold tabular-nums ${
                    isAllergyMed ? "text-amber-700/70" : "text-soft-muted/80"
                  }`}
                >
                  {String(startIndex + index + 1).padStart(2, "0")}
                </span>
                {drug.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={drug.imageUrl}
                    alt=""
                    className="size-9 shrink-0 rounded-lg object-cover"
                  />
                ) : null}
                <div className="min-w-0">
                  <div className="flex min-w-0 items-center gap-2">
                    <p className="truncate text-[14px] font-semibold capitalize tracking-tight text-soft-ink">
                      {drugDisplayName(drug)}
                    </p>
                    {isAllergyMed ? (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-amber-200/80 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-900">
                        <AlertTriangle className="size-2.5" strokeWidth={2.5} />
                        Allergy
                      </span>
                    ) : null}
                  </div>
                  {drug.nickname?.trim() ? (
                    <p
                      className={`mt-0.5 truncate text-[12px] capitalize ${
                        isAllergyMed ? "text-amber-800/70" : "text-soft-muted"
                      }`}
                    >
                      {drug.drug}
                    </p>
                  ) : null}
                  <p
                    className={`mt-0.5 truncate text-[12px] ss:hidden ${
                      isAllergyMed ? "text-amber-800/70" : "text-soft-muted"
                    }`}
                  >
                    {[route !== "—" ? route : null, frequency, duration]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {courseCount > 1 ? (
                    <p
                      className={`mt-0.5 hidden text-[11px] font-medium ss:block ${
                        isAllergyMed ? "text-amber-800" : "text-soft-primary"
                      }`}
                    >
                      {courseCount} courses
                    </p>
                  ) : null}
                </div>
              </div>

              <p
                title={route}
                className="hidden truncate text-[13px] capitalize text-soft-muted ss:block"
              >
                {route}
              </p>

              <p
                title={duration}
                className="hidden truncate text-[13px] text-soft-muted ss:block"
              >
                {duration}
              </p>

              <div className="hidden min-w-0 ss:block">
                <span
                  className={`inline-flex max-w-full truncate rounded-md px-2 py-0.5 text-[12px] font-semibold ${
                    isAllergyMed
                      ? "bg-amber-200/70 text-amber-900"
                      : "bg-soft-primary/[0.07] text-soft-primary"
                  }`}
                >
                  {frequency}
                </span>
              </div>

              <div
                onClick={(e) => e.stopPropagation()}
                className="relative flex items-center justify-end gap-0.5"
              >
                <ChevronRight
                  className="ndo-chevron hidden size-4 text-soft-muted/50 group-hover:text-soft-primary ss:block"
                  strokeWidth={2}
                  aria-hidden
                />
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
