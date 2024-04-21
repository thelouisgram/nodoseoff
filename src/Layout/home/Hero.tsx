import React from "react";
import Header from "./Hero/Header";
import Link from "next/link";
import Image from "next/image";
import NextDose from "./Hero/NextDose";
import Compliance from "./Hero/Compliance";
import NumberOfDrugs from "./Hero/NumberOfDrugs";
import MissedDoses from "./Hero/MissedDoses";

interface navProps {
  nav: boolean;
  setNav: Function;
}

const Hero: React.FC<navProps> = ({ nav, setNav }) => {
 
  return (
    <div id="home" className="w-full h-auto bg-lightBlue relative pb-8 pt-[112px]">
      <div className="container md:w-[1165px] lg:w-[1165px] mx-auto px-4 xs:px-1 ss:px-5 md:px-0 w-full h-auto md:h-[625px] flex flex-col md:flex-row gap-10 md:gap-20">
        <div className="md:w-1/2 h-full flex flex-col justify-center gap-7 items-center md:items-start py-12">
          <Header />
          <p className="w-full ss:w-[425px] text-center md:text-left font-Inter text-[16px]">
            Boost Your Health with NoDoseOff: Our Accurate Medication Tracker.
            Monitor Dosage, Track Effectiveness, Enhance Health.
          </p>
          <Link
            href="/signup"
            className="hidden ss:flex px-12 py-3 bg-navyBlue rounded-[10px] font-semibold text-white"
          >
            Get Started
          </Link>
        </div>
        <div className="md:w-1/2 h-full flex justify-end pb-10 md:pb-0 px-8 xs:px-6 ss:px-20 md:p-0">
          <div className="flex w-full h-full items-center relative robot">
            <Image
              width={4416}
              height={4392}
              src="/assets/hero/hero.jpg"
              alt="Hero Img"
              className="w-full h-auto border-[12px] border-white shadow-2xl rounded-[48px]"
              priority
            />
            <NextDose />
            <Compliance />
            <NumberOfDrugs />
            <MissedDoses />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
