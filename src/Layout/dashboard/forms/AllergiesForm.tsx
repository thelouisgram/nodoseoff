import Image from "next/image";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "../../../../store";
import { updateAllergies } from "../../../../store/stateSlice";
import { supabase } from "@/pages/supabase";

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
    start: "",
    end: "",
    time: [""],
    reminder: true,
  });

  useEffect(() => {
    const formElement = document.getElementById("top-allergies");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [allergiesForm]);

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

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: FormErrors = {
      allergy: formData.drug ? "" : "Please fill in the Drug field.",
    };

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
        console.error("Failed to add allergy", error);
        return;
      }

      dispatch(updateAllergies([...allergies, formData]));
      toast.success(`${formData.drug.toUpperCase()}  added successfully`);
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
      setLoading(false);
    } catch (error) {
      console.error("Error adding Allergy:", error);
    }
  };

  const handleClick = () => {
    const syntheticEvent = new Event(
      "submit"
    ) as unknown as FormEvent<HTMLFormElement>;
    handleSubmit(syntheticEvent);
  };

  return (
    <div
      className={`${
        allergiesForm ? "w-full h-[100dvh]" : "w-0 h-0"
      } left-0 bg-none fixed z-[2]`}
    >
      <div
        className={`${
          allergiesForm ? "left-0 ss:w-[450px]" : "-left-[450px] ss:w-[450px] "
        } transition duration-300 absolute w-full bg-white h-full z-[4] `}
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
