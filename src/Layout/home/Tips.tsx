import React from "react";
import { tips } from "../../../utils/tips";
import Image from "next/image";
import { motion } from "framer-motion";

const Tips = () => {
  const renderedTips = tips.map((tip, index) => {
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.15, duration: 0.3 }}
        style={{ backgroundColor: tip.bgColor, color: tip.textColor }}
        className={`py-7 px-4 ss:py-8 ss:px-6 rounded-xl`}
        viewport={{once: true}}
      >
          <Image src={tip.image} alt={tip.title} width="24" height="24" />
          <h1 className="font-bold text-[18px] my-3 leading-tight">
            {tip.title}
          </h1>
          <p className="text-grey text-[12px] ss:text-[13px]">{tip.desc}</p>
      </motion.div>
    );
  });
  return (
    <div
      id="tips"
      className="container md:w-[1165px] lg:w-[1165px] py-24 mx-auto px-4 xs:px-1 ss:px-5 md:px-0 w-full flex flex-col"
    >
      <h2 className="text-[24px] md:text-[36px] md:w-[500px] mb-16 font-Poppins leading-tight">
        Tips for better health and sticking to your medications.
      </h2>
      <div
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        {renderedTips}
      </div>
    </div>
  );
};

export default Tips;
