import React, { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "../../../../store";
import { updateAllergies } from "../../../../store/stateSlice";
import { createClient } from "../../../../lib/supabase/client";
import { generateDrugAllergyEmail } from "../../../../emails/drugAllergy";
import { sendMail } from "../../../../utils/sendEmail";
import { X, Loader2 } from "lucide-react";
import { useAppStore } from "../../../../store/useAppStore";
import { generateDrugId } from "../../../../utils/drugs";

interface AllergiesFormProps {
  setActiveModal: (value: string) => void;
  activeModal: string;
}

const AllergiesForm: React.FC<AllergiesFormProps> = ({
  activeModal,
  setActiveModal,
}) => {
  const { allergies, info } = useSelector((state: RootState) => state.app);
  const { userId } = useAppStore((state) => state);
  const dispatch = useDispatch();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    drug: "",
    frequency: "",
    route: "",
    start: "",
    end: "",
    time: [""],
    reminder: true,
    drugId: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.toLowerCase(),
    });
  };

  const resetFormData = () => {
    setFormData({
      drug: "",
      frequency: "",
      route: "",
      start: "",
      end: "",
      time: [""],
      reminder: true,
      drugId: "",
    });
  };

  const handleClose = () => {
    if (!loading) {
      setActiveModal("");
      resetFormData();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const drugId = generateDrugId(formData.drug);

    if (!formData.drug) {
      toast.error("Please fill in the Drug field.");
      return;
    }

    const drugAlreadyExists = allergies.some(
      (item) => item.drug.toLowerCase() === formData.drug.toLowerCase()
    );

    if (drugAlreadyExists) {
      toast.error(`'${formData.drug}' already exists!`);
      resetFormData();
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("allergies").insert({
        userId: userId,
        drug: formData.drug,
        frequency: "",
        route: "",
        start: "",
        end: "",
        time: [""],
        reminder: true,
        drugId: formData.drugId
      });

      if (error) {
        toast.error(
          "Failed to add allergy, Check Internet Connection and Try again!"
        );
        return;
      }

      dispatch(updateAllergies([...allergies, formData]));
      toast.success(`${formData.drug.toUpperCase()} added successfully!`);

      const { html, subject } = generateDrugAllergyEmail(
        info[0].name,
        formData.drug
      );
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

  if (activeModal !== "allergies") return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          activeModal === "allergies"
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0"
        } transition-all duration-200 w-full max-w-md bg-white rounded-2xl shadow-2xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Add Drug Allergy
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Input Field */}
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
              placeholder="e.g., Penicillin"
              value={formData.drug}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-900 placeholder-gray-400"
              autoComplete="off"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
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
              "Add Allergy"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AllergiesForm;