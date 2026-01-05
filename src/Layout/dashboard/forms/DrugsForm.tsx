/* eslint-disable react-hooks/exhaustive-deps */
"use-client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "../../../../store";
import { setDrugs, updateSchedule } from "../../../../store/stateSlice";
import { dose, generateSchedule } from "../../../../utils/dashboard/dashboard";
import { uploadScheduleToServer } from "../../../../utils/dashboard/schedule";
import { createClient } from "../../../../lib/supabase/client";
import { generateDrugId } from "../../../../utils/drugs";
import { sendMail } from "../../../../utils/sendEmail";
import { generateDrugAddedEmail } from "../../../../emails/newDrug";
import { X, Loader2 } from "lucide-react";
import dayjs from "dayjs";
import { useAppStore } from "../../../../store/useAppStore";

interface DrugFormProps {
  setActiveModal: (value: string) => void;
  activeModal: string;
}

interface SelectedDoseTypes {
  frequency: string;
  times: number;
  time: string[];
}

const DrugsForm: React.FC<DrugFormProps> = ({ activeModal, setActiveModal }) => {
  const { drugs, schedule, allergies, info } = useSelector(
    (state: RootState) => state.app
  );
  const { userId } = useAppStore((state) => state);

  const supabase = createClient();
  const dispatch = useDispatch();

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
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-900"
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
    console.log(drugId)

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

      dispatch(setDrugs([...drugs, formData]));
      toast.success(`${formData.drug.toUpperCase()} added successfully!`);
      setActiveModal("");

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
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          activeModal === "drugs"
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0"
        } transition-all duration-200 w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">Add Drug</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                htmlFor="drug"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-900 placeholder-gray-400"
                autoComplete="off"
              />
            </div>

            {/* Route */}
            <div>
              <label
                htmlFor="route"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Route of Administration
              </label>
              <select
                id="route"
                name="route"
                value={formData.route}
                onChange={handleSelectChange("route")}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-900 cursor-pointer"
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
                htmlFor="frequency"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Frequency
              </label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleSelectChange("frequency")}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-900 cursor-pointer"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time{formData.time.length > 1 ? "s" : ""}
                </label>
                <div className="grid grid-cols-2 gap-3">{timeInput}</div>
              </div>
            )}

            {/* Start Date */}
            <div>
              <label
                htmlFor="start"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-900"
              />
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="end"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-900"
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
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
              />
              <label
                htmlFor="reminder"
                className="text-sm font-medium text-gray-700"
              >
                Add Reminder
              </label>
            </div>
          </div>
        </form>

        {/* Footer with Submit Button */}
        <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={handleClick}
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
                <span>Adding...</span>
              </>
            ) : (
              "Add Drug"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrugsForm;