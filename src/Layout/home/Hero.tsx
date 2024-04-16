import React from "react";
import Header from "./Hero/Header";
import Link from "next/link";
import Image from "next/image";
import { links, scrollToSection } from "../../../utils/landingpage";
import NextDose from "./Hero/NextDose";
import Compliance from "./Hero/Compliance";
import NumberOfDrugs from "./Hero/NumberOfDrugs";
import MissedDoses from "./Hero/MissedDoses";
import MobileNavBar from "./MobileNavBar";

interface navProps {
  nav: boolean;
  setNav: Function;
}

const Hero: React.FC<navProps> = ({ nav, setNav }) => {
  const renderedLinks = links?.map((link, index) => (
    <button
      onClick={() => {
        setNav(false);
        scrollToSection(link.id);
      }}
      key={index}
    >
      {link.title}
    </button>
  ));

  return (
    <div id="home" className="w-full h-auto bg-lightBlue relative pt-[80px]">
      <div className="container md:w-[1165px] lg:w-[1165px] mx-auto px-4 xs:px-1 ss:px-5 md:px-0 w-full h-auto md:h-[625px] flex flex-col md:flex-row">
        <div className="w-auto h-full flex flex-col justify-center gap-7 items-center md:items-start py-12">
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
        <div className="w-full h-full flex justify-end pb-10 md:pb-0 px-8 xs:px-6 ss:px-20 md:px-0">
          <div className="flex h-full items-center relative robot">
            <Image
              width={4416}
              height={4392}
              src="/assets/hero/hero.png"
              alt="Hero Img"
              className="w-full h-auto md:h-[500px] md:w-auto"
              priority
            />
            <NextDose />
            <Compliance />
            <NumberOfDrugs />
            <MissedDoses />
          </div>
        </div>
      </div>
      <MobileNavBar nav={nav} setNav={setNav} renderedLinks={renderedLinks} />
    </div>
  );
};

export default Hero;
