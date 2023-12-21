import React from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";

const Hero = () => {
  return (
    <div className="bg-[#F2F7F8] w-full  h-auto">
      <div className="container w-[1100px] mx-auto px-4 md:px-0">
        <Navbar />
        <HeroSection />
      </div>
    </div>
  );
};

export default Hero;
