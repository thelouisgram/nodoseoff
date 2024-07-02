import React from "react";

const Story = () => {
  return (
    <div className="w-full h-auto bg-lightBlue relative pt-[80px]  ">
      <div
        className="container md:w-[1165px] lg:w-[1165px] mx-auto px-4 xs:px-1 
        ss:px-5 md:px-0 flex flex-col md:flex-row gap-10 w-full"
      >
        <div className=" w-full h-auto gap-4 flex flex-col text-left md:py-6 font-Inter text-[18px]">
          <h1 className="font-bold font-navyBlue text-[36px]">
            About NoDoseOff
          </h1>
          <p>
            What started as a hack-a-thon challenge turned into a personal
            mission for Adeyeye Adesanoye, inspired by his medical background.
            In November 2023, during his fifth year of medical school, Adeyeye
            took on this project and poured over six months of effort into its
            development.
          </p>
          <p>
            Collaborating with his friends, Adeyeye focused
            on creating features that ensure accurate drug monitoring and
            adherence. Their combined expertise and careful attention to detail
            were crucial in transforming this project into an effective tool for
            improving patient care and medication compliance.
          </p>
          <p>
            By working with other medical professionals, the project aims to
            support both healthcare providers and patients with a dependable
            system for tracking medication use. The features developed strive to
            make drug management easier, ultimately aiming to enhance health
            outcomes and ensure patient safety.
          </p>
        </div>
        <video
          width={720}
          height={846}
          controls
          className="w-full md:w-[500px] h-auto"
        >
          <source
            src="/assets/video.mp4"
            type="video/mp4"
            className="w-[300px] h-auto"
          />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default Story;
