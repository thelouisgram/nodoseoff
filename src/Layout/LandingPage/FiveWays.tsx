/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { appFeatures} from './../../../utils/landingpage'
import Image from "next/image";

const FiveWays = () => {
  const [active, setActive] = useState(0);
  let timeoutId: NodeJS.Timeout | undefined;
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = (index: number) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setIsHovered(true);
    setActive(index);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);

    if (!isHovered) {
      clearTimeout(timeoutId); // Clear the existing timeout if it exists
      timeoutId = setTimeout(() => {
        setActive((prevActive) => (prevActive + 1) % appFeatures.length);
      }, 3000);
    }
  };

  // Initial timeout when not hovered
  useEffect(() => {
    if (!isHovered) {
      timeoutId = setTimeout(() => {
        setActive((prevActive) => (prevActive + 1) % appFeatures.length);
      }, 3000);
    }
  }, [active, isHovered]);

  // Don't forget to clear timeout on component unmount or dependencies change
  useEffect(() => {
    return () => {
      clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  const features = appFeatures.map((item, index) => (
    <div
      key={index}
      className={`w-full h-[350px] ss:h-[450px] rounded-[15px] p-[30px] pr-[10px] transition-all cursor-pointer relative ${
        active === index ? `bg-darkBlue text-white` : "bg-white text-navyBlue"
      }`}
      onMouseEnter={() => handleHover(index)}
      onMouseLeave={handleMouseLeave}
    >
      <h2 className="text-[24px] ss:text-[32px] font-bold mb-4 leading-none">
        {item.feature}
      </h2>
      <p className="ss:w-[350px] text-[15px] ss:text-[18px]">
        {item.description}
      </p>
      <Image
        src={item.img}
        width={500}
        height={500}
        quality={100}
        alt={item.feature}
        className={`absolute  right-0 bottom-0 ${
          active === index ? "w-1/2" : "w-0"
        } transitions-all duration-500 h-auto`}
      />
    </div>
  ));

  return (
    <div className="bg-[#F2F7F8] w-full h-full">
      <div className="container w-[1100px] mx-auto py-[50px] ss:py-[100px] px-4 md:px-0">
        <div className="w-full grid md:grid-cols-2 gap-8">
          <div className='h-full justify-center items-center flex p-3'>
            <h1 className="ss:w-[550px] text-[28px] ss:text-[40px] font-bold leading-tight text-center text-navyBlue">
              5 ways to improve your drug compliance
            </h1>
          </div>
          {features}
        </div>
      </div>
    </div>
  );
};

export default FiveWays;
