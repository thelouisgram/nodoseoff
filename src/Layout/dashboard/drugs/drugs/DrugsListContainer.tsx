import React, { useEffect, useMemo, useState } from "react";
import { Inbox, Search } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import DrugsListHeader from "./drugsList/DrugsListHeader";
import DrugsListTitle from "./drugsList/DrugsListTitle";
import DrugsList from "./drugsList/DrugsList";
import DrugsListPagination from "./drugsList/DrugsListPagination";
import { DrugProps } from "../../../../../types/dashboard/dashboard";

interface AllergyProps {
  drug: string;
}

const PER_PAGE = 6;

const DrugsListContainer = ({
  tab,
  options,
  setOptions,
  setScreen,
  activeAction,
  setActiveAction,
  setActiveView,
  activeView,
}: any) => {
  const { drugs, completedDrugs, allergies } = useSelector(
    (s: RootState) => s.app
  );

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
      tabData.filter(d =>
        d.drug.toLowerCase().includes(search.toLowerCase())
      ),
    [tabData, search]
  );

  useEffect(() => {
    setPage(pageMemory[tab] || 1);
  }, [tab, activeView, pageMemory]);

  useEffect(() => {
    const max = Math.max(Math.ceil(filtered.length / PER_PAGE), 1);
    setPage(p => Math.min(p, max));
    setPageMemory(p => ({ ...p, [tab]: page }));
  }, [page, filtered.length, tab]);

  const data = useMemo(
    () =>
      filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE),
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
    <div className="border rounded-lg mb-36 ss:mb-28">
      <DrugsListHeader
        tab={tab}
        searched={search}
        setSearched={setSearch}
        setCurrentPage={setPage}
      />

      {filtered.length ? (
        <>
          <DrugsListTitle tab={tab} />

          <DrugsList
            newData={data}
            tab={tab}
            options={options}
            setOptions={setOptions}
            setScreen={setScreen}
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
