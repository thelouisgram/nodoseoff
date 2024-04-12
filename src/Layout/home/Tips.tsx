import React from "react";
import { tips } from "../../../utils/tips";
import Image from "next/image";

const Tips = () => {
  const renderedTips = tips.map((tip, index) => {
    return (
      <div
        key={index}
        style={{ backgroundColor: tip.bgColor, color: tip.textColor }}
        className={`py-7 px-4 ss:py-8 ss:px-6 rounded-xl`}
      >
        <Image src={tip.image} alt={tip.title} width="24" height="24" />
        <h1 className="font-bold text-[18px] my-3 leading-tight">
          {tip.title}
        </h1>
        <p className="text-grey text-[12px] ss:text-[13px]">{tip.desc}</p>
      </div>
    );
  });
  return (
    <div className="container md:w-[1165px] lg:w-[1165px] py-24 mx-auto px-4 md:px-0 w-full flex flex-col">
      <h2 className="text-[36px] w-[500px] mb-16 font-Poppins leading-tight">
        Tips for better health and sticking to your medications.
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {renderedTips}
      </div>
    </div>
  );
};

export default Tips;
