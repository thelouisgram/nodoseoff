/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../store";
import Image from "next/image";
import { updateActiveAllergy } from "../../../../../store/stateSlice";

type RefObject<T> = React.RefObject<T>;

interface allergiesProps {
  setDeleteAllergyModal: Function;
  setScreen: Function;
  deleteAllergyModal: boolean;
}

const Allergies: React.FC<allergiesProps> = ({
  deleteAllergyModal,
  setDeleteAllergyModal,
  setScreen
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
      setScreen(false)
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

  const renderedAllergies = allergies.map((item: any, index: number) => {
    return (
      <div
        key={index}
        className="p-5 w-full bg-lightBlue relative text-navyBlue rounded-[10px] rounded-bl-none capitalize flex flex-center h-full"
      >
        {index + 1}. {item?.allergy}
        <button
          onClick={() => {
            setOptions((prev) => !prev),
            dispatch(updateActiveAllergy(item.allergy))
          }}
          className="absolute  right-3 flex flex-col gap-1 cursor-pointer w-7 h-7 justify-center items-center rounded-full"
        >
          <div className="w-[3px] h-[3px] rounded-full bg-navyBlue" />
          <div className="w-[3px] h-[3px] rounded-full bg-navyBlue" />
          <div className="w-[3px] h-[3px] rounded-full bg-navyBlue" />
        </button>
        {options && (
          <div
            ref={dropdownRef}
            className="absolute right-3 top-10 text-navyBlue flex flex-col items-start justify-center mt-3 rounded-[10px] 
        bg-white shadow-md w-[150px] ss:w-[250px] py-3 text-[13px] ss:text-[16px]"
          >
            <button
              onClick={() => {
                setDeleteAllergyModal(item.allergy),
                  setScreen(true)
              }}
              className="h-8 hover:bg-gray-100 flex items-center gap-2 w-full px-3"
            >
              <Image
                src="/assets/delete.png"
                alt="edit"
                width={20}
                height={20}
                className="ss:w-[20px] w-[16px]"
              />
              Delete Allergy
            </button>
          </div>
        )}
      </div>
    );
  });

  return (
    <div className="w-full gap-4 flex flex-col">
      {renderedAllergies}
    </div>
  );
};

export default Allergies;
