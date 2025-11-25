import React from "react";
import Image from "next/image";
import { FaCheck } from "react-icons/fa";
import { toast } from "sonner";
import { ScheduleItem } from "../../types/dashboard";
import { AppDispatch } from "../../store";
import { updateSchedule } from "../../store/stateSlice";
import { uploadScheduleToServer } from "../../utils/dashboard/schedule";

interface DoseListProps {
  schedule: ScheduleItem[];
  tracker: "Today" | "Yesterday";
  dispatch: AppDispatch;
  userId: string;
}

const DoseList: React.FC<DoseListProps> = ({ schedule, tracker, dispatch, userId }) => {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 86400000);
  const formattedToday = today.toISOString().split("T")[0];
  const formattedYesterday = yesterday.toISOString().split("T")[0];

  const doses = schedule
    ?.filter((dose) => {
      const targetDate = tracker === "Today" ? formattedToday : formattedYesterday;
      return dose.date === targetDate;
    })
    ?.sort((a, b) => {
      if (a.time < b.time) return -1;
      if (a.time > b.time) return 1;
      return 0;
    });

  const updateCompleted = async (item: ScheduleItem) => {
    try {
      const updatedSchedule = schedule.map((dose) =>
        dose.date === item.date && dose.time === item.time && dose.drug === item.drug
          ? { ...dose, completed: !dose.completed }
          : dose
      );

      dispatch(updateSchedule(updatedSchedule));
      await uploadScheduleToServer({ userId, schedule: updatedSchedule });
    } catch (error) {
      toast.error("An error occurred! Check Internet connection");
      const previousSchedule = schedule.map((dose) =>
        dose.date === item.date && dose.time === item.time && dose.drug === item.drug
          ? { ...dose, completed: !dose.completed }
          : dose
      );
      dispatch(updateSchedule(previousSchedule));
    }
  };

  return (
    <>
      {doses?.map((item, index) => {
        const [hourString, minutes] = item.time.split(":");
        let hour = parseInt(hourString);
        const timeSuffix = hour < 12 ? "AM" : "PM";
        if (hour > 12) hour -= 12;
        const formattedTime = `${hour}:${minutes}${timeSuffix}`;

        return (
          <div
            key={index}
            className="p-5 md:p-4 border border-gray-300 rounded-[10px] items-center flex justify-between bg-white w-full font-Inter text-[14px]"
          >
            <div className="flex gap-3 text-navyBlue items-center">
              <Image
                src="/assets/shell.png"
                width={512}
                height={512}
                alt="pill"
                className="w-10 h-10"
              />
              <div className="flex flex-col gap-0 items-start">
                <p className="capitalize font-semibold w-[125px] ss:w-auto">{item.drug}</p>
                <p>{formattedTime}</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <h2 className="font-karla">Taken:</h2>
              <button
                className={`${
                  item.completed ? "bg-navyBlue text-white" : "bg-none text-white"
                } border-[1px] border-navyBlue px-1 py-1 rounded-full`}
                onClick={() => updateCompleted(item)}
              >
                <FaCheck className="text-[12px]" />
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default DoseList;
