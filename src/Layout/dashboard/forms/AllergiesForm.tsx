import Image from "next/image";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "../../../../store";
import { updateAllergies } from "../../../../store/stateSlice";
import supabase from "../../../../utils/supabase";
import { generateDrugAllergyEmail } from "../../../../emails/drugAllergy";
import { sendMail } from "../../../../utils/sendEmail";

interface AllergiesFormProps {
  allergiesForm: boolean;
  setAllergiesForm: Function;
}

interface FormErrors {
  [key: string]: string;
}

const AllergiesForm: React.FC<AllergiesFormProps> = ({
  allergiesForm,
  setAllergiesForm,
}) => {
  // Getting data from Global State
  const { allergies, userId, info } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();
  // Allergic Drug form
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

  // Ensure top of form in frame on opening
  useEffect(() => {
    const formElement = document.getElementById("top-allergies");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [allergiesForm]);

  // Error State
  const [formErrors, setFormErrors] = useState({
    drug: "",
  });

  // Handle Form Input
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.toLowerCase(),
    });
  };

  // Empty Form after success/failure
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

  // Loading state
  const [loading, setLoading] = useState(false);

  // Submit Form Function
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: FormErrors = {
      allergy: formData.drug ? "" : "Please fill in the Drug field.",
    };

    // Preventing adding an already existing allergy
    const drugAlreadyExists = allergies.some(
      (item) => item.drug.toLowerCase() === formData.drug.toLowerCase()
    );

    if (drugAlreadyExists) {
      toast.error(`'${formData.drug}' already exists!`);
      resetFormData();
      return;
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
    // Show loading toast while uploading the schedule
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
        setLoading(false);
        return;
      }

      // Update Global State of New Drug
      dispatch(updateAllergies([...allergies, formData]));
      // Success Notification
      toast.success(`${formData.drug.toUpperCase()}  added successfully!`);

      // Send Drug Allergy Email Function
      const { html, subject } = generateDrugAllergyEmail(
              info[0].name,
              formData.drug,
            );
      await sendMail(info[0].email, html, subject);
           
      // Reset Form
      resetFormData;

      // Reset Error State
      setFormErrors({ drug: "" });
      // Close Allergies Form
      setAllergiesForm(false);
      // Stop loading
      setLoading(false);
    } catch (error) {
      toast.error(
        "Failed to add allergy, Check Internet Connection and Try again!"
      );
      setLoading(false);
    }
  };

  // Submit Function
  const handleClick = () => {
    const syntheticEvent = new Event(
      "submit"
    ) as unknown as FormEvent<HTMLFormElement>;
    handleSubmit(syntheticEvent);
  };

  return (
    <div
      className={`${
        allergiesForm ? "w-full " : "w-0"
      } left-0 bg-none fixed z-[2] h-[100dvh]`}
    >
      <div
        className={`${
          allergiesForm ? "left-0 ss:w-[450px]" : "-left-[450px] ss:w-[450px] "
        } duration-300 absolute w-full bg-white h-full z-[4] transition-all`}
      >
        <div
          className={`h-full flex flex-col w-full justify-between gap-8 p-8 pt-0 overflow-y-scroll bg-white`}
        >
          <div className="w-full">
            <div className="w-full flex justify-end mb-10">
              <Image
                src="/assets/x (1).png"
                width={18}
                height={18}
                quality={100}
                alt="cancel"
                onClick={() => {
                  setAllergiesForm(false);
                }}
                id="top-allergies"
                className="cursor-pointer pt-8"
              />
            </div>
            <div className="mb-10">
              <h1 className="text-[24px] text-blue-700 font-bold">
                Add Drug Allergies
              </h1>
              <p className="text-[14px] text-grey">
                To ensure adequate monitoring of Allergies.
              </p>
            </div>
            <div>
              <form
                onSubmit={handleSubmit}
                className="h-auto md:h-full relative flex flex-col justify-between w-auto "
              >
                <div className="flex flex-col mb-4">
                  <label
                    htmlFor="drugAllergy"
                    className="text-[14px] mb-1 font-semibold text-navyBlue"
                  >
                    Drug
                  </label>
                  <input
                    type="text"
                    id="drugAllergy"
                    name="drug"
                    value={formData.drug}
                    onChange={handleInputChange}
                    className="border bg-[#EDF2F7] border-none outline-none rounded-[10px] p-4 mb-4 capitalize h-[56px]"
                    placeholder="Drug Allergy"
                  />
                </div>
              </form>
            </div>
          </div>
          <button
            onClick={handleClick}
            disabled={loading}
            className={`font-semibold text-white rounded-[10px] w-full items-center 
              justify-center flex transition duration-300 ${
                loading ? "bg-navyBlue opacity-85" : "bg-blue-700 h-14"
              }`}
          >
            {loading ? (
              <div className=" h-14 flex items-center">
                <div className="loaderInfinity" />
              </div>
            ) : (
              <div className="h-14 flex items-center">PROCEED</div>
            )}
          </button>
        </div>
      </div>
      <div
        onClick={() => {
          setAllergiesForm(false);
        }}
        className="absolute w-full h-full bg-grey z-[3]"
      />
    </div>
  );
};

export default AllergiesForm;
