/* eslint-disable react-hooks/exhaustive-deps */
"use-client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { dose } from "../../../utils/dashboard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { setDrugs } from "../../../store/stateSlice";
import { Drug } from "../../../types";
import { generateSchedule } from "../../../utils/dashboard";
import { updateSchedule } from "../../../store/stateSlice";
import supabase from "../../../utils/supabaseClient";
import {
  uploadScheduleToServer,
  removeActiveDrugFromSchedule,
} from "../../../utils/schedule";

interface DrugFormProps {
  editForm: boolean;
  setEditForm: Function;
}

const EditForm: React.FC<DrugFormProps> = ({ editForm, setEditForm }) => {
  const { drugs, activeDrug, schedule, userId } = useSelector(
    (state: RootState) => state.app
  );
  const dispatch = useDispatch();

  const currentDrug = drugs.find((drug: any) => drug.drug === activeDrug);

  const [formData, setFormData] = useState({
    drug: "",
    frequency: "",
    route: "",
    start: new Date().toISOString().substr(0, 10),
    end: "",
    time: [],
    reminder: false,
  });

  const [formErrors, setFormErrors] = useState({
    drug: "",
    frequency: "",
    route: "",
    start: "",
    end: "",
    time: "",
  });

  useEffect(() => {
    if (currentDrug) {
      setFormData({
        drug: currentDrug.drug || "",
        frequency: currentDrug.frequency || "",
        route: currentDrug.route || "",
        start: currentDrug.start || new Date().toISOString().substr(0, 10),
        end: currentDrug.end || "",
        time: currentDrug.time || [],
        reminder: currentDrug.reminder || false,
      });
    }
  }, [currentDrug]);

  useEffect(() => {
    let defaultTimeValues: any = [];

    const selectedDose: any = dose?.find(
      (item) => item.frequency === formData.frequency
    );

    if (selectedDose) {
      defaultTimeValues = selectedDose.time || [];
      setFormData({
        ...formData,
        time: defaultTimeValues,
      });
    }
  }, [formData.frequency]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const isChecked = e.target.checked;
      setFormData({
        ...formData,
        [name]: isChecked,
      });
    } else if (name.startsWith("time-")) {
      const timeIndex = Number(name.split("-")[1]);
      const updatedTime: any = [...formData.time];
      updatedTime[timeIndex] = value;

      setFormData({
        ...formData,
        time: updatedTime,
      });

      setFormErrors({
        ...formErrors,
        time: updatedTime.some((time: any) => !time)
          ? "Please fill in all time fields."
          : "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });

      setFormErrors({
        ...formErrors,
        [name]: value ? "" : `Please fill in the ${name} field.`,
      });
    }
  };

  const timeInput = formData.time.map((item: any, index: number) => {
    return (
      <div key={index} className="bg-[#EDF2F7] pr-4 rounded-md h-[56px]">
        <input
          key={index}
          type="time"
          id={`time-${index}`}
          name={`time-${index}`}
          value={formData.time[index]}
          onChange={handleInputChange}
          className="border bg-[#EDF2F7] border-none outline-none text-navyBlue rounded-md p-4 h-[56px]"
        />
      </div>
    );
  });

  const handleSelectChange =
    (fieldName: string) => (e: ChangeEvent<HTMLSelectElement>) => {
      const { value } = e.target;
      setFormData({ ...formData, [fieldName]: value });
    };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors: any = {
      name: formData.drug ? "" : "Please fill in the Name of drug field.",
      frequency: formData.frequency ? "" : "Please select a Frequency.",
      route: formData.route ? "" : "Please select a Route.",
      start: formData.start ? "" : "Please select a Start Date.",
      end: formData.end ? "" : "Please select an End Date.",
    };

    const errorValues = Object.values(errors);

    if (errorValues.some((err) => err !== "")) {
      Object.keys(errors).forEach((field) => {
        if (errors[field]) {
          toast.error(errors[field]);
        }
      });
      return;
    }

    try {
      // Update the drug data
      const updatedDrugs = drugs.map((drug: any) => {
        if (drug.drug === activeDrug) {
          return {
            drug: formData.drug,
            frequency: formData.frequency,
            route: formData.route,
            start: formData.start,
            end: formData.end,
            time: formData.time,
            reminder: formData.reminder,
          };
        }
        return drug;
      });

      dispatch(setDrugs(updatedDrugs));

      // Remove active drug from schedule
      const strippedSchedule = removeActiveDrugFromSchedule({
        activeDrug,
        schedule,
      });
      const data = generateSchedule(formData);
      const updatedSchedule = [...strippedSchedule, ...data];
      dispatch(updateSchedule([...updatedSchedule]));
      uploadScheduleToServer({
        userId: userId,
        schedule: updatedSchedule, // Pass the updated schedule to the function
      });

      // Update drug on the server
      const { error: drugUpdateError } = await supabase
        .from("drugs")
        .update({
          // Update drug information here
          userId: userId,
          drug: formData.drug,
          frequency: formData.frequency,
          route: formData.route,
          start: formData.start,
          end: formData.end,
          time: formData.time,
          reminder: formData.reminder,
        })
        .eq("drug", activeDrug);

      if (drugUpdateError) {
        toast.error("Failed to update drug on the server");
        return;
      }
      toast.success(
        `'${formData.drug.toUpperCase()}' has been updated successfully`
      );
      setEditForm(false);
      setFormErrors({
        drug: "",
        frequency: "",
        route: "",
        start: "",
        end: "",
        time: "",
      });
    } catch (error) {
      console.error("Error updating data on the server:", error);
      toast.error("An error occurred while updating data on the server");
    }
  };

  return (
    <div
      className={` ${
        editForm ? "w-full min-h-[100dvh] h-full" : "w-0 h-0"
      } left-0 bg-none fixed z-[2]`}
    >
      <div
        className={` ${
          editForm
            ? "left-0 ss:w-[450px] h-full"
            : "-left-[450px] ss:w-[450px] h-full"
        } transition-all duration-300 absolute w-full bg-white h-full z-[4] `}
      >
        <div
          className={` h-[100dvh] w-full bg-white p-8 overflow-y-scroll app`}
        >
          <div className="w-full flex justify-end mb-10">
            <Image
              src="/assets/x (1).png"
              width={24}
              height={24}
              alt="cancel"
              onClick={() => {
                setEditForm(false);
              }}
              className="cursor-pointer"
            />
          </div>
          <div className="mb-10">
            <h1 className="text-[24px] text-darkBlue font-bold">Edit Drug</h1>
            <p className="text-[14px] text-[#718096]">
              To ensure adequate tracking of drug compliance.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="h-auto flex flex-col justify-between"
          >
            <div className="flex flex-col mb-4">
              <label
                htmlFor="drug"
                className="text-[14px] mb-1 font-semibold text-navyBlue"
              >
                Name of drug (e.g Rifampicin)
              </label>
              <input
                type="text"
                id="drug"
                name="drug"
                value={formData.drug}
                onChange={handleInputChange}
                className="border bg-[#EDF2F7] border-none outline-none rounded-md p-4 mb-4 capitalize h-[56px]"
                placeholder="Name of Drug"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label
                htmlFor="frequency"
                className="text-[14px] mb-1 font-semibold text-navyBlue"
              >
                Routes of Administration
              </label>
              <div className="bg-[#EDF2F7] outline-none rounded-md w-full px-4 mb-4 h-[56px]">
                <select
                  id="route"
                  name="route"
                  value={formData.route}
                  onChange={handleSelectChange("route")}
                  className=" bg-[#EDF2F7] border-none w-full outline-none py-4 text-navyBlue cursor-pointer h-[56px]"
                >
                  <option value="">Select Route</option>
                  <option value="oral">Oral</option>
                  <option value="topical">Topical</option>
                  <option value="intravenous">intravenous</option>
                  <option value="intramuscular">intramuscular</option>
                  <option value="inhalation">Inhalation</option>
                  <option value="rectal">Rectal</option>
                  <option value="sublingual">Sublingual</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col mb-4">
              <label
                htmlFor="frequency"
                className="text-[14px] mb-1 font-semibold text-navyBlue"
              >
                Frequency
              </label>
              <div className="bg-[#EDF2F7] outline-none rounded-md w-full px-4 mb-4 h-[56px]">
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleSelectChange("frequency")}
                  className=" bg-[#EDF2F7] border-none w-full outline-none py-4 text-navyBlue cursor-pointer h-[56px]"
                >
                  <option value="">Select Frequency</option>
                  <option value="QD">Once Daily</option>
                  <option value="BID">Twice Daily</option>
                  <option value="TID">Thrice Daily</option>
                  <option value="QID">Four Times Daily</option>
                  <option value="EOD">Every Other Day</option>
                  <option value="W">Weekly</option>
                  <option value="BW">Biweekly</option>
                  <option value="M">Monthly</option>
                </select>
              </div>
            </div>
            {formData.frequency && (
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="start"
                  className="text-[14px] mb-1 font-semibold text-navyBlue"
                >
                  Select Time
                </label>
                <div className="w-full grid grid-cols-2 gap-4 mb-4">
                  {timeInput}
                </div>
              </div>
            )}
            <div className="flex flex-col w-full">
              <label
                htmlFor="end"
                className="text-[14px] mb-1 font-semibold text-navyBlue"
              >
                Select Start Date
              </label>
              <div className="w-full bg-[#EDF2F7] pr-4 mb-8 pb-0 rounded-md h-[56px]">
                <input
                  type="date"
                  id="start"
                  name="start"
                  value={formData.start}
                  onChange={handleInputChange}
                  className="border bg-[#EDF2F7] border-none outline-none w-full text-navyBlue rounded-md py-4 pl-4 h-[56px]"
                />
              </div>
              <div className="flex flex-col mb-8 w-full">
                <label
                  htmlFor="end"
                  className="text-[14px] mb-1 font-semibold text-navyBlue"
                >
                  Select End Date
                </label>
                <div className="w-full bg-[#EDF2F7] pr-4 pb-0 rounded-md h-[56px]">
                  <input
                    type="date"
                    id="end"
                    name="end"
                    value={formData.end}
                    onChange={handleInputChange}
                    className="border bg-[#EDF2F7] border-none outline-none w-full text-navyBlue rounded-md py-4 pl-4 h-[56px]"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="reminder"
                name="reminder"
                checked={formData.reminder}
                onChange={handleInputChange}
                className="w-5 h-5 outline-none"
              />
              <label
                htmlFor="reminder"
                className="text-[14px] font-semibold text-navyBlue"
              >
                Add Reminder
              </label>
            </div>
            <button
              type="submit"
              className="mt-20 font-semibold bg-darkBlue text-white rounded-[10px] w-full text-center py-4 rounded-bl-none px-4 
              hover:bg-navyBlue transition duration-300"
            >
              PROCEED
            </button>
          </form>
        </div>
      </div>
      <div
        onClick={() => {
          setEditForm(false);
        }}
        className="absolute w-full h-full bg-blackII opacity-[40] z-[3]"
      />
    </div>
  );
};

export default EditForm;
