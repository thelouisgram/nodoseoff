import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import Image from "next/image";

const Account = () => {
  const { drugs, name, effects, schedule, email, phoneNumber } = useSelector(
    (state: RootState) => state.app
  );

  const currentTime = new Date(); // Get the current date and time

  const completedBeforeCurrentTime = schedule.filter((dose) => {
    const doseDateTime = new Date(`${dose.date}T${dose.time}`);
    return doseDateTime <= currentTime && dose.completed;
  });

  const totalBeforeCurrentTime = schedule.filter((dose) => {
    const doseDateTime = new Date(`${dose.date}T${dose.time}`);
    return doseDateTime <= currentTime;
  });

  const missedDoses =
    totalBeforeCurrentTime.length - completedBeforeCurrentTime.length;

  let percentageCompleted = 0;

  if (totalBeforeCurrentTime.length > 0) {
    percentageCompleted =
      (completedBeforeCurrentTime.length / totalBeforeCurrentTime.length) * 100;
  }

  return (
    <div className="h-[100dvh] overflow-y-scroll w-full md:py-16 md:px-12 px-4 pt-10  pb-24 ss:p-10 text-navyBlue font-karla relative">
      <div className="mb-[28px]">
        <h1 className="text-[24px] ss:text-[32px] font-semibold font-montserrant ">
          Your Account
        </h1>
      </div>
      <div className="w-full items-center flex flex-col  mb-8">
        <Image
          src="/assets/icons8-user-100.png"
          width={100}
          height={100}
          alt="user"
          quality={100}
        />
        <h1 className="text-[32px] font-semibold font-montserrant text-center">
          {name}
        </h1>
      </div>
      <h2 className="text-[18px] font-semibold text-navyBlue mb-3">
        Personal Information
      </h2>
      <div className="w-full grid ss:grid-cols-2 gap-4 mb-10">
        <div className="w-full border border-gray-300 rounded-lg rounded-bl-none py-4 px-4 flex gap-2">
          <h2 className="font-semibold">Email:</h2>
          <p>{email}</p>
        </div>
        <div className="w-full border border-gray-300 rounded-lg rounded-bl-none py-4 px-4 flex gap-2">
          <h2 className="font-semibold">Phone Number:</h2>
          <p>{phoneNumber}</p>
        </div>
      </div>
      <h2 className="text-[18px] font-semibold text-navyBlue mb-3">
        Statistics
      </h2>
      <div className="w-full grid ss:grid-cols-2 gap-4">
        <div className="w-full border border-gray-300 rounded-lg rounded-bl-none py-4 px-4 flex gap-2">
          <h2 className="font-semibold">Number of Drugs:</h2>
          <p>{drugs.length}</p>
        </div>
        <div className="w-full border border-gray-300 rounded-lg rounded-bl-none py-4 px-4 flex gap-2">
          <h2 className="font-semibold">Number of side effects:</h2>
          <p>{effects.length}</p>
        </div>
        <div className="w-full border border-gray-300 rounded-lg rounded-bl-none py-4 px-4 flex gap-2">
          <h2 className="font-semibold">Drug compliance:</h2>
          <p>{percentageCompleted.toFixed(1)}%</p>
        </div>
        <div className="w-full border border-gray-300 rounded-lg rounded-bl-none py-4 px-4 flex gap-2">
          <h2 className="font-semibold">Missed Doses:</h2>
          <p>{missedDoses}</p>
        </div>
      </div>
    </div>
  );
};

export default Account;
