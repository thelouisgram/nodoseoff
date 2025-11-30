/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from "react";
import CopyableContent from "./CopyContent";
import { X } from "lucide-react";

interface ContactProps {
  setActiveModal: (value: string) => void;
  activeModal: string;
}

const Contact: React.FC<ContactProps> = ({ activeModal, setActiveModal }) => {
  

  const contactInfo = [{ label: "Email:", content: "nodoseoff@gmail.com" }];

  return (
    <div
      className={`${
        activeModal === "contact"
          ? "w-full min-h-[100dvh] h-full"
          : "w-0 h-0"
      } right-0 bg-none fixed z-[32] font-Inter`}
    >
      <div
        className={`${
          activeModal === "contact"
            ? "right-0 ss:w-[450px] h-full"
            : "-right-[450px] ss:w-[450px] h-full"
        } transition-all duration-300 absolute bg-white h-full w-full z-[4]`}
      >
        <div className="h-[100dvh] w-full bg-white p-8 overflow-y-scroll text-navyBlue text-[14px]">
          <div className="w-full flex justify-end mb-10">
            <button
              onClick={() => setActiveModal("")}
              className="cursor-pointer hover:opacity-70 transition-opacity"
            >
              <X className="size-6 text-gray-800" />
            </button>
          </div>
          <div className="mb-10">
            <h1 className="text-[24px] text-blue-700 font-bold">Contact Us</h1>
          </div>
          <div className="flex flex-col gap-4">
            {contactInfo.map((item, index) => (
              <div key={index}>
                <h2 className="font-semibold mb-1 text-grey">{item.label}</h2>
                <CopyableContent content={item.content} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;