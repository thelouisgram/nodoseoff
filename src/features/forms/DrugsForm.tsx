/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import {
  useDrugs,
  useCompletedDrugs,
  useAllergies,
  useUserInfo,
  useAddDrugMutation,
} from "@/hooks/useDashboardData";
import { dose } from "@/utils/dashboard/dashboard";
import {
  findOverlappingCourse,
  nextAvailableCourseStart,
  sameDrugName,
} from "@/utils/drugs";
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
  const { userId, activeDrug, activeDrugId } = useAppSelector(
    (state) => state.app
  );

  const { data: drugs = [], isLoading: drugsLoading } = useDrugs(userId);
  const { data: completed = [], isLoading: completedLoading } =
    useCompletedDrugs(userId);
  const { data: allergies = [] } = useAllergies(userId);
  const { data: info = [] } = useUserInfo(userId);

  const addDrugMutation = useAddDrugMutation();
  const isRefill = activeModal === "refill";
  const refillSeeded = useRef(false);

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

  useEffect(() => {
    if (!isRefill) {
      refillSeeded.current = false;
    }
  }, [isRefill]);

  useEffect(() => {
    const selectedDose: SelectedDoseTypes | undefined = dose?.find(
      (item) => item.frequency === formData.frequency
    );
    if (!selectedDose) return;

    setFormData((prev) => {
      // Keep prefilled / user-edited times when count already matches
      if (
        prev.time.length === (selectedDose.time?.length || 0) &&
        prev.time.every((t) => Boolean(t))
      ) {
        return prev;
      }
      return {
        ...prev,
        time: selectedDose.time || [],
      };
    });
  }, [formData.frequency]);

  // Prefill from latest matching course when opening refill (once per open)
  useEffect(() => {
    if (!isRefill || refillSeeded.current) return;

    const pool = [...drugs, ...completed];
    const byId = pool.find(
      (d) => d.drugId && activeDrugId && d.drugId === activeDrugId
    );
    const byName = pool
      .filter((d) => sameDrugName(d.drug, activeDrug))
      .sort((a, b) => {
        const aEnd = Date.parse(a.end || "") || 0;
        const bEnd = Date.parse(b.end || "") || 0;
        return bEnd - aEnd;
      })[0];
    const source = byId || byName;
    if (!source) {
      // Wait until drug lists have loaded before failing
      if (drugsLoading || completedLoading) return;
      if (!activeDrug && !activeDrugId) return;
      toast.error("Could not find that medication to refill");
      setActiveModal("");
      return;
    }

    const frequency = String(source.frequency || "")
      .trim()
      .toUpperCase();
    const route = String(source.route || "")
      .trim()
      .toLowerCase();
    // New course may not overlap any ongoing course of the same drug.
    const ongoingSame = drugs.filter((d) =>
      sameDrugName(d.drug, source.drug)
    );
    const start = nextAvailableCourseStart(ongoingSame);
    const rawDays = dayjs(source.end).diff(dayjs(source.start), "day");
    const prevDays =
      Number.isFinite(rawDays) && rawDays > 0 ? rawDays : 7;
    const end = dayjs(start).add(prevDays, "day").format("YYYY-MM-DD");

    const sourceTimes = Array.isArray(source.time)
      ? source.time.map((t) => String(t || "").trim()).filter(Boolean)
      : [];
    const defaults =
      dose.find((d) => d.frequency === frequency)?.time || ["08:00"];

    refillSeeded.current = true;
    setFormData({
      drug: String(source.drug || "").trim().toLowerCase(),
      frequency,
      route,
      start,
      end,
      time: sourceTimes.length ? sourceTimes : [...defaults],
      reminder: source.reminder !== false,
      drugId: "",
    });
    resetFormErrors();
  }, [
    isRefill,
    activeDrug,
    activeDrugId,
    drugs,
    completed,
    drugsLoading,
    completedLoading,
    setActiveModal,
  ]);

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

    const frequency = String(formData.frequency || "").trim().toUpperCase();
    const route = String(formData.route || "").trim().toLowerCase();
    const drugName = String(formData.drug || "").trim().toLowerCase();
    const times = (formData.time || [])
      .map((t) => String(t || "").trim())
      .filter(Boolean);

    const errors: Record<string, string> = {
      name: drugName ? "" : "Please fill in the Name of drug field.",
      frequency: frequency ? "" : "Please select a Frequency.",
      route: route ? "" : "Please select a Route.",
      start: formData.start ? "" : "Please select a Start Date.",
      end: formData.end ? "" : "Please select an End Date.",
      time: times.length ? "" : "Please fill in all time fields.",
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

    const drugAlreadyExists =
      !isRefill &&
      drugs.some((drug) => drug.drug.toLowerCase() === drugName);

    const allergicToDrug = allergies.some(
      (item) => item.drug.toLowerCase() === drugName
    );

    if (drugAlreadyExists) {
      toast.error(
        `'${drugName}' is already ongoing. Use Refill to start the next course after it ends.`
      );
      return;
    }

    if (allergicToDrug) {
      toast.error(`'${drugName}' is a known drug allergy!`);
      return;
    }

    const sameNameOngoing = drugs.filter((d) =>
      sameDrugName(d.drug, drugName)
    );
    const overlap = findOverlappingCourse(sameNameOngoing, {
      start: formData.start,
      end: formData.end,
    });
    if (overlap) {
      const next = nextAvailableCourseStart(sameNameOngoing);
      toast.error(
        `Only one active course of ${drugName} at a time. Earliest start for the next course is ${next}.`
      );
      return;
    }

    void addDrug({
      drug: drugName,
      frequency,
      route,
      start: formData.start,
      end: formData.end,
      time: times,
      reminder: formData.reminder,
    });
  };

  const addDrug = async (payload: {
    drug: string;
    frequency: string;
    route: string;
    start: string;
    end: string;
    time: string[];
    reminder: boolean;
  }) => {
    setLoading(true);

    try {
      await addDrugMutation.mutateAsync({
        userId: userId!,
        ...payload,
        userInfo: {
          name: info[0]?.name || "",
          email: info[0]?.email || "",
        },
      });

      toast.success(
        isRefill
          ? `${payload.drug.toUpperCase()} refill started!`
          : `${payload.drug.toUpperCase()} added successfully!`
      );
      refillSeeded.current = false;
      setActiveModal("");
      resetFormData();
      resetFormErrors();
    } catch (error) {
      console.error(error);
      let message = "";
      if (error instanceof Error) {
        try {
          const parsed = JSON.parse(error.message) as { error?: string };
          message = parsed.error || error.message;
        } catch {
          message = error.message;
        }
      }
      toast.error(
        message && /active course|date range|overlap|medication already/i.test(message)
          ? message
          : "Error adding drug. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    const syntheticEvent = new Event(
      "submit"
    ) as unknown as FormEvent<HTMLFormElement>;
    handleSubmit(syntheticEvent);
  };

  if (activeModal !== "drugs" && activeModal !== "refill") return null;

  return (
    <AnimatePresence>
      {(activeModal === "drugs" || activeModal === "refill") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-soft-ink/25 p-4 backdrop-blur-sm"
        >
          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-[160] flex max-h-[80vh] w-full flex-col rounded-2xl border border-black/[0.05] bg-white shadow-soft-md ss:max-w-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.04] flex-shrink-0">
              <h2 className="text-xl font-semibold text-soft-ink ">
                {isRefill ? "Refill medication" : "Add Drug"}
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
                      disabled={loading || isRefill}
                      readOnly={isRefill}
                      className="w-full h-full bg-transparent border-none outline-none p-0 text-soft-ink  placeholder:text-soft-muted capitalize disabled:cursor-not-allowed"
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
                className={`ndo-press flex w-full items-center justify-center gap-2 rounded-soft-md px-4 py-3 font-semibold text-white ${
                  loading
                    ? "cursor-not-allowed bg-soft-ink/50"
                    : "bg-soft-primary shadow-soft-sm hover:bg-soft-primary/90"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>{isRefill ? "Starting…" : "Adding..."}</span>
                  </>
                ) : isRefill ? (
                  "Start refill"
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
