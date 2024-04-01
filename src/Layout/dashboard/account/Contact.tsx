/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import CopyableContent from "./CopyContent";

interface ContactProps {
  setShowContact: Function;
  showContact: boolean;
}

type RefObject<T> = React.RefObject<T>;

const Contact: React.FC<ContactProps> = ({ showContact, setShowContact }) => {
  const dropdownRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent): void => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowContact(false);
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

  const contactInfo = [
    { label: "Email:", content: "nodoseoff@gmail.com" },
    { label: "Phone Number:", content: "+234 814 650 2181" },
  ];

  return (
    <div
      className={`${
        showContact ? "w-full min-h-[100dvh] h-full" : "w-0 h-0"
      } right-0 bg-none fixed z-[32] font-Inter`}
    >
      <div
        ref={dropdownRef}
        className={`${
          showContact
            ? "right-0 ss:w-[450px] h-full"
            : "-right-[450px] ss:w-[450px] h-full"
        } transition-all duration-300 absolute  bg-white h-full w-full z-[4] `}
      >
        <div
          className={` h-[100dvh] w-full bg-white p-8 overflow-y-scroll text-navyBlue text-[14px]`}
        >
          <div className="w-full flex justify-end mb-10">
            <Image
              src="/assets/x (1).png"
              width={18}
              height={18}
              alt="cancel"
              onClick={() => {
                setShowContact(false);
              }}
              className="cursor-pointer"
            />
          </div>
          <div className="mb-10">
            <h1 className="text-[24px] text-darkBlue font-bold">Contact Us</h1>
          </div>
          <div className="flex flex-col gap-4">
            {contactInfo.map((item, index) => (
              <div key={index}>
                <h2 className="font-semibold mb-1 text-blackII">
                  {item.label}
                </h2>
                <CopyableContent content={item.content} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        onClick={() => {
          setShowContact(false);
        }}
        className="absolute w-full h-full bg-blackII opacity-[40] z-[3]"
      />
    </div>
  );
};

export default Contact;
