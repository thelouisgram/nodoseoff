"use-client";
import Image from "next/image";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { setEffects } from "../../../store/stateSlice";

interface EffectsFormProps {
  effectsForm: boolean;
  setEffectsForm: Function;
}

const EffectsForm: React.FC<EffectsFormProps> = ({
  effectsForm,
  setEffectsForm,
}) => {
  const { effects } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    effect: "",
    threshold: "mild",
    date: new Date().toISOString().substr(0, 10),
  });

  const [formErrors, setFormErrors] = useState({
    effect: "",
    threshold: "",
    date: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.toLowerCase(),
    });
  };

  const handleEffectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData({ ...formData, threshold: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors: any = {
      effect: formData.effect ? "" : "Please fill in the Side Effect field.",
      threshold: formData.threshold
        ? ""
        : "Please select a Side Effect Threshold.",
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
    dispatch(setEffects([...effects, formData]));
    toast.success(
      formData.effect.toUpperCase() + " has been added successfully"
    );
    setFormData({
      effect: "",
      threshold: "mild",
      date: new Date().toISOString().substr(0, 10),
    });
    setFormErrors({ effect: "", threshold: "", date: "" });
    setEffectsForm(false);
  };

  return (
    <div
      className={` ${
        effectsForm ? "w-full min-h-[100dvh] h-full" : "w-0 h-0"
      } left-0 bg-none fixed z-[2]`}
    >
      <div
        className={` ${
          effectsForm
            ? "left-0 ss:w-[450px] h-full"
            : "-left-[450px] ss:w-[450px] h-full"
        } transition-all duration-300 absolute  bg-white h-full w-full z-[4] `}
      >
        <div className={` h-[100dvh] w-full bg-white p-8`}>
          <div className="w-full flex justify-end mb-10">
            <Image
              src="/assets/x (1).png"
              width={24}
              height={24}
              quality={100}
              alt="cancel"
              onClick={() => {
                setEffectsForm(false);
              }}
              className="cursor-pointer"
            />
          </div>
          <div className="mb-10">
            <h1 className="text-[24px] text-darkBlue font-bold">
              Add Side Effect
            </h1>
            <p className="text-[14px] text-[#718096]">
              To ensure adequate monitoring of adverse effects.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="h-auto flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col mb-4">
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
                  className="border bg-[#EDF2F7] border-none outline-none rounded-md p-4 mb-4 capitalize"
                  placeholder="Side Effect"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="threshold"
                  className="text-[14px] mb-1 font-semibold text-navyBlue"
                >
                  Select Side Effect Threshold
                </label>
                <div className="bg-[#EDF2F7] outline-none rounded-md w-full px-4 mb-4">
                  <select
                    id="threshold"
                    name="threshold"
                    value={formData.threshold}
                    onChange={handleEffectChange}
                    className=" bg-[#EDF2F7] border-none w-full outline-none py-4 cursor-pointer"
                  >
                    <option value="mild">Mild</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col mb-8 w-full">
                <label
                  htmlFor="end"
                  className="text-[14px] mb-1 font-semibold text-navyBlue"
                >
                  Select Date
                </label>
                <div className="w-full bg-[#EDF2F7] pr-4  rounded-md">
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="border border-none bg-[#EDF2F7] outline-none rounded-md p-4 pr-0 w-full"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 font-semibold bg-darkBlue text-white rounded-[10px] w-full text-center py-4 rounded-bl-none px-4 hover:bg-navyBlue transition duration-300"
            >
              PROCEED
            </button>
          </form>
        </div>
      </div>
      <div
        onClick={() => {
          setEffectsForm(false);
        }}
        className="absolute w-full h-full bg-blackII z-[3]"
      />
    </div>
  );
};

export default EffectsForm;
