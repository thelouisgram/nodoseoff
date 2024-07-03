import React from "react";
import Image from 'next/image'

const Hero = () => {
  return (
    <div className="w-full h-auto bg-lightBlue relative pb-8 pt-[112px]">
      <div className="container md:w-[1165px] lg:w-[1165px] mx-auto px-4 xs:px-1 ss:px-5 md:px-0 w-full h-auto md:h-[625px] gap-6 
      ss:gap-12 flex flex-col sm:flex-row md:py-6 items-center">
        <div className="sm:w-1/2 h-full flex flex-col justify-center gap-7 items-center md:items-start py-12">
          <h1 className="text-blue-700 font-bold text-[28px] font-Poppins">
            Our Vision and Values
          </h1>
          <h3 className="md:text-[48px] text-[36px] text-center md:text-left font-bold w-full font-Poppins leading-snug">
            Supporting Long-Term and Daily Drug Users for Medication Adherence
          </h3>
        </div>
        <div className="sm:w-1/2 md:py-8 h-full flex items-center justify-end">
            <Image src='/assets/about/pills.jpg' width='4912' height='4912' alt='hero-img' className='w-auto h-full rounded-3xl border-[12px] border-white shadow-[48px]' />
        </div>
      </div>
    </div>
  );
};

export default Hero;
