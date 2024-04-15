import React from "react";

const HeroText = () => {
  return (
    <div className="tracking-tighter relative text-[40px]  font-semibold h-[220px]">
      <div className="bg-lightPink px-8 py-3 rounded-[16px] text-darkPink  ">
        Monitor Your
      </div>
      <div className="bg-lightGreen px-8 py-3 rounded-[16px] text-darkGreen -rotate-[4deg] z-[4] absolute top-[72px] left-2">
        Medication
      </div>
      <div className="bg-lightPurple px-8 py-3 rounded-[16px] text-darkPurple rotate-[2deg] absolute top-[148px] left-10 md:left-2">
        Journey
      </div>
    </div>
  );
};

export default HeroText;
