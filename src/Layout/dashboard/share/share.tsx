import React from "react";
import ImageWithText from "./ImageWithText";

const Share = () => {
  return (
    <div className="w-full h-[100dvh] overflow-y-scroll md:py-16 md:px-12 pt-10 pb-24 text-navyBlue font-karla relative">
      <div className="mb-[28px] px-4 ss:px-8 md:px-0">
        <h1 className="text-[24px] ss:text-[32px] font-semibold font-montserrant ">
          Share Reports
        </h1>
        <p className="text-[16px] text-[#718096]">Share your Drug History with your Physician!</p>
      </div>
      <ImageWithText />
    </div>
  );
};

export default Share;
