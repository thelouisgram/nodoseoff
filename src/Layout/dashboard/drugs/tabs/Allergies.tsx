/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../store";
import Image from "next/image";
import { updateActiveAllergy } from "../../../../../store/stateSlice";
import RenderedDrugs from "../RenderedDrugs";
import { frequencyToPlaceholder } from "../../../../../utils/dashboard";

type RefObject<T> = React.RefObject<T>;

interface allergiesProps {
  setDeleteModal: Function;
  setScreen: Function;
  setEditModal: Function;
  displayDrugs: boolean;
  setDisplayDrugs: Function;
  setAllergyModal: Function;
}

const Allergies: React.FC<allergiesProps> = ({
  setDeleteModal,
  setScreen,
  setAllergyModal,
  setEditModal,
  displayDrugs,
  setDisplayDrugs,
}) => {
  const { allergies } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();
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
    return allergies?.filter((drug: any) =>
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

  const renderedAllergies = currentItems.map((item: any, index: number) => {
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
      />
    );
  });

  return (
    <div>
      {allergies.length > 0 ? (
        <div className="border-[1px] rounded-lg text-darkGrey">
          <div className="w-full justify-between flex py-6 px-4 bg-lightGrey rounded-t-lg items-center">
            <h2 className="font-[500] text-[14px] ss:text-[20px] font-Inter text-navyBlue">
              Allergic Drugs
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
            <h2 className="w-[10%] md:w-[6%] flex justify-center py-4 uppercase text-[13px] font-semibold"></h2>
          </div>

          <div className="w-full flex flex-col">
            {renderedAllergies.length > 0 ? (
              renderedAllergies
            ) : (
              <div className="w-full flex justify-center py-6 text-[16px] text-navyBlue font-[500]">
                No drug found with `{searched}`
              </div>
            )}
          </div>
          {filteredDrugs.length > 0 && (
            <div className="w-full flex justify-end p-4 gap-3 items-center text-[13px] ss:text-[16px]">
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
            Add an allergic drug to get started!
          </h1>
        </div>
      )}
    </div>
  );
};

export default Allergies;
