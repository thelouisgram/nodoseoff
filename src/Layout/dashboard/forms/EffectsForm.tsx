"use-client";
import Image from "next/image";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { setEffects } from "../../../../store/stateSlice";
import supabase from "../../../../utils/supabase";

interface EffectsFormProps {
  effectsForm: boolean;
  setEffectsForm: Function;
}

interface FormErrors {
  [key: string]: string;
}

const EffectsForm: React.FC<EffectsFormProps> = ({
  effectsForm,
  setEffectsForm,
}) => {
  const { effects, userId } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    effect: "",
    severity: "mild",
    date: new Date().toISOString().substr(0, 10),
  });

  const [formErrors, setFormErrors] = useState({
    effect: "",
    severity: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.toLowerCase(),
    });
  };

  const handleEffectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData({ ...formData, severity: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const errors: FormErrors = {
      effect: formData.effect ? "" : "Please fill in the Side Effect field.",
      severity: formData.severity
        ? ""
        : "Please select a Side Effect severity.",
      date: formData.date ? "" : "Please select a Date.",
    };

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

    try {
      const { error } = await supabase.from("effects").insert({
        userId: userId,
        effect: formData.effect,
        severity: formData.severity,
        date: formData.date,
      });

      if (error) {
        console.error("Failed to add effect", error);
        return;
      }

      dispatch(setEffects([...effects, formData]));
      toast.success(`${formData.effect.toUpperCase()}  added successfully`);
      setLoading(false);
      setFormData({
        effect: "",
        severity: "mild",
        date: new Date().toISOString().substr(0, 10),
      });
      setFormErrors({ effect: "", severity: "", date: "" });
      setEffectsForm(false);
    } catch (error) {
      console.error("Error adding effect:", error);
    }
  };

  const handleClick = () => {
    const syntheticEvent = new Event(
      "submit"
    ) as unknown as FormEvent<HTMLFormElement>;
    handleSubmit(syntheticEvent);
  };

  useEffect(() => {
    const formElement = document.getElementById("top-effects");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [effectsForm]);

  return (
    <div
      className={`${
        effectsForm ? "w-full min-h-[100dvh] h-full" : "w-0 h-0"
      } left-0 bg-none fixed z-[2]`}
    >
      <div
        className={`${
          effectsForm
            ? "left-0 ss:w-[450px] h-full"
            : "-left-[450px] ss:w-[450px] h-full"
        } transition duration-300 absolute  bg-white h-full w-full z-[4] `}
      >
        <div
          className={`h-full flex flex-col w-full justify-between gap-8 p-8 pt-0 overflow-y-scroll bg-white`}
        >
          <div className="w-full bg-white">
            <div className="w-full flex justify-end mb-10">
              <Image
                src="/assets/x (1).png"
                width={18}
                height={18}
                quality={100}
                alt="cancel"
                onClick={() => {
                  setEffectsForm(false);
                }}
                id="top-effects"
                className="cursor-pointer pt-8"
              />
            </div>
            <h1 className="text-[24px] text-blue-700 font-bold">
              Add Side Effect
            </h1>
            <p className="text-[14px] mb-10 text-grey">
              To ensure adequate monitoring of adverse effects.
            </p>
            <form
              onSubmit={handleSubmit}
              className="h-auto min-h-[300px] relative flex flex-col w-auto"
            >
              <div className="flex flex-col mb-8">
                <label
                  htmlFor="effect"
                  className="text-[14px] mb-1 font-semibold text-navyBlue"
                >
                  Side Effect
                </label>
                <input
                  type="text"
                  id="effect"
                  name="effect"
                  value={formData.effect}
                  onChange={handleInputChange}
                  className="border bg-[#EDF2F7] border-none outline-none rounded-[10px] p-4 capitalize h-[56px]"
                  placeholder="Side Effect"
                />
              </div>
              <div className="flex flex-col mb-8">
                <label
                  htmlFor="severity"
                  className="text-[14px] mb-1 font-semibold text-navyBlue"
                >
                  Select Side Effect severity
                </label>
                <select
                  id="severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleEffectChange}
                  className=" bg-[#EDF2F7] border-none w-full outline-none p-4 cursor-pointer h-[56px]"
                >
                  <option value="mild">Mild</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>
              <div className="flex flex-col w-full">
                <label
                  htmlFor="end"
                  className="text-[14px] mb-1 font-semibold text-navyBlue"
                >
                  Select Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="border border-none bg-[#EDF2F7] outline-none rounded-[10px] p-4 w-full h-[56px]"
                />
              </div>
            </form>
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
          setEffectsForm(false);
        }}
        className="absolute w-full h-full bg-grey z-[3]"
      />
    </div>
  );
};

export default EffectsForm;
