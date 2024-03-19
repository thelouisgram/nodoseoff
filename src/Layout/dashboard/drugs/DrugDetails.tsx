import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import {
  formatDate,
  frequencyToPlaceholder,
} from "../../../../utils/dashboard";
import { calculateTimePeriod, convertedTimes } from "../../../../utils/drugs";

interface drugDetailsProps {
  displayDrugs: boolean;
  setDisplayDrugs: Function;
  tab: string;
}

interface detail {
  name: string;
  details: string;
}

const DrugDetails: React.FC<drugDetailsProps> = ({
  displayDrugs,
  setDisplayDrugs,
  tab,
}) => {
  const { drugs, completedDrugs, activeDrug } = useSelector(
    (state: RootState) => state.app
  );

  const drugsArray = tab === "Ongoing" ? drugs : completedDrugs;

  const drugDetails = drugsArray.find((drug) => drug.drug === activeDrug);

  if (!drugDetails) {
    return setDisplayDrugs(false);
  }

  const { drug, route, frequency, start, end, time, reminder } = drugDetails;

  const Duration = calculateTimePeriod(start, end);

  const Details = [
    {
      name: "Current Status",
      details: tab === "Ongoing" ? "Ongoing" : "Completed",
    },
    { name: "Route of Administration", details: route },
    { name: "Frequency", details: frequencyToPlaceholder[frequency] },
    { name: "Time", details: convertedTimes(time).join(", ") },
    { name: "Duration", details: Duration },
    { name: "Start Date", details: formatDate(start) },
    { name: "End Date", details: formatDate(end) },
    { name: "Reminder", details: reminder ? "Yes" : "No" },
  ];

  const RenderedDetails = Details.map((detail: detail, index: number) => {
    return (
      <div key={index} className="border rounded-md  p-5">
        <h2 className="text-[14px] font-bold ">{detail.name}</h2>
        <h3 className="text-[14px] ss:text-16px capitalize">
          {detail.details}
        </h3>
      </div>
    );
  });

  return (
    <div className="h-[100dvh] ss:pb-28 overflow-y-scroll w-full md:py-16 md:px-12 px-4 pt-10 pb-24 ss:p-10 text-navyBlue font-karla relative">
      <button
        onClick={() => {
          setDisplayDrugs(true);
        }}
        className="flex gap-3 items-center"
      >
        <Image src="/assets/back.png" alt="back" width={24} height={24} />
        <p className="font-semibold text-[18px]">Back</p>
      </button>

      <section className="mt-8 ">
        <h1 className="text-[28px] ss:text-[36px] font-semibold font-montserrant capitalize mb-[28px]">
          {drug}
        </h1>
        <div className="grid ss:grid-cols-2 gap-4">{RenderedDetails}</div>
      </section>
    </div>
  );
};

export default DrugDetails;