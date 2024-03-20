import Image from "next/image";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "../../../../store";
import { updateAllergies } from "../../../../store/stateSlice";
import supabase from "../../../../utils/supabaseClient";

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
  const { allergies, userId } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    drug: "",
    frequency: "",
    route: "",
    start: '',
    end: "",
    time: [""],
    reminder: true,
  });

  const [formErrors, setFormErrors] = useState({
    drug: "",
  });

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
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: FormErrors = {
      allergy: formData.drug ? "" : "Please fill in the Drug field.",
    };

    const drugAlreadyExists = allergies.some(
      (item) =>
        item.drug.toLowerCase() === formData.drug.toLowerCase()
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
    toast.loading("Adding Drug Allergy", { duration: 2000 });

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
        console.error("Failed to add allergy", error);
        return;
      }

      dispatch(updateAllergies([...allergies, formData]));
      toast.success(`'${formData.drug}' has been added successfully`);
      setFormData({
        drug: "",
        frequency: "",
        route: "",
        start: "",
        end: "",
        time: [""],
        reminder: true,
      });
      setFormErrors({ drug: "" });
      setAllergiesForm(false);
    } catch (error) {
      console.error("Error adding Allergy:", error);
    }
  };

  return (
    <div
      className={`${
        allergiesForm ? "w-full min-h-[100dvh] h-full" : "w-0 h-0"
      } left-0 bg-none fixed z-[2]`}
    >
      <div
        className={`${
          allergiesForm
            ? "left-0 ss:w-[450px] h-full"
            : "-left-[450px] ss:w-[450px] h-full"
        } transition-all duration-300 absolute  bg-white h-full w-full z-[4] `}
      >
        <div className={`h-[100dvh] w-full bg-white p-8 overflow-y-scroll`}>
          <form
            onSubmit={handleSubmit}
            className="h-auto md:h-full relative flex flex-col justify-between w-auto "
          >
            <div>
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
                  className="cursor-pointer"
                />
              </div>
              <div className="mb-10">
                <h1 className="text-[24px] text-darkBlue font-bold">
                  Add Drug Allergies
                </h1>
                <p className="text-[14px] text-[#718096]">
                  To ensure adequate monitoring of Allergies.
                </p>
              </div>
              <div>
                <div className="flex flex-col mb-4">
                  <label
                    htmlFor="drug"
                    className="text-[14px] mb-1 font-semibold text-navyBlue"
                  >
                    Drug
                  </label>
                  <input
                    type="text"
                    id="drug"
                    name="drug"
                    value={formData.drug}
                    onChange={handleInputChange}
                    className="border bg-[#EDF2F7] border-none outline-none rounded-[10px] p-4 mb-4 capitalize h-[56px]"
                    placeholder="Drug Allergy"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 font-semibold relative md:absolute md:top-[90%] bg-darkBlue text-white rounded-[10px] w-full text-center py-4  px-4 hover:bg-navyBlue transition duration-300"
            >
              PROCEED
            </button>
          </form>
        </div>
      </div>
      <div
        onClick={() => {
          setAllergiesForm(false);
        }}
        className="absolute w-full h-full bg-blackII z-[3]"
      />
    </div>
  );
};

export default AllergiesForm;
