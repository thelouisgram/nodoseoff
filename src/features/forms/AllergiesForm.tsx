import React, { ChangeEvent, FormEvent, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
// import { RootState } from "../../../../store";
// import { updateAllergies } from "../../../../store/stateSlice";
import { useQueryClient } from "@tanstack/react-query";
import { useAllergies, useUserInfo } from "@/hooks/useDashboardData";
import { createClient } from "@/lib/supabase/client";
import { generateDrugAllergyEmail } from "@/emails/drugAllergy";
import { sendMail } from "@/utils/sendEmail";
import { X, Loader2, AlertCircle } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { generateDrugId } from "@/utils/drugs";

interface AllergiesFormProps {
  setActiveModal: (value: string) => void;
  activeModal: string;
}

const AllergiesForm: React.FC<AllergiesFormProps> = ({
  activeModal,
  setActiveModal,
}) => {
  const { userId } = useAppStore((state) => state);
  const { data: allergies = [] } = useAllergies(userId);
  const { data: info = [] } = useUserInfo(userId);

  const queryClient = useQueryClient();

  const supabase = createClient();

  const [drug, setDrug] = useState("");
  const [loading, setLoading] = useState(false);

  const resetFormData = () => {
    setDrug("");
  };

  const handleClose = () => {
    if (!loading) {
      setActiveModal("");
      resetFormData();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const drugId = generateDrugId(drug);

    if (!drug) {
      toast.error("Please fill in the Drug field.");
      return;
    }

    const drugAlreadyExists = allergies.some(
      (item) => item.drug.toLowerCase() === drug.toLowerCase()
    );

    if (drugAlreadyExists) {
      toast.error(`'${drug}' already exists!`);
      resetFormData();
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("allergies").insert({
        userId: userId,
        drug: drug,
        frequency: "",
        route: "",
        start: "",
        end: "",
        time: [""],
        reminder: true,
        drugId: drugId,
      });

      if (error) {
        toast.error(
          "Failed to add allergy, Check Internet Connection and Try again!"
        );
        return;
      }

      // dispatch(updateAllergies([...allergies, formData]));
      queryClient.invalidateQueries({ queryKey: ["dashboardData", userId] });
      toast.success(`${drug.toUpperCase()} added successfully!`);

      const { html, subject } = generateDrugAllergyEmail(info[0].name, drug);
      await sendMail(info[0].email, html, subject);

      resetFormData();
      setActiveModal("");
    } catch (error) {
      toast.error(
        "Failed to add allergy, Check Internet Connection and Try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {activeModal === "allergies" && (
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
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-slate-800 flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                Add Allergy
              </h2>
              <button
                onClick={handleClose}
                disabled={loading}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-xl flex items-start gap-3">
                <AlertCircle className="size-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Adding a drug to allergies will prevent it from being added to
                  your medication schedule.
                </p>
              </div>

              <div>
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
                  placeholder="e.g., Penicillin"
                  value={drug}
                  onChange={(e) => setDrug(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-50 dark:disabled:bg-slate-900/50 disabled:cursor-not-allowed text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 bg-white dark:bg-slate-900"
                  autoFocus
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
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
                  "Add to Allergies"
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AllergiesForm;
