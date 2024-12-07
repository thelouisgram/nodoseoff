import { motion } from "framer-motion";
import Calendar from "./features/Calendar";
import Summary from "./features/Summary";
import Tracker from "./features/tracker";
import Reports from "./features/Reports";

const Features = () => {
  return (
    <div id="features" className="bg-white py-24 font-Inter">
      <div
        className="container md:w-[1165px] lg:w-[1165px] mx-auto px-4 xs:px-1 ss:px-5 md:px-0 w-full grid ip:grid-cols-2 gap-8"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0}}
          viewport={{ once: true }}
          transition={{
            ease: "easeInOut",
            duration: 0.5,
          }}
          className="px-6 py-10 md:py-12 bg-[#EFF4F5] flex flex-col md:flex-row justify-between rounded-[16px] w-full gap-8"
        >
          <div className="flex flex-col text-grey md:w-[325px] gap-2 md:pt-14">
            <h2 className="font-bold leading-none text-[18px]">
              Medication Tracker Calendar
            </h2>
            <p className="text-[16px] leading-tight font-[500]">
              Monitor your meds with our interactive calendar and receive daily
              updates.
            </p>
          </div>
          <div className="relative w-full">
            <Calendar />
          </div>
        </motion.div>
         <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{
            ease: "easeInOut",
            duration: 0.5,
          }} 
        className="px-6 py-10 md:py-12 bg-lightBlue flex flex-col md:flex-row justify-between rounded-[16px] w-full gap-8">
          <div className="flex flex-col text-grey md:w-[325px] gap-2 md:pt-14">
            <h2 className="font-bold leading-none text-[18px]">
              Daily Medication Summary
            </h2>
            <p className="text-[16px] leading-tight font-[500]">
              Get detailed daily reports on your medication usage from the
              calendar.
            </p>
          </div>
          <div className="relative w-full">
            <Reports />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{
            ease: "easeInOut",
            duration: 0.5,
          }} 
        className="px-6 py-10 md:py-12 bg-lightPink flex flex-col md:flex-row justify-between rounded-[16px] w-full gap-8">
          <div className="flex flex-col text-grey md:w-[325px] gap-2 md:pt-14">
            <h2 className="font-bold leading-none text-[18px]">
              Daily Medication Tracker
            </h2>
            <p className="text-[16px] leading-tight font-[500]">
              Easily mark off today&apos;s taken meds and never miss a dose
            </p>
          </div>
          <div className="relative w-full h-full flex items-start justify-center">
            <Tracker />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{
            ease: "easeInOut",
            duration: 0.5,
          }} 
        className="px-6 py-10 md:py-12 bg-lightPurple flex flex-col md:flex-row justify-between rounded-[16px] w-full gap-8">
          <div className="flex flex-col text-grey md:w-[325px] gap-2 h-auto md:pt-14">
            <h2 className="font-bold leading-none text-[18px]">
              Access your Drug History Report
            </h2>
            <p className="text-[16px] leading-tight font-[500]">
              Share your drug history report with your physician easily.
            </p>
          </div>
          <Summary />
        </motion.div>
      </div>
    </div>
  );
};

export default Features;
