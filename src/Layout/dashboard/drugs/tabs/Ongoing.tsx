import React, { useState, useEffect } from "react";
import Image from "next/image";
import RenderedDrugs from "../RenderedDrugs";
import { RootState } from "../../../../../store";
import { useSelector } from "react-redux";
import { frequencyToPlaceholder } from "../../../../../utils/dashboard";
import { DrugProps } from "../../../../../types/dashboard";

interface OngoingProps {
  setScreen: Function;
  setAllergyModal: Function;
  setEditModal: Function;
  setDeleteModal: Function;
  displayDrugs: boolean;
  setDisplayDrugs: Function;
}

// Define the Ongoing component with the required props
const Ongoing: React.FC<OngoingProps> = ({
  setScreen,
  setEditModal,
  setDeleteModal,
  setAllergyModal,
  displayDrugs,
  setDisplayDrugs,
}) => {
  // Define state variables for searched query and current page
  const [searched, setSearched] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Use the Redux hook to select the drugs from the store
  const { drugs } = useSelector((state: RootState) => state.app);

  // Function to handle changes in the search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearched(value);
    setCurrentPage(1);
  };

  // Function to find drugs matching the search query
  const findDrug = (searched: string) => {
    return drugs.filter((drug) =>
      drug.drug.toLowerCase().startsWith(searched.toLowerCase())
    );
  };

  // Filter drugs based on the search query
  const filteredDrugs = searched ? findDrug(searched) : drugs;

  // Calculate pagination indices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDrugs.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(filteredDrugs.length / itemsPerPage);

  // Function to handle navigation to the next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to handle navigation to the previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Render the drugs list
  const renderedDrugs = currentItems.map((drug: DrugProps, index: number) => {
    return (
      <RenderedDrugs
        key={index}
        id={index}
        drug={drug}
        frequencyToPlaceholder={frequencyToPlaceholder}
        setScreen={setScreen}
        setDeleteModal={setDeleteModal}
        setEditModal={setEditModal}
        setAllergyModal={setAllergyModal}
        displayDrugs={displayDrugs}
        setDisplayDrugs={setDisplayDrugs}
        showEditButton={true}
        tab={"Ongoing"}
        currentPage={currentPage}
      />
    );
  });

  // Render the Ongoing component
  return (
    <div>
      {drugs.length > 0 ? (
        <div className="border-[1px] rounded-lg text-grey">
          <div className="w-full justify-between flex py-6 px-4 bg-lightGrey rounded-t-lg items-center">
            <h2 className="font-[500] text-[14px] ss:text-[20px] font-Inter text-navyBlue">
              Ongoing Drugs
            </h2>
            <div className="flex w-[150px] ss:w-[300px] items-center py-1 px-2 ss:px-3 ss:py-2 border-[1px] rounded-md text-navyBlue gap-1 ss:gap-3 bg-white">
              <Image
                src="/assets/loupe.png"
                width="24"
                height="24"
                alt="search"
                className="w-[16px] h-[16px] ss:w-[20px] ss:h-[20px]"
              />
              <input
                placeholder="Search"
                className="bg-transparent outline-none w-full text-grey"
                value={searched}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="w-full flex justify-between px-4 border-y-[1px]">
            <h2 className="w-[31%] sm:w-[15%] md:w-[16%] py-4 uppercase text-[13px] font-semibold">
              Name
            </h2>
            <h2 className="w-[31%] sm:w-[13.5%] md:w-[12.2%] flex justify-center py-4 uppercase text-[13px] font-semibold">
              Route
            </h2>
            <h2 className="md:w-[18.2%] hidden md:flex justify-center py-4 uppercase text-[13px] font-semibold">
              Duration
            </h2>
            <h2 className="w-[31%] sm:w-[20.5%] md:w-[17.2%] flex justify-center py-4 uppercase text-[13px] font-semibold">
              Frequency
            </h2>
            <h2 className="sm:w-[23.5%] md:w-[15.2%] hidden sm:flex justify-center py-4 uppercase text-[13px] font-semibold">
              Start Date
            </h2>
            <h2 className="sm:w-[23.5%] md:w-[15.2%] hidden sm:flex justify-center py-4 uppercase text-[13px] font-semibold">
              End Date
            </h2>
            <h2 className="w-[7%] sm:w-[4%] md:w-[6%] flex justify-center py-4 uppercase text-[13px] font-semibold"></h2>
          </div>

          <div className="w-full flex flex-col">
            {renderedDrugs.length > 0 ? (
              renderedDrugs
            ) : (
              <div className="w-full flex justify-center py-6 text-[16px] text-grey font-[500]">
                No Results Found
              </div>
            )}
          </div>
          {filteredDrugs.length > 0 && (
            <div className="w-full flex justify-end p-4 gap-3 items-center font-semibold font-Inter text-[14px]">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 border flex gap-2 items-center rounded-md ${
                  currentPage === 1 ? "cursor-not-allowed" : ""
                }`}
              >
                <Image
                  src="/assets/back.png"
                  alt="back"
                  width={16}
                  height={16}
                />
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border flex gap-2 items-center rounded-md ${
                  currentPage === totalPages ? "cursor-not-allowed" : ""
                }`}
              >
                Next
                <Image
                  src="/assets/back.png"
                  alt="back"
                  width={16}
                  height={16}
                  className="rotate-180"
                />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-[400px] flex justify-center items-center">
          <h1 className="text-[20px] text-navyBlue font-semibold font-karla text-center opacity-30">
            Add a medication to get started!
          </h1>
        </div>
      )}
    </div>
  );
};

export default Ongoing;
