import React, { useEffect, useState, SetStateAction } from "react";
import { Inbox, Search } from "lucide-react";
import DrugsListHeader from "./drugsList/DrugsListHeader";
import DrugsListTitle from "./drugsList/DrugsListTitle";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import { DrugProps } from "../../../../../types/dashboard/dashboard";
import DrugsList from "./drugsList/DrugsList";
import DrugsListPagination from "./drugsList/DrugsListPagination";

interface DrugsListContainerProps {
  tab: string;
  options: boolean;
  setOptions: React.Dispatch<SetStateAction<boolean>>;
  setScreen: React.Dispatch<SetStateAction<boolean>>;
  dropdownRef: React.RefObject<HTMLDivElement>;
  activeAction: string;
  setActiveAction: (value: string) => void;
  setActiveView: React.Dispatch<SetStateAction<"details" | "list">>;
  activeView: string;
}

interface AllergyProps { drug: string }

const DrugsListContainer: React.FC<DrugsListContainerProps> = ({
  tab, options, setOptions, setScreen,
  dropdownRef, activeAction, setActiveAction, setActiveView, activeView
}) => {
  const [searched, setSearched] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [tabData, setTabData] = useState<DrugProps[] | AllergyProps[]>([]);

  const { drugs, completedDrugs, allergies } = useSelector((state: RootState) => state.app);

  // Update tab data whenever tab or Redux data changes
  useEffect(() => {
    let data: DrugProps[] | AllergyProps[] = [];
    switch (tab) {
      case "ongoing":
        data = drugs || [];
        break;
      case "completed":
        data = completedDrugs || [];
        break;
      case "allergies":
        data = allergies || [];
        break;
    }
    setTabData(data);
    setCurrentPage(1); // reset page on tab change
  }, [tab, drugs, completedDrugs, allergies]);

  // Filter data based on search
  const filteredData = tabData.filter(d =>
    d.drug.toLowerCase().includes(searched.toLowerCase())
  );

  // Pagination
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Ensure currentPage is valid when filteredData changes
  useEffect(() => {
    const totalPages = Math.max(Math.ceil(filteredData.length / itemsPerPage), 1);
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [filteredData, currentPage, itemsPerPage]);

  // Render empty states
  const renderEmptyState = () => {
    if (searched && filteredData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500 gap-2">
          <Search size={48} />
          <p className="text-sm">No results found for {searched}</p>
        </div>
      );
    }

    if (!searched && filteredData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500 gap-2">
          <Inbox size={48} />
          <p className="text-sm">
            {tab === "completed" ? "No completed drugs yet" :
             tab === "ongoing" ? "No ongoing drugs yet" :
             "No allergies added yet"}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="border border-gray-200 shadow-sm rounded-lg w-full">
      <DrugsListHeader
        tab={tab}
        searched={searched}
        setSearched={setSearched}
        setCurrentPage={setCurrentPage}
      />

      {filteredData.length > 0 ? (
        <>
          <DrugsListTitle tab={tab} />
          <DrugsList
            newData={paginatedData}
            tab={tab}
            options={options}
            setOptions={setOptions}
            setScreen={setScreen}
            dropdownRef={dropdownRef}
            activeAction={activeAction}
            setActiveAction={setActiveAction}
            setActiveView={setActiveView}
            activeView={activeView}
          />
          <DrugsListPagination
            newData={filteredData}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      ) : (
        renderEmptyState()
      )}
    </div>
  );
};

export default DrugsListContainer;
