/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from "react";
import Image from "next/image";

interface AllDosesProps {
  setAllDoses: Function;
  allDoses: boolean;
  dosesToRender: JSX.Element[];
}

type RefObject<T> = React.RefObject<T>;

const AllDoses: React.FC<AllDosesProps> = ({
  setAllDoses,
  allDoses,
  dosesToRender,
}) => {
  const dropdownRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent): void => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setAllDoses(false);
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

  useEffect(() => {
    const formElement = document.getElementById("top-allDoses");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [allDoses]);

  return (
    <div
      className={`${
        allDoses ? "w-full h-[100dvh]" : "w-0 h-0"
      } right-0 bg-none fixed z-[2]`}
    >
      <div
        ref={dropdownRef}
        className={`${
          allDoses ? "right-0 ss:w-[450px]" : "-right-[450px] ss:w-[450px] "
        } transition duration-300 absolute w-full bg-white h-full z-[4] `}
      >
        <div
          className={`h-full flex flex-col w-full p-8 pt-0 overflow-y-scroll bg-white`}
        >
          <div className="w-full flex justify-end mb-10">
            <Image
              src="/assets/x (1).png"
              width={18}
              height={18}
              alt="cancel"
              onClick={() => {
                setAllDoses(false);
              }}
              id="top-allDoses"
              className="cursor-pointer pt-8"
            />
          </div>
          <div className="mb-10">
            <h1 className="text-[24px] text-darkBlue font-bold leading-tight">
              Medications
            </h1>
            <p className="text-[16px] text-blackII leading-snug font-karla">
              Stay on track with the day&apos;s doses!
            </p>
          </div>
          <div className="flex flex-col gap-4">{dosesToRender}</div>
        </div>
      </div>
      <div
        onClick={() => {
          setAllDoses(false);
        }}
        className="absolute w-full h-full bg-blackII opacity-[40] z-[3]"
      />
    </div>
  );
};

export default AllDoses;
