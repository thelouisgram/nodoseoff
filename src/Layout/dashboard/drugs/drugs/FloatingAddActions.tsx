import React, { useEffect } from "react";
import { ShieldOff, Pill, X } from "lucide-react";

interface FloatingAddActionsProps {
  add: boolean;
  setAdd: React.Dispatch<React.SetStateAction<boolean>>;
  activeForm: string;
  setScreen: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveForm: (value: string) => void;
}

const FloatingAddActions: React.FC<FloatingAddActionsProps> = ({
  add,
  setAdd,
  activeForm,
  setScreen,
  setActiveForm,
}) => {
  return (
    <div className={`fixed ${add && "z-[144]"} font-karla`}>
      <button
        onClick={() => {
          setAdd(false);
          setActiveForm("drugs");
          setScreen(false);
        }}
        title="Add Drug"
        className={`bg-white py-2 aspect-square  ${
          !add
            ? "right-4 ss:right-10 bottom-20 md:bottom-6"
            : "bottom-[214px] md:bottom-[168px] right-4 ss:right-10"
        } transition-all duration-450 fixed rounded-full  size-14 font-semibold justify-center flex gap-2 
                  ss:gap-3 items-center`}
      >
        <Pill className="size-8 text-navyBlue" strokeWidth={1.5} />
      </button>
      <button
        onClick={() => {
          setAdd(false);
          setActiveForm("allergies");
          setScreen(false);
        }}
        title="Add Allergies"
        className={`bg-white py-2 aspect-square  ${
          !add
            ? "right-4 ss:right-10 bottom-20 md:bottom-6"
            : "bottom-[148px] md:bottom-24 right-4 ss:right-10"
        } fixed rounded-full font-semibold justify-center transition-all duration-450 size-14
                  flex gap-2 ss:gap-3 items-center `}
      >
        <ShieldOff className="size-8 text-navyBlue" strokeWidth={1.5} />
      </button>
      <button
        onClick={() => {
          setScreen((prev: boolean) => !prev);
          setAdd((prev: boolean) => !prev);
        }}
        className={`fixed rounded-full size-14 flex justify-center items-center bg-navyBlue right-4 ss:right-10 
                 bottom-20 md:bottom-6 z-[146] ${
                   activeForm !== "" ? "hidden" : "flex"
                 }`}
      >
        <X
          className={`${
            add ? "rotate-180" : "rotate-45"
          } transform transition-transform duration-300 size-8 text-white`}
        />
      </button>
    </div>
  );
};

export default FloatingAddActions;
