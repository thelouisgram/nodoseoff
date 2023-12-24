import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

interface EffectsProps {
  screen: boolean;
  setScreen: Function;
  setEffectsForm: Function;
}

type Drug = {
  id: string;
  drug: string;
  date: string;
  time: string;
};

const Effects: React.FC<EffectsProps> = ({
  screen,
  setEffectsForm,
  setScreen,
}) => {
  const { effects } = useSelector((state: RootState) => state.app);

  const totalEffects = effects.map((effect: any, index: number) => {
    return (
      <div
        key={index}
        className="py-4 px-4 border flex flex-wrap gap-3 ss:justify-between border-gray-300 rounded-md rounded-bl-none w-full"
      >
        <div className="flex gap-1">
          <h2 className="font-semibold">Effect:</h2>
          <h2 className="capitalize">{effect.effect}</h2>
        </div>
        <div className="flex gap-1">
          <h2 className="font-semibold">Severity:</h2>
          <h2 className="capitalize">{effect.severity}</h2>
        </div>
        <div className="flex gap-1">
          <h2 className="font-semibold">Date:</h2>
          <h2>{effect.date}</h2>
        </div>
      </div>
    );
  });

  return (
    <div className="h-[100dvh] overflow-y-scroll w-full md:py-16 md:px-12 px-4 pt-10  pb-24 ss:p-10 text-navyBlue font-karla relative">
      <div className="mb-[28px]">
        <h1 className="text-[24px] ss:text-[32px] font-semibold font-montserrant ">
          Adverse Effects
        </h1>
        <p className="text-[16px] text-[#718096]">
          Be mindful of side effects for better health!
        </p>
      </div>
      <button
        onClick={() => {
          setEffectsForm(true);
        }}
        className="mb-6 w-[160px] cursor-pointer h-[40px] bg-navyBlue rounded-[10px] rounded-bl-none flex justify-center items-center 
          font-bold text-white"
      >
        + ADD EFFECTS
      </button>
      {effects.length > 0 ? (
        <div className="w-full grid md:grid-cols-2 gap-5">{totalEffects} </div>
      ) : (
        <div className="w-full h-[400px] flex justify-center items-center">
          {" "}
          <h1 className="text-[20px] text-navyBlue font-semibold font-montserrant text-center opacity-30">
            Yay! No side effects!
          </h1>
        </div>
      )}
    </div>
  );
};

export default Effects;
