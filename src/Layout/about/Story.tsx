import React from "react";

const Story = () => {
  return (
    <div className="w-full h-auto bg-lightBlue relative pt-[80px]">
      <div
        className="container md:w-[1165px] lg:w-[1165px] mx-auto px-4 xs:px-1 ss:px-5 md:px-0 w-full h-auto gap-4 flex flex-col text-center md:py-6 font-Inter text-[18px]"
      >
        <h1 className="font-bold font-navyBlue text-[36px]">About NoDoseOff</h1>
        <p>
          This project began as a hack-a-thon challenge and evolved into a
          personal endeavor, selected by Adeyeye Adesanoye due to his medical
          background. He embarked on this project in November 2023 while in his
          fifth year of medical school and dedicated over six months to its
          development.
        </p>
        <p>
          Adesanoye worked with his medical friends to meticulously
          craft features aimed at ensuring precise drug monitoring and
          compliance. Their expertise and attention to detail were key in
          shaping the project into an effective tool for enhancing patient care
          and medication adherence.
        </p>
        <p>
          Through collaboration with other medical experts, the project aspires
          to serve both healthcare providers and patients by providing a
          reliable system for monitoring medication use. The features developed
          within the project strive to streamline drug management, ultimately
          aiming to improve health outcomes and patient safety.
        </p>
      </div>
    </div>
  );
};

export default Story;
