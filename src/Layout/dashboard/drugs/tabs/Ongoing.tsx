import React, { useState } from "react";
import Image from "next/image";
import RenderedDrugs from "../RenderedDrugs";
import { RootState } from "../../../../../store";
import { useSelector } from "react-redux";
import { frequencyToPlaceholder } from "../../../../../utils/dashboard";
import { DrugProps } from "../../../../../types/dashboard";


interface thisProps {
  setScreen: Function;
  setAllergyModal: Function;
  setEditModal: Function;
  setDeleteModal: Function;
  displayDrugs: boolean;
  setDisplayDrugs: Function;
}

const Ongoing: React.FC<thisProps> = ({
  setScreen,
  setEditModal,
  setDeleteModal,
  setAllergyModal,
  displayDrugs,
  setDisplayDrugs,
}) => {
  const [searched, setSearched] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { drugs } = useSelector((state: RootState) => state.app);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearched(value);
    setCurrentPage(1);
  };

  const findDrug = (searched: string) => {
    return drugs.filter((drug) =>
      drug.drug.startsWith(searched.toLowerCase())
    );
  };

  const filteredDrugs = searched ? findDrug(searched) : drugs;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDrugs.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredDrugs.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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
      />
    );
  });

  return (
    <div>
      {drugs.length > 0 ? (
        <div className="border-[1px] rounded-lg text-darkGrey">
          <div className="w-full justify-between flex py-6 px-4 bg-lightGrey rounded-t-lg items-center">
            <h2 className="font-[500] text-[14px] ss:text-[20px] font-Inter text-navyBlue">
              Current Drugs
            </h2>
            <div className="flex w-[150px] ss:w-[300px] items-center py-1 px-2 ss:px-3 ss:py-2 border-[1px] rounded-md text-navyBlue gap-1 ss:gap-3">
              <Image
                src="/assets/loupe.png"
                width="24"
                height="24"
                alt="search"
                className="w-[16px] h-[16px] ss:w-[20px] ss:h-[20px]"
              />
              <input
                placeholder="Search"
                className="bg-transparent outline-none w-full"
                value={searched}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="w-full flex justify-between px-4 border-y-[1px]">
            <h2 className="w-[25%] sm:w-[14%] py-4 uppercase text-[13px] font-semibold">
              Name
            </h2>
            <h2 className="w-[30%] sm:w-[10%] flex justify-center py-4 uppercase text-[13px] font-semibold">
              Route
            </h2>
            <h2 className="md:w-[24%] hidden md:flex justify-center py-4 uppercase text-[13px] font-semibold">
              Duration
            </h2>
            <h2 className="w-[35%] sm:w-[14%] flex justify-center py-4 uppercase text-[13px] font-semibold">
              Frequency
            </h2>
            <h2 className="md:w-[15%] hidden sm:flex justify-center py-4 uppercase text-[13px] font-semibold">
              Start Date
            </h2>
            <h2 className="md:w-[15%] hidden sm:flex justify-center py-4 uppercase text-[13px] font-semibold">
              End Date
            </h2>
            <h2 className="w-[10%] md:w-[6%] flex justify-center py-4 uppercase text-[13px] font-semibold"></h2>
          </div>

          <div className="w-full flex flex-col">
            {renderedDrugs.length > 0 ? (
              renderedDrugs
            ) : (
              <div className="w-full flex justify-center py-6 text-[16px] text-navyBlue font-[500]">
                No drug found with `{searched}`
              </div>
            )}
          </div>
          {filteredDrugs.length > 0 && (
            <div className="w-full flex justify-end p-4 gap-3 items-center">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-3 py-1 border flex gap-2 items-center rounded-md"
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
                className="px-3 py-1 border flex gap-2 items-center rounded-md"
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
          <h1 className="text-[20px] text-navyBlue font-semibold font-montserrant text-center opacity-30">
            Add a drug to get started!
          </h1>
        </div>
      )}
    </div>
  );
};

export default Ongoing;
