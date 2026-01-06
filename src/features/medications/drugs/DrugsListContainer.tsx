import React, { useEffect, useMemo, useState } from "react";
import { Inbox, Search } from "lucide-react";

import { useAppStore } from "@/store/useAppStore";
import {
  useDrugs,
  useCompletedDrugs,
  useAllergies,
} from "@/hooks/useDashboardData";
import DrugsListHeader from "./drugsList/DrugsListHeader";
import DrugsListTitle from "./drugsList/DrugsListTitle";
import DrugsList from "./drugsList/DrugsList";
import DrugsListPagination from "./drugsList/DrugsListPagination";
import { DrugProps } from "@/types/dashboard";

interface AllergyProps {
  drug: string;
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
}: any) => {
  /* Redux Replacement */
  const { userId } = useAppStore((state) => state);
  const { data: drugs = [] } = useDrugs(userId);
  const { data: completedDrugs = [] } = useCompletedDrugs(userId);
  const { data: allergies = [] } = useAllergies(userId);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageMemory, setPageMemory] = useState<Record<string, number>>({});

  const tabData: (DrugProps | AllergyProps)[] = useMemo(() => {
    if (tab === "ongoing") return drugs;
    if (tab === "completed") return completedDrugs;
    if (tab === "allergies") return allergies;
    return [];
  }, [tab, drugs, completedDrugs, allergies]);

  const filtered = useMemo(
    () =>
      tabData.filter((d) =>
        d.drug.toLowerCase().includes(search.toLowerCase())
      ),
    [tabData, search]
  );

  useEffect(() => {
    setPage(pageMemory[tab] || 1);
  }, [tab, activeView, pageMemory]);

  useEffect(() => {
    const max = Math.max(Math.ceil(filtered.length / PER_PAGE), 1);
    setPage((p) => Math.min(p, max));
    setPageMemory((p) => ({ ...p, [tab]: page }));
  }, [page, filtered.length, tab]);

  const data = useMemo(
    () => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [filtered, page]
  );

  const empty =
    filtered.length === 0 &&
    (search ? (
      <div className="py-10 text-center text-gray-500">
        <Search size={40} className="mx-auto" />
        <p>No results for “{search}”</p>
      </div>
    ) : (
      <div className="py-10 text-center text-gray-500">
        <Inbox size={40} className="mx-auto" />
        <p>
          {tab === "completed"
            ? "No completed drugs yet"
            : tab === "ongoing"
              ? "No ongoing drugs yet"
              : "No allergies added yet"}
        </p>
      </div>
    ));

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg mb-36 ss:mb-28 shadow-sm overflow-hidden">
      <DrugsListHeader
        tab={tab}
        searched={search}
        setSearched={setSearch}
        setCurrentPage={setPage}
        total={filtered.length}
      />

      {filtered.length ? (
        <>
          <DrugsListTitle tab={tab} />

          <DrugsList
            newData={data}
            tab={tab}
            options={options}
            setOptions={setOptions}
            activeAction={activeAction}
            setActiveAction={setActiveAction}
            setActiveView={setActiveView}
            activeView={activeView}
          />

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
