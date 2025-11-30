/* eslint-disable react-hooks/exhaustive-deps */
"use-client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "../../../../store";
import { setDrugs, updateSchedule } from "../../../../store/stateSlice";
import { dose, generateSchedule } from "../../../../utils/dashboard/dashboard";
import {
  removePastDoses,
  uploadScheduleToServer,
} from "../../../../utils/dashboard/schedule";
import { createClient } from "../../../../lib/supabase/client";
import { X, Loader2 } from "lucide-react";
import dayjs from "dayjs";

interface DrugFormProps {
  setActiveModal: (value: string) => void;
  activeModal: string;
}

interface SelectedDoseTypes {
  frequency: string;
  times: number;
  time: string[];
}

interface FormErrors {
  [key: string]: string;
}

const EditForm: React.FC<DrugFormProps> = ({ activeModal, setActiveModal }) => {
  const { drugs, activeDrug, schedule, userId, activeDrugId } = useSelector(
    (state: RootState) => state.app
  );
  const dispatch = useDispatch();

  const currentDrug = drugs.find((drug) => drug.drug === activeDrug);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

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

  function getCurrentDate(): string {
    const today: Date = new Date();
    const year: number = today.getFullYear();
    let month: string | number = today.getMonth() + 1;
    let day: string | number = today.getDate();

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
          type="time"
          id={`time-${index}`}
          name={`time-${index}`}
          value={formData.time[index]}
          onChange={handleInputChange}
          disabled={loading}
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

  const handleClose = () => {
    if (!loading) {
      setActiveModal("");
      setFormErrors({
        drug: "",
        frequency: "",
        route: "",
        start: "",
        end: "",
        time: "",
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors: FormErrors = {
      name: formData.drug ? "" : "Please fill in the Name of drug field.",
      frequency: formData.frequency ? "" : "Please select a Frequency.",
      route: formData.route ? "" : "Please select a Route.",
      start: formData.start ? "" : "Please select a Start Date.",
      end: formData.end ? "" : "Please select an End Date.",
    };

    const todayDate = dayjs(getCurrentDate());

    if (formData.end) {
      const endDate = dayjs(formData.end);

      if (endDate.isBefore(todayDate, "day")) {
        errors.end = "The End Date cannot be before today's Start Date.";
      }
    }

    const errorValues = Object.values(errors);

    if (errorValues.some((err) => err !== "")) {
      Object.keys(errors).forEach((field) => {
        if (errors[field]) {
          toast.error(errors[field]);
        }
      });
      return;
    }

    setLoading(true);

    try {
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

      const strippedSchedule = removePastDoses({
        activeDrugId,
        schedule,
      });

      const data = generateSchedule({
        ...formData,
        start: getCurrentDate(),
      });
      const updatedSchedule = [...strippedSchedule, ...data];

      dispatch(updateSchedule([...updatedSchedule]));

      await uploadScheduleToServer({
        userId: userId,
        schedule: updatedSchedule,
      });

      const { error: drugUpdateError } = await supabase
        .from("drugs")
        .update({
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
        return;
      }

      toast.success(`${formData.drug.toUpperCase()} updated successfully`);
      setActiveModal("");
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
    } finally {
      setLoading(false);
    }
  };

  if (activeModal !== "edit") return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-start z-[100] transition-opacity duration-300"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          activeModal === "edit" ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 w-full ss:w-[450px] bg-white h-full`}
      >
        <div
          className={`h-full flex flex-col w-full justify-between gap-8 p-8 pt-0 overflow-y-scroll bg-white`}
        >
          <div className="w-full bg-white">
            <div className="w-full flex justify-end mb-10">
              <button
                onClick={handleClose}
                disabled={loading}
                className="cursor-pointer pt-8 hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="size-6 text-gray-800" />
              </button>
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
                disabled={loading}
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
                disabled={loading}
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
                    disabled={loading}
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
                disabled={loading}
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
                  <Loader2 className="size-5 animate-spin" />
                </div>
              ) : (
                <div className="h-14 flex items-center">PROCEED</div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditForm;