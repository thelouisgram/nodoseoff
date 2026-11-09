/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useDrugs,
  useAllergies,
  useUserInfo,
  useAddDrugMutation,
} from "@/hooks/useDashboardData";
import { dose } from "@/utils/dashboard/dashboard";
import dayjs from "dayjs";
import { useAppSelector } from "@/store";
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
  const { userId } = useAppSelector((state) => state.app);

  const { data: drugs = [] } = useDrugs(userId);
  const { data: allergies = [] } = useAllergies(userId);
  const { data: info = [] } = useUserInfo(userId);

  const addDrugMutation = useAddDrugMutation();

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
      <div
        key={`time-input-${index}`}
        className="w-full h-[47px] px-4 border border-black/[0.06] rounded-soft-sm focus-within:ring-4 focus-within:ring-soft-ink/[0.04] transition-shadow bg-white flex items-center"
      >
        <input
          type="time"
          id={`time-${index}`}
          name={`time-${index}`}
          value={formData.time[index]}
          onChange={handleInputChange}
          disabled={loading}
          className="w-full h-full bg-transparent border-none outline-none p-0 text-soft-ink disabled:cursor-not-allowed"
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
      Object.entries(errors).forEach(([, error]) => {
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

    try {
      await addDrugMutation.mutateAsync({
        userId: userId!,
        drug: formData.drug,
        frequency: formData.frequency,
        route: formData.route,
        start: formData.start,
        end: formData.end,
        time: formData.time,
        reminder: formData.reminder,
        userInfo: {
          name: info[0]?.name || "",
          email: info[0]?.email || "",
        },
      });

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
          className="fixed inset-0 bg-soft-ink/25 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[80vh] w-full flex-col rounded-2xl border border-black/[0.05] bg-white shadow-soft-md ss:max-w-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.04] flex-shrink-0">
              <h2 className="text-xl font-semibold text-soft-ink ">
                Add Drug
              </h2>
              <button
                onClick={handleClose}
                disabled={loading}
                className="p-1.5 text-soft-muted hover:text-soft-ink hover:bg-soft-canvas rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="block text-sm font-medium text-soft-ink  mb-2"
                  >
                    Drug
                  </label>
                  <div className="w-full h-[47px] px-4 border border-black/[0.06] rounded-soft-sm focus-within:ring-4 focus-within:ring-soft-ink/[0.04] transition-shadow bg-white flex items-center">
                    <input
                      type="text"
                      id="drug"
                      name="drug"
                      placeholder="e.g., Rifampicin"
                      value={formData.drug}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full h-full bg-transparent border-none outline-none p-0 text-soft-ink  placeholder:text-soft-muted "
                      autoComplete="off"
                    />
                  </div>
                </div>

                {/* Route */}
                <div className="w-full">
                  <label
                    htmlFor="route"
                    className="block text-sm font-medium text-soft-ink  mb-2"
                  >
                    Route of Administration
                  </label>
                  <div className="w-full h-[47px] px-4 border border-black/[0.06] rounded-soft-sm focus-within:ring-4 focus-within:ring-soft-ink/[0.04] transition-shadow bg-white flex items-center">
                    <select
                      id="route"
                      name="route"
                      value={formData.route}
                      onChange={handleSelectChange("route")}
                      disabled={loading}
                      className="w-full h-full bg-transparent border-none outline-none p-0 text-soft-ink  cursor-pointer"
                    >
                      <option value="" className="">
                        Select Route
                      </option>
                      <option value="oral" className="">
                        Oral
                      </option>
                      <option value="topical" className="">
                        Topical
                      </option>
                      <option value="intravenous" className="">
                        Intravenous (IV)
                      </option>
                      <option
                        value="intramuscular"
                        className=""
                      >
                        Intramuscular (IM)
                      </option>
                      <option value="inhalation" className="">
                        Inhalation
                      </option>
                      <option value="rectal" className="">
                        Rectal
                      </option>
                      <option value="sublingual" className="">
                        Sublingual
                      </option>
                    </select>
                  </div>
                </div>

                {/* Frequency */}
                <div className="w-full">
                  <label
                    htmlFor="frequency"
                    className="block text-sm font-medium text-soft-ink  mb-2"
                  >
                    Frequency
                  </label>
                  <div className="w-full h-[47px] px-4 border border-black/[0.06] rounded-soft-sm focus-within:ring-4 focus-within:ring-soft-ink/[0.04] transition-shadow bg-white flex items-center">
                    <select
                      id="frequency"
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleSelectChange("frequency")}
                      disabled={loading}
                      className="w-full h-full bg-transparent border-none outline-none p-0 text-soft-ink  cursor-pointer"
                    >
                      <option value="" className="">
                        Select Frequency
                      </option>
                      <option value="QD" className="">
                        Once Daily
                      </option>
                      <option value="BID" className="">
                        Twice Daily
                      </option>
                      <option value="TID" className="">
                        Thrice Daily
                      </option>
                      <option value="QID" className="">
                        Four Times Daily
                      </option>
                      <option value="EOD" className="">
                        Every Other Day
                      </option>
                      <option value="W" className="">
                        Weekly
                      </option>
                      <option value="BW" className="">
                        Biweekly
                      </option>
                      <option value="M" className="">
                        Monthly
                      </option>
                    </select>
                  </div>
                </div>

                {/* Time Inputs */}
                {formData.frequency && formData.time.length > 0 && (
                  <div className="w-full mb-5">
                    <label className="block text-sm font-medium text-soft-ink  mb-2">
                      Select Time{formData.time.length > 1 ? "s" : ""}
                    </label>
                    <div className="grid grid-cols-2 w-full gap-3">
                      {timeInput}
                    </div>
                  </div>
                )}

                  {/* Start Date */}
                  <div className="w-full">
                    <label
                      htmlFor="start"
                      className="block text-sm font-medium text-soft-ink  mb-2"
                    >
                      Start Date
                    </label>
                    <div className="w-full h-[47px] px-4 border border-black/[0.06] rounded-soft-sm focus-within:ring-4 focus-within:ring-soft-ink/[0.04] transition-shadow bg-white flex items-center">
                      <input
                        type="date"
                        id="start"
                        name="start"
                        value={formData.start}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="w-full h-full bg-transparent border-none outline-none p-0 text-soft-ink disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* End Date */}
                  <div className="w-full">
                    <label
                      htmlFor="end"
                      className="block text-sm font-medium text-soft-ink  mb-2"
                    >
                      End Date
                    </label>
                    <div className="w-full h-[47px] px-4 border border-black/[0.06] rounded-soft-sm focus-within:ring-4 focus-within:ring-soft-ink/[0.04] transition-shadow bg-white flex items-center">
                      <input
                        type="date"
                        id="end"
                        name="end"
                        value={formData.end}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="w-full h-full bg-transparent border-none outline-none p-0 text-soft-ink disabled:cursor-not-allowed"
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
                    className="w-4 h-4 text-blue-600 border-gray-300  rounded focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed bg-white"
                  />
                  <label
                    htmlFor="reminder"
                    className="text-sm font-medium text-soft-ink "
                  >
                    Add Reminder
                  </label>
                </div>
              </div>
            </form>

            {/* Footer with Submit Button */}
            <div className="px-6 py-4 border-t border-black/[0.04] flex-shrink-0">
              <button
                onClick={handleClick}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-soft-md font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-soft-ink/50 cursor-not-allowed"
                    : "bg-soft-primary shadow-soft-sm hover:bg-soft-primary/90 active:scale-[0.98]"
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
