import React, { useState } from "react";
import Navbar from "./Navbar";
import HeroText from "./HeroText";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  const [nav, setNav] = useState(false);

  return (
    <div className="w-full h-auto bg-lightBlue relative">
      <Navbar nav={nav} setNav={setNav} />
      <div className="container md:w-[1165px] lg:w-[1165px] mx-auto px-4 xs:px-1 ss:px-5 md:px-0 w-full h-auto md:h-[625px] flex flex-col md:flex-row">
        <div className="w-auto h-full flex flex-col justify-center gap-7 items-center md:items-start py-12">
          <HeroText />
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
            <div
              className="absolute top-16 ss:top-32 -left-4 ss:-left-20 bg-white rounded-[8px] ss:rounded-[16px] p-2 ss:py-3 ss:pl-3 flex gap-2 ss:gap-3 
              items-center ss:pr-10 shadow-sm"
            >
              <div className="bg-lightPurple p-1 ss:p-2 rounded-[5px] ss:rounded-[10px]">
                <Image
                  src="/assets/hero/timer.png"
                  alt="timer"
                  width={256}
                  height={256}
                  className="ss:w-6 ss:h-6 w-4 h-4"
                />
              </div>
              <div className="flex flex-col justify-start h-full leading-tight text-darkPurple">
                <h3 className="font-bold text-[12px] ss:text-[14px]">
                  Next dose in
                </h3>
                <p className="text-black font-bold text-[14px] ss:text-[18px]">
                  08:27:44
                </p>
              </div>
            </div>
            <div
              className="absolute top-36 ss:top-60 -right-6 md:-right-10 bg-white rounded-[8px] ss:rounded-[16px] p-2 ss:p-3 ss:pr-5 flex gap-2 
            ss:gap-3 items-center shadow-sm"
            >
              <div className="bg-lightBlue p-1 ss:p-2 rounded-[5px] ss:rounded-[10px]">
                <Image
                  src="/assets/hero/shield.png"
                  alt="shield"
                  width={256}
                  height={256}
                  className="ss:w-6 ss:h-6 w-4 h-4"
                />
              </div>
              <div className="flex flex-col justify-start h-full leading-tight text-darkBlue">
                <h3 className="font-bold text-[12px] ss:text-[14px]">
                  Drug Compliance
                </h3>
                <p className="text-black font-bold text-[14px] ss:text-[18px]">
                  84%
                </p>
              </div>
            </div>
            <div
              className="absolute bottom-16 md:bottom-48 -left-6 md:-left-20 bg-white rounded-[8px] ss:rounded-[16px] p-2 ss:py-3 ss:pl-3 flex 
            gap-2 ss:gap-3 items-center ss:pr-6 shadow-sm"
            >
              <div className="bg-lightGreen p-1 ss:p-2 rounded-[5px] ss:rounded-[10px]">
                <Image
                  src="/assets/hero/pill.png"
                  alt="pills"
                  width={256}
                  height={256}
                  className="ss:w-6 ss:h-6 w-4 h-4"
                />
              </div>
              <div className="flex flex-col justify-start h-full leading-tight text-darkGreen">
                <h3 className="font-bold text-[12px] ss:text-[14px]">
                  Number of Drugs
                </h3>
                <p className="text-black font-bold text-[14px] ss:text-[18px]">
                  06
                </p>
              </div>
            </div>
            <div className="absolute -bottom-4 md:bottom-14 left-24 ss:left-40 bg-white rounded-[8px] ss:rounded-[16px] p-2 ss:py-3 ss:pl-3 flex gap-2 ss:gap-3 items-center pr-6 shadow-sm">
              <div className="bg-lightPink p-1 ss:p-2 rounded-[5px] ss:rounded-[10px]">
                <Image
                  src="/assets/hero/warning.png"
                  alt="pills"
                  width={256}
                  height={256}
                  className="ss:w-6 ss:h-6 w-4 h-4"
                />
              </div>
              <div className="flex flex-col justify-start h-full leading-tight text-darkPink">
                <h3 className="font-bold text-[12px] ss:text-[14px]">
                  Missed Doses
                </h3>
                <p className="text-black font-bold text-[14px] ss:text-[18px]">
                  13
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`w-full ${nav ? "opacity-100 z-10" : "opacity-0 -z-10"} transitions-all 
            duration-300 p-6 fixed flex-col flex gap-3 h-[100dvh] bg-white top-0 left-0`}
      >
        <div className="w-full flex justify-end mb-10 p-2">
          <button onClick={() => setNav(false)}>
            <Image
              src="/assets/x (1).png"
              alt="cancel"
              width={24}
              height={24}
            />
          </button>
        </div>
        <Link
          href="/login"
          className="px-5 py-3 border-navyBlue border rounded-[10px] text-center bg-transparent font-semibold text-navyBlue"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="px-5 py-3 bg-navyBlue rounded-[8px] text-center font-semibold text-white"
        >
          Create new account
        </Link>
      </div>
    </div>
  );
};

export default Hero;
