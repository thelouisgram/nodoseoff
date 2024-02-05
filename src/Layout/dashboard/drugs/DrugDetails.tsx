import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import Image from "next/image";
import { formatDate, frequencyToPlaceholder } from "../../../../utils/dashboard";
import { calculateTimePeriod } from "../../../../utils/drugs";

interface drugDetailsProps{
     displayDrugs: boolean
    setDisplayDrugs: Function
}

interface detail {
    name: string;
    details: string;
}

const DrugDetails: React.FC<drugDetailsProps> = ({
  displayDrugs,
  setDisplayDrugs,
}) => {
  const { drugs, activeDrug } = useSelector((state: RootState) => state.app);

  const drugDetails = drugs.find((drug) => drug.drug === activeDrug);
  const { drug, route, frequency, start, end, time, reminder } = drugDetails;
  const Duration = calculateTimePeriod(start, end);


  const Details = [
    { name: "Route of Administration", details: route },
    { name: "Frequency", details: frequencyToPlaceholder[frequency] },
    { name: "Time", details: time },
    { name: "Duration", details: Duration },
    { name: "Start Date", details: formatDate(start) },
    { name: "End Date", details: formatDate(end) },
    { name: "Reminder", details: reminder ? "Yes" : "No" },
  ];

  const RenderedDetails = Details.map((detail: detail, index: number) => {
    return(
        <div key={index}>
            <h2 className="font-semibold text-[16px]">{detail.name}</h2>
            <h3 className="capitalize">{detail.details}</h3>
        </div>
    )
  })

  return (
    <div className="max-h-[100dvh] px-6 text-navyBlue font-montserrant">
      <button
        onClick={() => {
          setDisplayDrugs(true);
        }}
        className="flex gap-3"
      >
        <Image src="/assets/back.png" alt="back" width={24} height={24} />
        <p className="font-[500]">Drugs</p>
      </button>

      <section className="mt-8 ">
        <h1 className="text-[24px] ss:text-[32px] font-semibold font-montserrant capitalize mb-[28px]">
          {drug}
        </h1>
        <div className="flex flex-col gap-4">{RenderedDetails}</div>
      </section>
    </div>
  );
};

export default DrugDetails;
