/* eslint-disable react-hooks/exhaustive-deps */
"use-client";
import Image from "next/image";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "../../../../store";
import { setDrugs, updateSchedule } from "../../../../store/stateSlice";
import { dose, generateSchedule } from "../../../../utils/dashboard";
import {
  removePastDoses,
  uploadScheduleToServer,
} from "../../../../utils/schedule";
import supabase from "../../../../utils/supabase";

interface DrugFormProps {
  editForm: boolean;
  setEditForm: Function;
}

interface SelectedDoseTypes {
  frequency: string;
  times: number;
  time: string[];
}

interface FormErrors {
  [key: string]: string;
}

const EditForm: React.FC<DrugFormProps> = ({ editForm, setEditForm }) => {
  const { drugs, activeDrug, schedule, userId, activeDrugId } = useSelector(
    (state: RootState) => state.app
  );
  const dispatch = useDispatch();

  const currentDrug = drugs.find((drug) => drug.drug === activeDrug);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    drug: "",
    frequency: "",
    route: "",
    start: new Date().toISOString().substr(0, 10),
    end: "",
    time: [""],
    reminder: false,
    drugId: "",
  });

  const [formErrors, setFormErrors] = useState({
    drug: "",
    frequency: "",
    route: "",
    start: "",
    end: "",
    time: "",
  });

  // Function to get today's date in the format "YYYY-MM-DD"
  function getCurrentDate(): string {
    const today: Date = new Date();
    const year: number = today.getFullYear();
    let month: string | number = today.getMonth() + 1;
    let day: string | number = today.getDate();

    // Pad single digit month and day with leading zero
    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }

    return `${year}-${month}-${day}`;
  }

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
        drugId: currentDrug.drugId || "",
      });
    }
  }, [currentDrug]);

  useEffect(() => {
    const formElement = document.getElementById("top-edit");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [editForm]);

  useEffect(() => {
    let defaultTimeValues: string[] = [];

    const selectedDose: SelectedDoseTypes | undefined = dose?.find(
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
      const updatedTime: string[] = [...formData.time];
      updatedTime[timeIndex] = value;

      setFormData({
        ...formData,
        time: updatedTime,
      });

      setFormErrors({
        ...formErrors,
        time: updatedTime.some((time: string) => !time)
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

  const timeInput = formData.time.map((item: string, index: number) => {
    return (
      <div key={index} className="bg-[#EDF2F7] rounded-[10px] h-[56px] w-full">
        <input
          key={index}
          type="time"
          id={`time-${index}`}
          name={`time-${index}`}
          value={formData.time[index]}
          onChange={handleInputChange}
          className="border bg-[#EDF2F7] border-none outline-none text-grey rounded-[10px] p-4 w-full h-[56px]"
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
    setLoading(true);

    const errors: FormErrors = {
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
      const updatedDrugs = drugs.map((drug) => {
        if (drug.drug === activeDrug) {
          return {
            drug: formData.drug,
            frequency: formData.frequency,
            route: formData.route,
            start: formData.start,
            end: formData.end,
            time: formData.time,
            reminder: formData.reminder,
            drugId: formData.drugId,
          };
        }
        return drug;
      });

      dispatch(setDrugs(updatedDrugs));

      // Remove active drug from schedule
      const strippedSchedule = removePastDoses({
        activeDrugId,
        schedule,
      });
      // Generate schedule with current date as startDate
      const data = generateSchedule({
        ...formData,
        start: getCurrentDate(), // Use current date as startDate
      });
      const updatedSchedule = [...strippedSchedule, ...data];

      // Update Redux state with the new schedule
      dispatch(updateSchedule([...updatedSchedule]));

      // Upload the updated schedule to the server
      await uploadScheduleToServer({
        userId: userId,
        schedule: updatedSchedule,
      });

      // Update drug information on the server
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
        toast.error(
          "An error occurred, Check Internet Connection and Try again"
        );
        setLoading(false);
        return;
      }

      // Hide loading toast and show success toast
      toast.success(`${formData.drug.toUpperCase()}  updated successfully`);
      setLoading(false);
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
      toast.error("An error occurred, Check Internet Connection and Try again");
      setLoading(false);
    }
  };

  return (
    <div
      className={` ${
        editForm ? "w-full" : "w-0"
      } left-0 bg-none fixed z-[2]  h-[100dvh]`}
    >
      <div
        className={` ${
          editForm ? "left-0 ss:w-[450px]" : "-left-[450px] ss:w-[450px] "
        } transition-all duration-300 absolute w-full bg-white h-full z-[4] `}
      >
        <div
          className={`h-full flex flex-col w-full justify-between gap-8 p-8 pt-0 overflow-y-scroll bg-white`}
        >
          <div className="w-full bg-white">
            <div className="w-full flex justify-end mb-10">
              <Image
                src="/assets/x (1).png"
                width={18}
                height={18}
                alt="cancel"
                onClick={() => {
                  setEditForm(false);
                }}
                id="top-edit"
                className="cursor-pointer pt-8"
              />
            </div>
            <h1 className="text-[24px] text-blue-700 font-bold">Edit Drug</h1>
            <p className="text-[14px] text-grey">
              To ensure adequate tracking of drug compliance.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="h-auto flex flex-col justify-between"
          >
            <div className="flex flex-col mb-8">
              <label
                htmlFor="drugEdit"
                className="text-[14px] mb-1 font-semibold text-navyBlue"
              >
                Name of drug (e.g Rifampicin)
              </label>
              <input
                disabled={true}
                type="text"
                id="drugEdit"
                name="drug"
                value={formData.drug}
                onChange={handleInputChange}
                className="border bg-[#EDF2F7] border-none outline-none text-grey rounded-[10px] p-4 capitalize h-[56px]"
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
              <select
                id="routeEdit"
                name="route"
                value={formData.route}
                onChange={handleSelectChange("route")}
                className=" bg-[#EDF2F7] border-none rounded-[10px] w-full outline-none p-4 text-grey cursor-pointer h-[56px] mb-4"
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
            <div className="flex flex-col mb-8">
              <label
                htmlFor="frequencyEdit"
                className="text-[14px] mb-1 font-semibold text-navyBlue"
              >
                Frequency
              </label>
              <select
                id="frequencyEdit"
                name="frequency"
                value={formData.frequency}
                onChange={handleSelectChange("frequency")}
                className=" bg-[#EDF2F7] border-none w-full rounded-[10px] outline-none p-4 text-grey cursor-pointer h-[56px]"
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
                htmlFor="startEdit"
                className="text-[14px] mb-1 font-semibold text-navyBlue"
              >
                Select Start Date
              </label>
              <div className="bg-[#EDF2F7] w-full rounded-[10px]  mb-8">
                <input
                  type="date"
                  id="startEdit"
                  name="start"
                  disabled={true}
                  value={getCurrentDate()}
                  onChange={handleInputChange}
                  className="border bg-[#EDF2F7] border-none outline-none w-full text-grey rounded-[10px] p-4 h-[56px]"
                />
              </div>
              <div className="flex flex-col mb-8 w-full">
                <label
                  htmlFor="end"
                  className="text-[14px] mb-1 font-semibold text-navyBlue"
                >
                  Select End Date
                </label>
                <div className="bg-[#EDF2F7] w-full rounded-[10px]">
                  <input
                    type="date"
                    id="endEdit"
                    name="end"
                    value={formData.end}
                    onChange={handleInputChange}
                    className="border bg-[#EDF2F7] border-none outline-none w-full text-grey rounded-[10px] p-4  h-[56px]"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-center mb-8">
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
              disabled={loading}
              className={`font-semibold text-white rounded-[10px] w-full items-center 
              justify-center flex transition duration-300 ${
                loading ? "bg-navyBlue opacity-85" : "bg-blue-700 h-14"
              }`}
            >
              {loading ? (
                <div className=" h-14 flex items-center">
                  <div className="loaderInfinity" />
                </div>
              ) : (
                <div className="h-14 flex items-center">PROCEED</div>
              )}
            </button>
          </form>
        </div>
      </div>
      <div
        onClick={() => {
          setEditForm(false);
        }}
        className="absolute w-full h-full bg-grey opacity-[40] z-[3]"
      />
    </div>
  );
};

export default EditForm;
