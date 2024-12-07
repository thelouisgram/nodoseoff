import React from "react";
import { steps } from "../../../utils/landingpage";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const Steps = () => {
  const renderedSteps = steps.map((step, index) => {
    return (
      <motion.div
        key={index}
        className="flex flex-col w-full"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.15, duration: 0.4 }}
      >
        <div className="flex gap-4 text-[20px] w-full">
          <h2>0{index + 1}</h2>
          <div className="flex flex-col w-full gap-2">
            <h2>{step.title}</h2>
            <p className="text-[14px]">{step.desc}</p>
          </div>
        </div>
        <div
          className={`${
            index === 3 ? "hidden" : ""
          } h-[1px] w-full bg-gray-300 mt-4`}
        />
      </motion.div>
    );
  });

  return (
    <div id="steps" className="bg-lightBlue py-24 font-Inter h-full">
      <div className="container md:w-[1165px] lg:w-[1165px] mx-auto px-4 xs:px-1 ss:px-5 md:px-0 w-full  h-full ">
        <h2 className="md:w-1/2 text-[24px] md:text-[36px] mb-12 font-Poppins leading-tight">
          Achieving Complete Adherence to Medication
        </h2>
        <div
          className="w-full grid ss:grid-cols-2 items-center
        gap-16"
        >
          <div className="flex flex-col gap-6">{renderedSteps}</div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{
              ease: "easeInOut",
              duration: 1,
            }}
            className="w-full h-full flex items-center justify-end"
          >
            <div className="h-[550px] md:w-[400px] rounded-[16px] overflow-hidden relative flex justify-center">
              <Image
                src="/assets/steps-image.jpg"
                alt="woman"
                width="8495"
                priority
                height={5663}
                className="w-full h-full object-cover"
              />
              <Link
                href="/signup"
                className="px-12 py-3 font-semibold absolute bottom-10 bg-white z-10 text-navyBlue rounded-[10px] text-[18px]"
              >
                Sign up
              </Link>
              <div className="absolute bottom-0 left-0 right-0 z-4 h-[75%] bg-gradient-to-b from-transparent to-black" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Steps;
