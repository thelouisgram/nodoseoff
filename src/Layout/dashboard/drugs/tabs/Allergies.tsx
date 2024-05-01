/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import { frequencyToPlaceholder } from "../../../../../utils/dashboard";
import RenderedDrugs from "../RenderedDrugs";

type RefObject<T> = React.RefObject<T>;

interface AllergiesProps {
  setDeleteModal: Function;
  setScreen: Function;
  setEditModal: Function;
  displayDrugs: boolean;
  setDisplayDrugs: Function;
  setAllergyModal: Function;
}

const Allergies: React.FC<AllergiesProps> = ({
  setDeleteModal,
  setScreen,
  setAllergyModal,
  setEditModal,
  displayDrugs,
  setDisplayDrugs,
}) => {
  const { allergies } = useSelector((state: RootState) => state.app);
  const [options, setOptions] = useState(false);

  const dropdownRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent): void => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOptions(false);
      setScreen(false);
    }
  };
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      handleClickOutside(event);
    };

    // add event listener for clicks outside of dropdown
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      // remove event listener when component unmounts
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const [searched, setSearched] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearched(value);
    setCurrentPage(1);
  };

  const findDrug = (searched: string) => {
    return allergies?.filter((drug) =>
      drug.drug.startsWith(searched.toLowerCase())
    );
  };

  const filteredDrugs = searched ? findDrug(searched) : allergies;

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

  // Hook to revert back to the previous page if necessary
  useEffect(() => {
    if (currentItems.length < 7 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentItems, currentPage]);

  const renderedAllergies = currentItems.map((item, index: number) => {
    return (
      <RenderedDrugs
        key={index}
        id={index}
        drug={item}
        frequencyToPlaceholder={frequencyToPlaceholder}
        setScreen={setScreen}
        setDeleteModal={setDeleteModal}
        setEditModal={setEditModal}
        setAllergyModal={setAllergyModal}
        displayDrugs={displayDrugs}
        setDisplayDrugs={setDisplayDrugs}
        showEditButton={false}
        tab={"Allergies"}
        currentPage={currentPage}
      />
    );
  });

  return (
    <div>
      {allergies.length > 0 ? (
        <div className="border-[1px] rounded-lg text-grey">
          <div className="w-full justify-between flex py-6 px-4 bg-lightGrey rounded-t-lg items-center">
            <h2 className="font-[500] text-[14px] ss:text-[20px] font-Inter text-navyBlue">
              Allergic Drugs
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
            <h2 className="w-[7%] sm:w-[4%] md:w-[6%] flex justify-center py-4 uppercase text-[13px] font-semibold"></h2>
          </div>

          <div className="w-full flex flex-col">
            {renderedAllergies.length > 0 ? (
              renderedAllergies
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
            Add an allergic drug to get started!
          </h1>
        </div>
      )}
    </div>
  );
};

export default Allergies;
