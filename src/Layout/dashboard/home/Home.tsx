/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import DailyReports from "./DailyReports";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { calculateClosestDoseCountdown } from "../../../../utils/dashboard";
import { updateActive } from "../../../../store/stateSlice";
import Tracker from "./Tracker";

interface HomeProps {
  setEffectsForm: Function;
  setDrugsForm: Function;
  isLoading: boolean;
  setAllDoses: Function;
  setTracker: Function;
  tracker: string;
  dosesToRender: JSX.Element[];
}

const Home: React.FC<HomeProps> = ({
  setDrugsForm,
  isLoading,
  setAllDoses,
  setTracker,
  tracker,
  dosesToRender,
}) => {
  const { drugs, info, schedule, userId } = useSelector(
    (state: RootState) => state.app
  );

  const dispatch = useDispatch();
  const [displayIndex, setDisplayIndex] = useState(0);

  const [countDown, setCountDown] = useState("");

  const { name } = info[0];

  useEffect(() => {
    // Function to calculate the countdown
    const calculateAndSetCountdown = () => {
      const newCountdown = calculateClosestDoseCountdown(schedule);
      setCountDown(newCountdown);
    };

    // Initial countdown calculation and process schedule
    calculateAndSetCountdown();

    // Set interval to update countdown every second
    const intervalId = setInterval(calculateAndSetCountdown, 1000);

    // Clear interval on unmount or when 'schedule' changes
    return () => clearInterval(intervalId);
  }, [drugs, isLoading]);

  const displayedDoses = dosesToRender?.slice(displayIndex, displayIndex + 4);

  const currentTime = new Date(); // Get the current date and time

  const completedBeforeCurrentTime = schedule.filter((dose) => {
    const doseDateTime = new Date(`${dose?.date}T${dose?.time}`);
    return doseDateTime <= currentTime && dose?.completed;
  });

  const totalBeforeCurrentTime = schedule.filter((dose) => {
    const doseDateTime = new Date(`${dose?.date}T${dose?.time}`);
    return doseDateTime <= currentTime;
  });

  let percentageCompleted = 0;

  if (totalBeforeCurrentTime.length > 0) {
    percentageCompleted = Math.round(
      (completedBeforeCurrentTime.length / totalBeforeCurrentTime.length) * 100
    );
  }

  const CDNURL =
    "https://opshqmqagtfidynwftzk.supabase.co/storage/v1/object/public/profile-picture/";

  return (
    <div className="w-full h-[100dvh] overflow-y-scroll md:py-16 md:px-12 pt-10 pb-24 ss:py-10 text-navyBlue font-karla relative">
      <div className="mb-[28px] px-4 ss:px-8 md:px-0 w-full flex justify-between items-center">
        <div>
          <h1 className="text-[24px] ss:text-[32px] font-semibold font-karla capitalize">
            {"Hi " + name?.split(" ")[0]},
          </h1>
          <p className="text-[16px] text-grey">Your health matters!</p>
        </div>
        <div
          onClick={() => {
            dispatch(updateActive("Account"));
          }}
          className="w-[60px] h-[60px] rounded-full overflow-hidden cursor-pointer"
        >
          <Image
            src={CDNURL + userId + "/avatar.png" || "/assets/user.png"}
            width={100}
            height={100}
            alt="user"
            quality={100}
            className="w-[60px] h-[60px] object-cover"
            priority
          />
        </div>
      </div>
      <div className="w-full flex justify-between items-center px-4 ss:px-8 md:px-0">
        <button
          onClick={() => {
            setDrugsForm(true);
          }}
          className="mb-3 w-[160px] cursor-pointer h-[40px] bg-navyBlue rounded-[6px] flex justify-center items-center 
          font-bold text-white"
        >
          + ADD DRUG
        </button>
      </div>
      <section className="md:w-full flex gap-4 ss:gap-5 mb-8 ss:mb-12 overflow-x-scroll md:overflow-hidden px-4 ss:px-8 md:px-0 bar">
        <div className="min-w-[300px] ss:w-full h-[120px] ss:h-[150px] bg-[#A755F7] rounded-[10px]  flex justify-start items-center p-4 gap-2">
          <Image
            src="/assets/sandclock.png"
            alt="clock"
            width={512}
            height={512}
            quality={100}
            className="w-[50px] h-[50px]"
          />
          <div className="flex flex-col text-white justify-center w-full items-start gap-1">
            <h2 className="leading-none font-semibold text-[14px]">
              Next dose in
            </h2>
            <h4 className="font-bold text-[28px] tracking-wider leading-none">
              {countDown || "00:00:00"}
            </h4>
          </div>
        </div>
        <div className="min-w-[300px] ss:w-full h-[120px] ss:h-[150px] bg-grey rounded-[10px]  flex justify-start items-center p-4 gap-2">
          <Image
            src="/assets/pills.png"
            alt="drugs"
            width={100}
            height={100}
            className="w-[50px] h-[50px]"
          />
          <div className="flex flex-col text-white justify-center w-full items-start gap-1">
            <h2 className="leading-none font-semibold text-[14px]">
              Ongoing Drugs
            </h2>
            <h4 className="font-bold text-[28px] tracking-wider leading-none">
              {countDown ? drugs.length : '0'}
            </h4>
          </div>
        </div>
        <div className="min-w-[300px] ss:w-full h-[120px] ss:h-[150px] bg-[#3B82F6] rounded-[10px]  flex justify-start items-center py-4 pl-4 gap-2">
          <Image
            src="/assets/shield.png"
            alt="shield"
            width={100}
            height={100}
            quality={100}
            className="w-[50px] h-[50px]"
          />
          <div className="flex flex-col text-white justify-center w-full items-start gap-1">
            <h2 className="leading-none font-semibold text-[14px]">
              Drug Compliance
            </h2>
            <h4 className="font-bold text-[28px] tracking-wider leading-none">
              {percentageCompleted}%
            </h4>
          </div>
        </div>
      </section>
      <Tracker
        tracker={tracker}
        setAllDoses={setAllDoses}
        displayedDoses={displayedDoses}
        setTracker={setTracker}
      />
      <h3 className="text-[18px] font-semibold text-navyBlue mb-3 px-4 ss:px-8 md:px-0">
        Daily Reports
      </h3>
      <DailyReports />
    </div>
  );
};

export default Home;
