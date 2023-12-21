import React, { useState, useRef, useEffect } from "react";
import { formatDate } from "../../../../utils/dashboard";
import Image from "next/image";

interface DrugProps {
  drug: string;
  end: string;
  frequency: string;
  reminder: boolean;
  route: string;
  start: string;
  time: string[];
}

interface thisProps {
  drug: DrugProps;
  frequencyToPlaceholder: { [key: string]: string };
  setScreen: Function;
  setEditForm: Function;
  setModal: Function;
  setActiveDrug: Function;
  finalDurationText: string;
}

type RefObject<T> = React.RefObject<T>;

const RenderedDrugs: React.FC<thisProps> = ({
  drug,
  frequencyToPlaceholder,
  finalDurationText,
  setActiveDrug,
  setEditForm,
  setModal,
  setScreen,
}) => {
  const [options, setOptions] = useState(false);
  const dropdownRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
   const handleClickOutside = (event: MouseEvent): void => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOptions(false);
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

  return (
    <div className="relative rounded-lg rounded-bl-none bg-lightBlue p-5 pb-8 flex flex-col gap-2 font-Inter text-[14px]">
      <h1 className="uppercase text-[24px] text-center font-montserrant font-bold">
        {drug.drug}
      </h1>
      <div className="flex gap-2 w-full items-center">
        <h2 className="font-semibold">Route of Admin: </h2>
        <p className="capitalize">{drug.route}</p>
      </div>
      <div className="flex gap-2 w-full items-center">
        <h2 className="font-semibold">Frequency: </h2>
        <p>{frequencyToPlaceholder[drug.frequency]}</p>
      </div>
      <div className="flex gap-2 w-full items-center flex-wrap">
        <h2 className="font-semibold">Dosage Time: </h2>
        <p>{drug.time.join(", ")}</p>
      </div>
      <div className="flex gap-2 items-center">
        <h2 className="font-semibold">Start: </h2>
        <p>{formatDate(drug.start)}</p>
      </div>
      <div className="flex gap-2 items-center">
        <h2 className="font-semibold">End: </h2>
        <p>{formatDate(drug.end)}</p>
      </div>
      <div className="flex gap-2 w-full items-center">
        <h2 className="font-semibold">Duration: </h2>
        <p>{finalDurationText}</p>
      </div>
      <div className="flex gap-2 w-full items-center">
        <h2 className="font-semibold">Reminder: </h2>
        <p>{drug.reminder ? "Yes" : "No"}</p>
      </div>

      <button
        onClick={() => {
          setOptions((prev) => !prev);
        }}
        className="absolute top-6 right-3 flex flex-col gap-1 cursor-pointer w-7 h-7 justify-center items-center rounded-full"
      >
        <div className="w-[3px] h-[3px] rounded-full bg-black" />
        <div className="w-[3px] h-[3px] rounded-full bg-black" />
        <div className="w-[3px] h-[3px] rounded-full bg-black" />
      </button>
      {options && (
        <div
          ref={dropdownRef}
          className="absolute right-3 top-10 text-[#062863] flex flex-col items-start justify-center mt-3 rounded-[10px] 
        bg-white shadow-md w-[200px] py-3"
        >
          <button
            onClick={() => {
              setActiveDrug(drug.drug), setEditForm(true);
            }}
            className="h-8 hover:bg-gray-100 flex items-center gap-2 w-full px-3"
          >
            <Image src="/assets/edit.png" alt="edit" width={18} height={18} />
            Edit Drug
          </button>
          <button
            onClick={() => {
              setActiveDrug(drug.drug), setModal(true), setScreen(true);
            }}
            className="h-8 hover:bg-gray-100 flex items-center gap-2 w-full px-3"
          >
            <Image src="/assets/delete.png" alt="edit" width={18} height={18} />
            Delete Drug
          </button>
        </div>
      )}
    </div>
  );
};

export default RenderedDrugs;
