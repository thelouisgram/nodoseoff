import React from "react";
import { tips } from "../../../../utils/tips";
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
        <p className="text-blackII text-[12px] ss:text-[13px]">{tip.desc}</p>
      </div>
    );
  });

  return (
    <div className="w-full h-[100dvh] overflow-y-scroll md:py-16 md:px-12 px-4 ss:px-10 pt-10 pb-24 text-navyBlue font-karla relative">
      <div className="mb-[28px]">
        <h1 className="text-[24px] ss:text-[32px] font-semibold font-montserrant capitalize">
          Drug Safety Tips
        </h1>
        <p className="text-[16px] text-[#718096]">
          Stay safe with your medications!
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {renderedTips}
      </div>
    </div>
  );
};

export default Tips;
