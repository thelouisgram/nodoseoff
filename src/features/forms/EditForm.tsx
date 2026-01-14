/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useDrugs, useUpdateDrugMutation } from "@/hooks/useDashboardData";
import { dose } from "@/utils/dashboard/dashboard";
import { X, Loader2, Calendar } from "lucide-react";
import dayjs from "dayjs";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";

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
  const { userId } = useAppStore((state) => state);
  const { data: drugs = [] } = useDrugs(userId);
  const { activeDrug, activeDrugId } = useAppStore((state) => state);

  const currentDrug = drugs.find((drug) => drug.drug === activeDrug);
  const [loading, setLoading] = useState(false);

  const updateDrugMutation = useUpdateDrugMutation();

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
      <input
        key={index}
        type="time"
        id={`time-${index}`}
        name={`time-${index}`}
        value={formData.time[index]}
        onChange={handleInputChange}
        disabled={loading}
        className="w-full h-[47px] px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm bg-gray-50/50 dark:bg-slate-900/50 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
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
        errors.end = "The End Date cannot be before Start Date.";
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
      await updateDrugMutation.mutateAsync({
        userId: userId!,
        activeDrug: activeDrug!,
        activeDrugId: activeDrugId!,
        drug: formData.drug,
        frequency: formData.frequency,
        route: formData.route,
        start: formData.start,
        end: formData.end,
        time: formData.time,
        reminder: formData.reminder,
        todayDate: getCurrentDate(),
      });

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

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const syntheticEvent = new Event(
      "submit"
    ) as unknown as FormEvent<HTMLFormElement>;
    handleSubmit(syntheticEvent);
  };

  if (activeModal !== "edit") return null;

  return (
    <AnimatePresence>
      {activeModal === "edit" && (
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
                Edit Drug
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
                <div>
                  <label
                    htmlFor="drugEdit"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Drug Name
                  </label>
                  <input
                    type="text"
                    id="drugEdit"
                    name="drug"
                    placeholder="e.g., Rifampicin"
                    value={formData.drug}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-slate-900"
                    autoComplete="off"
                  />
                </div>

                {/* Route */}
                <div>
                  <label
                    htmlFor="routeEdit"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Route of Administration
                  </label>
                  <select
                    id="routeEdit"
                    name="route"
                    value={formData.route}
                    onChange={handleSelectChange("route")}
                    disabled={loading}
                    className="w-full px-4 py-3 h-[47px] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-900 cursor-pointer"
                  >
                    <option value="">Select Route</option>
                    <option value="oral">Oral</option>
                    <option value="topical">Topical</option>
                    <option value="intravenous">Intravenous (IV)</option>
                    <option value="intramuscular">Intramuscular (IM)</option>
                    <option value="inhalation">Inhalation</option>
                    <option value="rectal">Rectal</option>
                    <option value="sublingual">Sublingual</option>
                  </select>
                </div>

                {/* Frequency */}
                <div>
                  <label
                    htmlFor="frequencyEdit"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Frequency
                  </label>
                  <select
                    id="frequencyEdit"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleSelectChange("frequency")}
                    disabled={loading}
                    className="w-full px-4 h-[47px]  py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-900 cursor-pointer"
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

                {/* Time Inputs */}
                {formData.frequency && formData.time.length > 0 && (
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Time{formData.time.length > 1 ? "s" : ""}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-3">
                      {timeInput}
                    </div>
                  </div>
                )}

                {/* Start & End Date - Responsive 2 Column Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Start Date - Disabled */}
                  <div>
                    <label
                      htmlFor="startEdit"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startEdit"
                      name="start"
                      disabled={true}
                      value={getCurrentDate()}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 h-[47px] border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 cursor-not-allowed"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label
                      htmlFor="endEdit"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endEdit"
                      name="end"
                      value={formData.end}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-4 py-3 h-[47px] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-900"
                    />
                  </div>
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
                    className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed bg-white dark:bg-gray-800"
                  />
                  <label
                    htmlFor="reminder"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Add Reminder
                  </label>
                </div>
              </div>
            </form>

            {/* Footer with Submit Button */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  const syntheticEvent = new Event(
                    "submit"
                  ) as unknown as FormEvent<HTMLFormElement>;
                  handleSubmit(syntheticEvent);
                }}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  "Update Drug"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditForm;
