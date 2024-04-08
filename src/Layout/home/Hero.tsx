import React from "react";
import Navbar from "./Navbar";
import HeroText from "./HeroText";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="w-full h-auto bg-lightBlue">
      <Navbar />
      <div className="container md:w-[1165px] lg:w-[1165px] mx-auto px-4 md:px-0 w-full h-[560px] flex">
        <div className="w-auto h-full flex flex-col justify-center gap-10 items-start py-12">
          <HeroText />
          <p className="w-[375px] font-Inter text-[18px]">
            Elevate Health with NoDoseOff: Monitor Dosage, Track Effectiveness,
            Enhance Health.
          </p>
          <Link
            href="/signup"
            className="hidden ss:flex px-12 py-3 bg-navyBlue rounded-[10px] font-semibold text-white"
          >
            Get Started
          </Link>
        </div>
        <div className="w-full h-full flex justify-end robot">
          <div className="flex h-full items-center relative">
            <Image
              width={4416}
              height={4392}
              src="/assets/hero/hero.png"
              alt="Hero Img"
              className=" h-[500px] w-auto"
              priority
            />
            <div className="absolute top-32 -left-20 bg-white rounded-[16px] py-3 pl-3 flex gap-3 items-center pr-10 shadow-sm">
              <div className="bg-lightPurple p-2 rounded-[10px]">
                <Image
                  src="/assets/hero/timer.png"
                  alt="timer"
                  width={256}
                  height={256}
                  className="w-6 h-6"
                />
              </div>
              <div className="flex flex-col justify-start h-full leading-none text-darkPurple">
                <h3 className="font-bold text-[14px]">Next dose in</h3>
                <p className="text-black font-bold text-[18px]">08:27:44</p>
              </div>
            </div>
            <div className="absolute top-60 -right-10 bg-white rounded-[16px] p-3 pr-5 flex gap-3 items-center shadow-sm">
              <div className="bg-lightBlue p-2 rounded-[10px]">
                <Image
                  src="/assets/hero/shield.png"
                  alt="shield"
                  width={256}
                  height={256}
                  className="w-6 h-6"
                />
              </div>
              <div className="flex flex-col justify-start h-full leading-none text-darkBlue">
                <h3 className="font-bold text-[14px]">Drug Compliance</h3>
                <p className="text-black font-bold text-[18px]">84%</p>
              </div>
            </div>
            <div className="absolute bottom-36 -left-20 bg-white rounded-[16px] py-3 pl-3 flex gap-3 items-center pr-6 shadow-sm">
              <div className="bg-lightGreen p-2 rounded-[10px]">
                <Image
                  src="/assets/hero/pill.png"
                  alt="pills"
                  width={256}
                  height={256}
                  className="w-6 h-6"
                />
              </div>
              <div className="flex flex-col justify-start h-full leading-none text-darkGreen">
                <h3 className="font-bold text-[14px]">Number of Drugs</h3>
                <p className="text-black font-bold text-[18px]">06</p>
              </div>
            </div>
            <div className="absolute bottom-5 left-36 bg-white rounded-[16px] py-3 pl-3 flex gap-3 items-center pr-6 shadow-sm">
              <div className="bg-lightPink p-2 rounded-[10px]">
                <Image
                  src="/assets/hero/warning.png"
                  alt="pills"
                  width={256}
                  height={256}
                  className="w-6 h-6"
                />
              </div>
              <div className="flex flex-col justify-start h-full leading-none text-darkPink">
                <h3 className="font-bold text-[14px]">
                  Number of Missed Doses
                </h3>
                <p className="text-black font-bold text-[18px]">13</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
