/* eslint-disable react-hooks/exhaustive-deps */
"use-client";
import Image from "next/image";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "../../../../store";
import { setDrugs, updateSchedule } from "../../../../store/stateSlice";
import { dose, generateSchedule } from "../../../../utils/dashboard";
import { uploadScheduleToServer } from "../../../../utils/schedule";
import supabase from "../../../../utils/supabase";
import { generateDrugId } from "../../../../utils/drugs";
import { sendMail } from "../../../../utils/sendEmail";
import { generateDrugAddedEmail } from "../../../../emails/newDrug";
import { X } from "lucide-react";

interface DrugFormProps {
  drugsForm: boolean;
  setDrugsForm: Function;
}

interface SelectedDoseTypes {
  frequency: string;
  times: number;
  time: string[];
}

const DrugsForm: React.FC<DrugFormProps> = ({ drugsForm, setDrugsForm }) => {
  const { drugs, schedule, userId, allergies, info } = useSelector(
    (state: RootState) => state.app
  );

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    drug: "",
    frequency: "",
    route: "",
    start: new Date().toISOString().substr(0, 10),
    end: "",
    time: [""],
    reminder: true,
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

  useEffect(() => {
    const formElement = document.getElementById("top-drug");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [drugsForm]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (name === "drug") {
      setFormData({
        ...formData,
        [name]: value.toLowerCase(),
      });
    } else if (type === "checkbox") {
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
      <div key={index} className="bg-[#EDF2F7] w-full rounded-[10px]">
        <input
          type="time"
          id={`time-${index}`}
          name={`time-${index}`}
          value={formData.time[index]}
          onChange={handleInputChange}
          className=" border-none bg-[#EDF2F7] outline-none text-grey p-4 w-full rounded-[10px] h-[56px]"
        />
      </div>
    );
  });

  const handleSelectChange =
    (fieldName: string) => (e: ChangeEvent<HTMLSelectElement>) => {
      const { value } = e.target;
      setFormData({ ...formData, [fieldName]: value });
    };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors: Record<string, string> = {
      name: formData.drug ? "" : "Please fill in the Name of drug field.",
      frequency: formData.frequency ? "" : "Please select a Frequency.",
      route: formData.route ? "" : "Please select a Route.",
      start: formData.start ? "" : "Please select a Start Date.",
      end: formData.end ? "" : "Please select an End Date.",
    };

    const hasErrors = Object.values(errors).some((err) => err !== "");

    if (hasErrors) {
      Object.entries(errors).forEach(([field, error]) => {
        if (error) {
          toast.error(error);
        }
      });
      return;
    }

    const drugAlreadyExists = drugs.some(
      (drug) => drug.drug.toLowerCase() === formData.drug.toLowerCase()
    );

    const allergicToDrug = allergies.some(
      (item) => item.drug.toLowerCase() === formData.drug.toLowerCase()
    );

    if (drugAlreadyExists) {
      toast.error(`'${formData.drug}' already exists!`);
      resetFormData();
      return;
    }

    if (allergicToDrug) {
      toast.error(`'${formData.drug}' is a known drug allergy!`);
      resetFormData();
      return;
    }

    addDrug();
  };

  const addDrug = async () => {
    setLoading(true);

    // Generate drugId
    const drugId = generateDrugId(formData.drug, formData.start, formData.time);

    try {
      const { error } = await supabase.from("drugs").insert({
        userId: userId,
        drug: formData.drug,
        frequency: formData.frequency,
        route: formData.route,
        start: formData.start,
        end: formData.end,
        time: formData.time,
        reminder: formData.reminder,
        drugId: drugId, // Add drugId to the database
      });

      if (error) {
        toast.error(
          "Error adding drug, Check Internet Connection and Try again!"
        );
        setLoading(false);
        return;
      }

      // Update formData state with drugId
      formData.drugId = drugId;

      const { html, subject } = generateDrugAddedEmail(
        info[0].name,
        formData.drug,
        formData.start,
        formData.end,
        formData.route,
        formData.time
      );
      await sendMail(info[0].email, html, subject);
     
      
      dispatch(setDrugs([...drugs, formData]));
      toast.success(`${formData.drug.toUpperCase()} added successfully!`);
      setDrugsForm(false);
      setLoading(false);

      const data = generateSchedule(formData);
      const updatedSchedule = [...schedule, ...data];

      dispatch(updateSchedule(updatedSchedule));
      uploadScheduleToServer({
        userId: userId,
        schedule: updatedSchedule,
      });
    } catch (error) {
      toast.error(
        "Error adding drug, Check Internet Connection and Try again!"
      );
      setLoading(false);
    } finally {
      resetFormData();
      resetFormErrors();
      setLoading(false);
      
    }
  };

  const resetFormData = () => {
    setFormData({
      drug: "",
      frequency: "",
      route: "",
      start: new Date().toISOString().substr(0, 10),
      end: "",
      time: [],
      reminder: true,
      drugId: "",
    });
  };

  const resetFormErrors = () => {
    setFormErrors({
      drug: "",
      frequency: "",
      route: "",
      start: "",
      end: "",
      time: "",
    });
  };

  const handleClick = () => {
    const syntheticEvent = new Event(
      "submit"
    ) as unknown as FormEvent<HTMLFormElement>;
    handleSubmit(syntheticEvent);
  };

  return (
    <div
      className={` ${
        drugsForm ? "w-full " : "w-0"
      } left-0 bg-none fixed z-[2] h-[100dvh]`}
    >
      <div
        className={` ${
          drugsForm ? "left-0 ss:w-[450px]" : "-left-[450px] ss:w-[450px] "
        } transition-all duration-300 absolute w-full bg-white h-full z-[4] `}
      >
        <div
          className={`h-full flex flex-col w-full justify-between gap-8 p-8 pt-0 overflow-y-scroll bg-white`}
        >
          <div className="w-full bg-white">
            <div className="w-full flex justify-end mb-10">
              <button
                onClick={() => {
                  setDrugsForm(false);
                }}
                id="top-drug"
                className="cursor-pointer pt-8"
              >
                <X className="size-6 text-gray-800"/>
              </button>
            </div>
            <h1 className="text-[24px] text-blue-700 font-bold">Add Drug</h1>
            <p className="text-[14px] text-grey">
              To ensure adequate tracking of drug compliance.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col h-auto pr-2 bg-white"
          >
            <div className="w-full">
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
                  className=" bg-[#EDF2F7] w-full border-none text-grey outline-none rounded-[10px] p-4 mb-4 capitalize h-[56px] "
                  placeholder="Name of Drug"
                />
              </div>
              <div className="flex flex-col mb-4 ">
                <label
                  htmlFor="frequency"
                  className="text-[14px] mb-1 font-semibold text-navyBlue"
                >
                  Routes of Administration
                </label>
                <select
                  id="route"
                  name="route"
                  value={formData.route}
                  onChange={handleSelectChange("route")}
                  className=" bg-[#EDF2F7] border-none py-4 outline-none rounded-[10px] w-full px-4 mb-4 text-grey cursor-pointer h-[56px]"
                >
                  <option value="">Select Route</option>
                  <option value="oral">Oral</option>
                  <option value="topical">Topical</option>
                  <option value="intravenous">intravenous (IV)</option>
                  <option value="intramuscular">intramuscular (IM)</option>
                  <option value="inhalation">Inhalation</option>
                  <option value="rectal">Rectal</option>
                  <option value="sublingual">Sublingual</option>
                </select>
              </div>
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="frequency"
                  className="text-[14px] mb-1 font-semibold text-navyBlue"
                >
                  Frequency
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleSelectChange("frequency")}
                  className=" bg-[#EDF2F7] border-none rounded-[10px] w-full outline-none p-4 mb-4 text-grey cursor-pointer h-[56px]"
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
                  htmlFor="start"
                  className="text-[14px] mb-1 font-semibold text-navyBlue"
                >
                  Select Start Date
                </label>
                <div className="bg-[#EDF2F7] w-full rounded-[10px]  mb-8">
                  <input
                    type="date"
                    id="start"
                    name="start"
                    value={formData.start}
                    onChange={handleInputChange}
                    className="bg-[#EDF2F7] border-none outline-none w-full text-grey rounded-[10px] p-4 h-[56px]"
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
                      id="end"
                      name="end"
                      value={formData.end}
                      onChange={handleInputChange}
                      className=" bg-[#EDF2F7] border-none outline-none w-full text-grey rounded-[10px] p-4 h-[56px]"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="reminderEdit"
                  name="reminder"
                  checked={formData.reminder}
                  onChange={handleInputChange}
                  className="w-5 h-5 outline-none"
                  placeholder="Select End Date"
                />
                <label
                  htmlFor="reminder"
                  className="text-[14px] font-semibold text-navyBlue"
                >
                  Add Reminder
                </label>
              </div>
            </div>
          </form>
          <button
            onClick={handleClick}
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
        </div>
      </div>
      <div
        onClick={() => {
          setDrugsForm(false);
        }}
        className="absolute w-full h-full bg-grey opacity-[40] z-[3]"
      />
    </div>
  );
};

export default DrugsForm;
