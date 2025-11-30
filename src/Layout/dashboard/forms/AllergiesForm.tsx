import React, { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "../../../../store";
import { updateAllergies } from "../../../../store/stateSlice";
import { createClient } from "../../../../lib/supabase/client";
import { generateDrugAllergyEmail } from "../../../../emails/drugAllergy";
import { sendMail } from "../../../../utils/sendEmail";
import { X, Loader2, ShieldOff } from "lucide-react";

interface AllergiesFormProps {
  setActiveModal: (value: string) => void;
  activeModal: string;
}

interface FormErrors {
  [key: string]: string;
}

const AllergiesForm: React.FC<AllergiesFormProps> = ({
  activeModal,
  setActiveModal,
}) => {
  const { allergies, userId, info } = useSelector(
    (state: RootState) => state.app
  );
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
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-start z-[100] transition-opacity duration-300"
      onClick={handleClose}
    >
      {/* Sliding panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          activeModal === "allergies" ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 w-full ss:w-[450px] bg-white h-full`}
      >
        <div className="h-full flex flex-col w-full justify-between gap-8 p-8 pt-0 overflow-y-scroll bg-white">
          <div className="w-full">
            {/* Header */}
            <div className="w-full flex justify-end mb-10">
              <button
                onClick={handleClose}
                disabled={loading}
                className="cursor-pointer pt-8 hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="size-6 text-gray-800" />
              </button>
            </div>

            {/* Title */}
            <div className="mb-10">
              <h1 className="text-[24px] text-blue-600 font-bold flex items-center gap-2">
                Add Drug Allergies
              </h1>
              <p className="text-[14px] text-grey font-Inter">
                To ensure adequate monitoring of Allergies.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="h-auto relative flex flex-col">
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="drugAllergy"
                  className="text-[14px] mb-2 font-semibold text-navyBlue font-Inter"
                >
                  Drug Name
                </label>
                <input
                  type="text"
                  id="drugAllergy"
                  name="drug"
                  value={formData.drug}
                  onChange={handleInputChange}
                  className="border bg-[#EDF2F7] border-none outline-none rounded-[10px] p-4 capitalize h-[56px] font-Inter text-[14px] focus:ring-2 focus:ring-blue-700"
                  placeholder="Enter drug name"
                  disabled={loading}
                  required
                />
              </div>
            </form>
          </div>

          {/* Submit Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              const syntheticEvent = new Event("submit") as unknown as FormEvent<HTMLFormElement>;
              handleSubmit(syntheticEvent);
            }}
            disabled={loading}
            className={`font-semibold text-white rounded-[10px] w-full h-14 flex items-center justify-center transition-all ${
              loading
                ? "bg-blue-600 opacity-75 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-800"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="size-5 mr-2 animate-spin" />
              </>
            ) : (
              "Add Allergy"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllergiesForm;