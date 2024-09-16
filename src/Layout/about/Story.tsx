import React from "react";
import Image from "next/image";

const Story = () => {
  return (
    <div className="w-full h-auto bg-lightBlue relative pt-[80px]  ">
      <h1 className="font-bold font-navyBlue text-[36px] text-center mb-12">About NoDoseOff</h1>
      <div
        className="container md:w-[1165px] lg:w-[1165px] mx-auto px-4 xs:px-1 
        ss:px-5 md:px-0 flex flex-col sm:flex-row gap-10 md:gap-20 w-full"
      >
        <div className="h-auto gap-4 flex flex-col text-left md:py-6 font-Inter text-[16px]">
          <p>
            What started as a hack-a-thon challenge turned into a personal
            mission for Adeyeye Adesanoye, inspired by his medical background.
            In November 2023, during his fifth year of medical school, Adeyeye
            took on this project and poured over six months of effort into its
            development.
          </p>
          <p>
            Collaborating with his friends, Adeyeye focused on creating features
            that ensure accurate drug monitoring and adherence. Their combined
            expertise and careful attention to detail were crucial in
            transforming this project into an effective tool for improving
            patient care and medication compliance.
          </p>
          <p>
            By working with other medical professionals, the project aims to
            support both healthcare providers and patients with a dependable
            system for tracking medication use. The features developed strive to
            make drug management easier, ultimately aiming to enhance health
            outcomes and ensure patient safety.
          </p>
        </div>
        <div className="md:w-[800px]">
        <Image
          width={1154}
          height={1519}
          alt='dev'
          className="w-full sm:w-1/2 md:w-full h-auto"
          src='/assets/dev.JPG'
        />
        <h3 className="text-center font-bold text-[24px] mt-4">Adeyeye Adesanoye</h3>
        <p className="text-center font-semibold text-[16px]">SoftWare Developer, Final Year Medical student</p>
        </div>
      </div>
    </div>
  );
};

export default Story;
