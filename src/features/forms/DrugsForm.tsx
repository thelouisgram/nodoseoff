/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  useDrugs,
  useSchedule,
  useAllergies,
  useUserInfo,
} from "@/hooks/useDashboardData";
import { dose, generateSchedule } from "@/utils/dashboard/dashboard";
import { uploadScheduleToServer } from "@/utils/dashboard/schedule";
import { createClient } from "@/lib/supabase/client";
import { generateDrugId } from "@/utils/drugs";
import { sendMail } from "@/utils/sendEmail";
import { generateDrugAddedEmail } from "@/emails/newDrug";
import dayjs from "dayjs";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";

interface DrugFormProps {
  setActiveModal: (value: string) => void;
  activeModal: string;
}

interface SelectedDoseTypes {
  frequency: string;
  times: number;
  time: string[];
}

const DrugsForm: React.FC<DrugFormProps> = ({
  activeModal,
  setActiveModal,
}) => {
  /* Redux Replacement */
  const { userId } = useAppStore((state) => state);

  const { data: drugs = [] } = useDrugs(userId);
  const { data: schedule = [] } = useSchedule(userId);
  const { data: allergies = [] } = useAllergies(userId);
  const { data: info = [] } = useUserInfo(userId);

  const supabase = createClient();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
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
      <input
        key={index}
        type="time"
        id={`time-${index}`}
        name={`time-${index}`}
        value={formData.time[index]}
        onChange={handleInputChange}
        disabled={loading}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-50 dark:disabled:bg-slate-900 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-900"
      />
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
      resetFormData();
      resetFormErrors();
    }
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

    if (formData.start && formData.end) {
      const startDate = dayjs(formData.start);
      const endDate = dayjs(formData.end);

      if (endDate.isBefore(startDate, "day")) {
        errors.end = "The End Date cannot be before the Start Date.";
      }
    }

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

    const drugId = generateDrugId(formData.drug);
    console.log(drugId);

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
        drugId: drugId,
      });

      if (error) {
        toast.error(
          "Error adding drug, Check Internet Connection and Try again!"
        );
        return;
      }

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

      await sendMail(info[0].email, html, subject);

      // dispatch(setDrugs([...drugs, formData]));

      const data = generateSchedule(formData);
      const updatedSchedule = [...schedule, ...data];

      // dispatch(updateSchedule(updatedSchedule));
      await uploadScheduleToServer({
        userId: userId,
        schedule: updatedSchedule,
      });

      queryClient.invalidateQueries({ queryKey: ["dashboardData", userId] });
      toast.success(`${formData.drug.toUpperCase()} added successfully!`);
      setActiveModal("");
    } catch (error) {
      toast.error(
        "Error adding drug, Check Internet Connection and Try again!"
      );
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

  if (activeModal !== "drugs") return null;

  return (
    <AnimatePresence>
      {activeModal === "drugs" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-2xl max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-slate-800 flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                Add Drug
              </h2>
              <button
                onClick={handleClose}
                disabled={loading}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form - Scrollable */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-5">
                {/* Drug Name */}
                <div className="w-full">
                  <label
                    htmlFor="drug"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
                  >
                    Drug Name
                  </label>
                  <input
                    type="text"
                    id="drug"
                    name="drug"
                    placeholder="e.g., Rifampicin"
                    value={formData.drug}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-50 dark:disabled:bg-slate-900/50 disabled:cursor-not-allowed text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 bg-white dark:bg-slate-900"
                    autoComplete="off"
                  />
                </div>

                {/* Route */}
                <div className="w-full">
                  <label
                    htmlFor="route"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
                  >
                    Route of Administration
                  </label>
                  <select
                    id="route"
                    name="route"
                    value={formData.route}
                    onChange={handleSelectChange("route")}
                    disabled={loading}
                    className="w-full px-4 py-3 h-[47px] border border-gray-300 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-50 dark:disabled:bg-slate-900/50 disabled:cursor-not-allowed text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-900 cursor-pointer"
                  >
                    <option value="" className="dark:bg-slate-800">
                      Select Route
                    </option>
                    <option value="oral" className="dark:bg-slate-800">
                      Oral
                    </option>
                    <option value="topical" className="dark:bg-slate-800">
                      Topical
                    </option>
                    <option value="intravenous" className="dark:bg-slate-800">
                      Intravenous (IV)
                    </option>
                    <option value="intramuscular" className="dark:bg-slate-800">
                      Intramuscular (IM)
                    </option>
                    <option value="inhalation" className="dark:bg-slate-800">
                      Inhalation
                    </option>
                    <option value="rectal" className="dark:bg-slate-800">
                      Rectal
                    </option>
                    <option value="sublingual" className="dark:bg-slate-800">
                      Sublingual
                    </option>
                  </select>
                </div>

                {/* Frequency */}
                <div className="w-full">
                  <label
                    htmlFor="frequency"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
                  >
                    Frequency
                  </label>
                  <select
                    id="frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleSelectChange("frequency")}
                    disabled={loading}
                    className="w-full px-4 py-3 h-[47px] border border-gray-300 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-50 dark:disabled:bg-slate-900/50 disabled:cursor-not-allowed text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-900 cursor-pointer"
                  >
                    <option value="" className="dark:bg-slate-800">
                      Select Frequency
                    </option>
                    <option value="QD" className="dark:bg-slate-800">
                      Once Daily
                    </option>
                    <option value="BID" className="dark:bg-slate-800">
                      Twice Daily
                    </option>
                    <option value="TID" className="dark:bg-slate-800">
                      Thrice Daily
                    </option>
                    <option value="QID" className="dark:bg-slate-800">
                      Four Times Daily
                    </option>
                    <option value="EOD" className="dark:bg-slate-800">
                      Every Other Day
                    </option>
                    <option value="W" className="dark:bg-slate-800">
                      Weekly
                    </option>
                    <option value="BW" className="dark:bg-slate-800">
                      Biweekly
                    </option>
                    <option value="M" className="dark:bg-slate-800">
                      Monthly
                    </option>
                  </select>
                </div>

                {/* Time Inputs */}
                {formData.frequency && formData.time.length > 0 && (
                  <div className="w-full mb-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Select Time{formData.time.length > 1 ? "s" : ""}
                    </label>
                    <div className="grid grid-cols-2 h-[47px] gap-3">{timeInput}</div>
                  </div>
                )}

                {/* Start Date */}
                <div className="w-full">
                  <label
                    htmlFor="start"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start"
                    name="start"
                    value={formData.start}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-3 h-[47px] border border-gray-300 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-50 dark:disabled:bg-slate-900/50 disabled:cursor-not-allowed text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-900"
                  />
                </div>

                {/* End Date */}
                <div className="w-full">
                  <label
                    htmlFor="end"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end"
                    name="end"
                    value={formData.end}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-3 h-[47px] border border-gray-300 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-50 dark:disabled:bg-slate-900/50 disabled:cursor-not-allowed text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-900"
                  />
                </div>

                {/* Reminder Checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="reminder"
                    name="reminder"
                    checked={formData.reminder}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-4 h-4 text-blue-600 border-gray-300 dark:border-slate-800 rounded focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed bg-white dark:bg-slate-900"
                  />
                  <label
                    htmlFor="reminder"
                    className="text-sm font-medium text-gray-700 dark:text-slate-300"
                  >
                    Add Reminder
                  </label>
                </div>
              </div>
            </form>

            {/* Footer with Submit Button */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800 flex-shrink-0">
              <button
                onClick={handleClick}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-md hover:shadow-lg shadow-blue-500/20"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  "Add Drug"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DrugsForm;
