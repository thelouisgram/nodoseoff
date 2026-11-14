import React, { FormEvent, useState } from "react";
import { toast } from "sonner";
import {
  useAllergies,
  useUserInfo,
  useAddAllergyMutation,
} from "@/hooks/useDashboardData";
import { X, Loader2, AlertCircle } from "lucide-react";
import { useAppSelector } from "@/store";
import { motion, AnimatePresence } from "framer-motion";
import { sameDrugName } from "@/utils/drugs";
import MedicationPrivacyFields, {
  fileToBase64,
} from "@/features/forms/MedicationPrivacyFields";

interface AllergiesFormProps {
  setActiveModal: (value: string) => void;
  activeModal: string;
}

const AllergiesForm: React.FC<AllergiesFormProps> = ({
  activeModal,
  setActiveModal,
}) => {
  const { userId } = useAppSelector((state) => state.app);
  const { data: allergies = [] } = useAllergies(userId);
  const { data: info = [] } = useUserInfo(userId);

  const addAllergyMutation = useAddAllergyMutation();

  const [drug, setDrug] = useState("");
  const [nickname, setNickname] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const resetFormData = () => {
    setDrug("");
    setNickname("");
    setImageFile(null);
  };

  const handleClose = () => {
    if (!loading) {
      setActiveModal("");
      resetFormData();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Trim and validate drug name
    const trimmedDrug = drug.trim();

    if (!trimmedDrug) {
      toast.error("Please fill in the Drug field.");
      return;
    }

    const drugAlreadyExists = allergies.some((item) =>
      sameDrugName(item.drug, trimmedDrug)
    );

    if (drugAlreadyExists) {
      toast.error(`'${trimmedDrug}' already exists!`);
      resetFormData();
      return;
    }

    setLoading(true);

    try {
      let imageBase64: string | undefined;
      let imageFilename: string | undefined;
      if (imageFile) {
        imageBase64 = await fileToBase64(imageFile);
        imageFilename = imageFile.name;
      }

      await addAllergyMutation.mutateAsync({
        userId: userId!,
        drug: trimmedDrug,
        nickname: nickname.trim(),
        imageBase64,
        imageFilename,
        userInfo: {
          name: info[0]?.name || "",
          email: info[0]?.email || "",
        },
      });

      toast.success(`${trimmedDrug.toUpperCase()} added successfully!`);
      resetFormData();
      setActiveModal("");
    } catch (error) {
      console.error("Error adding allergy:", error);
      toast.error(
        "Failed to add allergy. Please check your connection and try again!"
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
          className="fixed inset-0 bg-soft-ink/25 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-md flex-col rounded-2xl border border-black/[0.05] bg-white shadow-soft-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.04] flex-shrink-0">
              <h2 className="text-xl font-semibold text-soft-ink ">
                Add Allergy
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

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                <AlertCircle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  Adding a drug to allergies will warn you before it can be
                  added to your schedule — you can still override if a clinician
                  needs you on it.
                </p>
              </div>

              <div>
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
                    placeholder="e.g., Penicillin"
                    value={drug}
                    onChange={(e) => setDrug(e.target.value)}
                    disabled={loading}
                    className="w-full h-full bg-transparent border-none outline-none p-0 text-soft-ink  placeholder:text-soft-muted "
                    autoFocus
                  />
                </div>
              </div>

              <MedicationPrivacyFields
                nickname={nickname}
                onNicknameChange={setNickname}
                imageFile={imageFile}
                onImageFileChange={setImageFile}
                disabled={loading}
                compact
              />

              {/* Submit Button */}
              <button
                type="submit"
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
