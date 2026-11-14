import React, { useEffect, useMemo, useRef, useState } from "react";
import { Inbox, Search } from "lucide-react";

import { useAppSelector } from "@/store";
import {
  useDrugs,
  useCompletedDrugs,
  useAllergies,
} from "@/hooks/useDashboardData";
import DrugsListHeader from "./drugsList/DrugsListHeader";
import DrugsListTitle from "./drugsList/DrugsListTitle";
import DrugsList from "./drugsList/DrugsList";
import DrugsListPagination from "./drugsList/DrugsListPagination";
import { SoftEmptyState } from "@/components/ui/soft";
import { groupDrugsByName, GroupedDrug } from "@/utils/drugs";

interface AllergyProps {
  drug: string;
}

interface DrugsListContainerProps {
  tab: string;
  options: boolean;
  setOptions: React.Dispatch<React.SetStateAction<boolean>>;
  activeAction: string;
  setActiveAction: (value: string) => void;
  setActiveView: React.Dispatch<React.SetStateAction<"details" | "list">>;
  activeView: string;
}

const PER_PAGE = 6;

const DrugsListContainer = ({
  tab,
  options,
  setOptions,
  activeAction,
  setActiveAction,
  setActiveView,
  activeView,
}: DrugsListContainerProps) => {
  /* Redux Replacement */
  const { userId } = useAppSelector((state) => state.app);
  const { data: drugs = [] } = useDrugs(userId);
  const { data: completedDrugs = [] } = useCompletedDrugs(userId);
  const { data: allergies = [] } = useAllergies(userId);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageMemory = useRef<Record<string, number>>({});

  // Completed: one row per drug name; each finished regimen is a course in details.
  const completedGrouped = useMemo(() => {
    return groupDrugsByName(completedDrugs).sort((a, b) => {
      const aEnd = Date.parse(a.end || "") || 0;
      const bEnd = Date.parse(b.end || "") || 0;
      if (bEnd !== aEnd) return bEnd - aEnd;
      return (a.drug || "").localeCompare(b.drug || "", undefined, {
        sensitivity: "base",
      });
    });
  }, [completedDrugs]);

  const tabData: (GroupedDrug | AllergyProps)[] = useMemo(() => {
    if (tab === "ongoing") return groupDrugsByName(drugs);
    if (tab === "completed") return completedGrouped;
    if (tab === "allergies") return allergies;
    return [];
  }, [tab, drugs, completedGrouped, allergies]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return tabData;
    return tabData.filter((d) => {
      const name = String(d.drug || "").toLowerCase();
      const nick = String(
        (d as { nickname?: string }).nickname || ""
      ).toLowerCase();
      return name.includes(q) || nick.includes(q);
    });
  }, [tabData, search]);

  useEffect(() => {
    setPage(pageMemory.current[tab] || 1);
  }, [tab, activeView]);

  useEffect(() => {
    const max = Math.max(Math.ceil(filtered.length / PER_PAGE), 1);
    setPage((p) => {
      const next = Math.min(p, max);
      pageMemory.current[tab] = next;
      return next;
    });
  }, [filtered.length, tab]);

  const data = useMemo(
    () => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [filtered, page]
  );

  const empty =
    filtered.length === 0 &&
    (search ? (
      <SoftEmptyState
        icon={<Search className="size-9" strokeWidth={1.5} />}
        title={`No results for “${search}”`}
        description="Try a different name or clear the search."
      />
    ) : (
      <SoftEmptyState
        icon={<Inbox className="size-9" strokeWidth={1.5} />}
        title={
          tab === "completed"
            ? "No completed drugs yet"
            : tab === "ongoing"
              ? "No ongoing drugs yet"
              : "No allergies added yet"
        }
        description={
          tab === "ongoing"
            ? "Add your first medication to start tracking doses."
            : undefined
        }
      />
    ));

  return (
    <div className="mb-36 overflow-hidden rounded-2xl border border-black/[0.05] bg-white shadow-soft-sm ss:mb-28">
      <DrugsListHeader
        tab={tab}
        searched={search}
        setSearched={setSearch}
        setCurrentPage={setPage}
        total={filtered.length}
      />

      {filtered.length ? (
        <>
          <div className="bg-[linear-gradient(180deg,rgba(244,245,247,0.65)_0%,rgba(255,255,255,0)_100%)]">
            <DrugsListTitle tab={tab} />
            <DrugsList
              newData={data as GroupedDrug[] | AllergyProps[]}
              tab={tab}
              options={options}
              setOptions={setOptions}
              activeAction={activeAction}
              setActiveAction={setActiveAction}
              setActiveView={setActiveView}
              activeView={activeView}
              startIndex={(page - 1) * PER_PAGE}
            />
          </div>
          <DrugsListPagination
            page={page}
            total={filtered.length}
            perPage={PER_PAGE}
            setPage={setPage}
          />
        </>
      ) : (
        empty
      )}
    </div>
  );
};

export default DrugsListContainer;
