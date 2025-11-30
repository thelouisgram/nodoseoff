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
          className="fixed inset-0 bg-black bg-opacity-50 z-[143] transition-opacity duration-300"
          onClick={handleClose}
        />
      )}

      {/* Floating Actions */}
      <div className={`fixed ${add && "z-[144]"} font-karla`}>
        <button
          onClick={() => {
            setAdd(false);
            setActiveModal("drugs");
          }}
          title="Add Drug"
          className={`bg-white py-2 aspect-square shadow-lg ${
            !add
              ? "right-4 ss:right-10 bottom-20 md:bottom-6 opacity-0 pointer-events-none"
              : "bottom-[214px] md:bottom-[168px] right-4 ss:right-10 opacity-100"
          } transition-all duration-450 fixed rounded-full size-12 ss:size-14 font-semibold justify-center flex gap-2 
                  ss:gap-3 items-center hover:scale-110`}
        >
          <Pill className="size-6 ss:size-8 text-blue-600" strokeWidth={1.5} />
        </button>

        <button
          onClick={() => {
            setAdd(false);
            setActiveModal("allergies");
          }}
          title="Add Allergies"
          className={`bg-white py-2 aspect-square shadow-lg ${
            !add
              ? "right-4 ss:right-10 bottom-20 md:bottom-6 opacity-0 pointer-events-none"
              : "bottom-[148px] md:bottom-24 right-4 ss:right-10 opacity-100"
          } fixed rounded-full font-semibold justify-center transition-all duration-450 size-12 ss:size-14
                  flex gap-2 ss:gap-3 items-center hover:scale-110`}
        >
          <ShieldOff
            className="size-6 ss:size-8 text-yellow-500"
            strokeWidth={1.5}
          />
        </button>

        <button
          onClick={() => {
            setAdd((prev: boolean) => !prev);
          }}
          className={`fixed rounded-full size-12 ss:size-14 flex justify-center items-center ${
            add ? "bg-red-600" : "bg-blue-600"
          } right-4 ss:right-10 shadow-lg
                 bottom-20 md:bottom-6 z-[146] hover:scale-110 transition-all`}
        >
          <X
            className={`${
              add ? "rotate-180" : "rotate-45"
            } transform transition-transform duration-300 size-6 ss:size-8 text-white`}
            strokeWidth={2}
          />
        </button>
      </div>
    </>
  );
};

export default FloatingAddActions;