import React from "react";
import Image from "next/image";

const Story = () => {
  return (
    <div className="w-full h-auto bg-lightBlue relative pt-[80px]  ">
      <h1 className="font-bold font-navyBlue text-[36px] text-center mb-6 md:mb-12">
        About NoDoseOff
      </h1>
      <div
        className="container md:w-[1165px] lg:w-[1165px] mx-auto px-4 xs:px-1 
        ss:px-5 md:px-0 flex flex-col sm:flex-row gap-10 md:gap-20 w-full"
      >
        <div className="md:w-1/2 h-auto gap-4 flex flex-col text-center md:text-left md:py-6 font-Inter text-[16px]">
          <p>
            What began as a hack-a-thon challenge quickly turned into a personal
            mission for me, fueled by my medical background. In November 2023,
            during my fifth year of medical school, I embarked on this project
            and dedicated over six months to its development.
          </p>
          <p>
            Collaborating with my friends, I focused on building features that
            ensure accurate drug monitoring and adherence. Our combined
            expertise and meticulous attention to detail were vital in
            transforming this idea into an effective tool for improving patient
            care and medication compliance.
          </p>
          <p>
            By working closely with other medical professionals, I aim to
            support both healthcare providers and patients with a reliable
            system for tracking medication use. The features we&lsquo;ve
            developed are designed to simplify drug management, ultimately
            enhancing health outcomes and ensuring patient safety.
          </p>
        </div>
        <div className="md:w-1/2">
          <Image
            width={1154}
            height={1519}
            alt="dev"
            className="w-full sm:w-1/2 md:w-full h-auto rounded-xl"
            src="/assets/dev.jpg"
          />
          <h3 className="text-center font-bold text-[24px] md:text-[30px] mt-4">
            Adeyeye Adesanoye
          </h3>
          <p className="text-center font-semibold text-[16px] md:text-[20px]">
            SoftWare Developer, Medical Doctor
          </p>
        </div>
      </div>
    </div>
  );
};

export default Story;
