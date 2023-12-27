import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";

const Allergies = () => {
  const { allergies } = useSelector((state: RootState) => state.app);
  const renderedAllergies = allergies.map((item: any, index: number) => {
    return <div key={index} className="p-5 bg-lightBlue text-navyBlue rounded-[10px] rounded-bl-none capitalize">{index+1}. {item?.allergy}</div>;
  });

  return <div className="w-full gap-4 grid ss:grid-cols-2 md:grid-cols-3">{renderedAllergies}</div>;
};

export default Allergies;
