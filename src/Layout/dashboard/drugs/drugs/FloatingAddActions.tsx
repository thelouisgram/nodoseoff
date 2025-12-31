import React from "react";
import { ShieldOff, Pill, X } from "lucide-react";

interface FloatingAddActionsProps {
  add: boolean;
  setAdd: React.Dispatch<React.SetStateAction<boolean>>;
  activeModal: string;
  setActiveModal: (value: string) => void;
}

const FloatingAddActions: React.FC<FloatingAddActionsProps> = ({
  add,
  setAdd,
  activeModal,
  setActiveModal,
}) => {
  const handleClose = () => {
    setAdd(false);
  };

  if (activeModal !== "") return null;

  return (
    <>
      {/* Overlay */}
      {add && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[143] transition-opacity duration-300"
          onClick={handleClose}
        />
      )}

      {/* Floating Actions */}
      <div className={`fixed ${add && "z-[144]"}`}>
        {/* Add Drug Button */}
        <button
          onClick={() => {
            setAdd(false);
            setActiveModal("drugs");
          }}
          title="Add Drug"
          className={`bg-white shadow-xl ${
            !add
              ? "right-4 ss:right-10 bottom-20 md:bottom-6 opacity-0 pointer-events-none scale-75"
              : "bottom-[222px] md:bottom-[168px] right-5 ss:right-10 opacity-100 scale-100"
          } transition-all duration-300 fixed rounded-full size-12 ss:size-14 
            flex justify-center items-center hover:scale-110 hover:shadow-2xl active:scale-95
            border border-gray-100`}
        >
          <Pill className="size-6 ss:size-7 text-blue-600" strokeWidth={2} />
        </button>

        {/* Add Allergies Button */}
        <button
          onClick={() => {
            setAdd(false);
            setActiveModal("allergies");
          }}
          title="Add Allergies"
          className={`bg-white shadow-xl ${
            !add
              ? "right-4 ss:right-10 bottom-20 md:bottom-6 opacity-0 pointer-events-none scale-75"
              : "bottom-[156px] md:bottom-24 right-5 ss:right-10 opacity-100 scale-100"
          } transition-all duration-300 fixed rounded-full size-12 ss:size-14
            flex justify-center items-center hover:scale-110 hover:shadow-2xl active:scale-95
            border border-gray-100`}
          style={{ transitionDelay: add ? "50ms" : "0ms" }}
        >
          <ShieldOff
            className="size-6 ss:size-7 text-amber-500"
            strokeWidth={2}
          />
        </button>

        {/* Main Toggle Button */}
        <button
          onClick={() => {
            setAdd((prev: boolean) => !prev);
          }}
          className={`fixed rounded-full size-12 ss:size-14 flex justify-center items-center 
            shadow-xl right-5 ss:right-10 bottom-24 md:bottom-6 z-[146] 
            hover:scale-110 active:scale-95 transition-all duration-300 ${
              add
                ? "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                : "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            }`}
        >
          <X
            className={`${
              add ? "rotate-0" : "rotate-45"
            } transform transition-transform duration-300 size-6 ss:size-8 text-white`}
            strokeWidth={2}
          />
        </button>
      </div>
    </>
  );
};

export default FloatingAddActions;