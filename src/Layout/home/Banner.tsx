import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

const Banner = () => {
  return (
    <div className="bg-navyBlue py-16 font-Inter h-full">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          ease: "easeInOut",
          duration: 0.5,
        }}
        className="container md:w-[1165px] lg:w-[1165px] mx-auto px-4 xs:px-1 ss:px-5 md:px-0 w-full h-full flex flex-col gap-5 text-center justify-center items-center"
      >
        <h1 className="font-[500] text-[20px] text-white md:w-[450px]">
          Your Path to Wellness: Medication Made Simple!
        </h1>
        <Link
          href="/signup"
          className="px-10 py-3 bg-white rounded-md text-navyBlue font-[500]"
        >
          Join now!
        </Link>
      </motion.div>
    </div>
  );
};

export default Banner;
