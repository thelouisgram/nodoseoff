/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import CopyableContent from "./CopyContent";
import { X } from "lucide-react";

interface ContactProps {
  setActiveModal: (value: string) => void;
  activeModal: string;
}

const Contact: React.FC<ContactProps> = ({ activeModal, setActiveModal }) => {
  const contactInfo = [{ label: "Email:", content: "nodoseoff@gmail.com" }];

  const handleClose = () => {
    setActiveModal("");
  };

  if (activeModal !== "contact") return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-[100] transition-opacity duration-300"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          activeModal === "contact" ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 w-full ss:w-[450px] bg-white h-full`}
      >
        <div className="h-full w-full bg-white p-8 pt-0 overflow-y-scroll text-navyBlue text-[14px]">
          <div className="w-full flex justify-end mb-10">
            <button
              onClick={handleClose}
              className="cursor-pointer pt-8 hover:opacity-70 transition-opacity"
            >
              <X className="size-6 text-gray-800" />
            </button>
          </div>
          <div className="mb-10">
            <h1 className="text-[24px] text-blue-600 font-bold">Contact Us</h1>
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