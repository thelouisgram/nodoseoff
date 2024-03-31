/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useRef,
  useEffect,
  useState,
  FormEvent,
  ChangeEvent,
} from "react";
import Image from "next/image";
import { RootState } from "../../../../store";
import { useSelector, useDispatch } from "react-redux";
import supabase from "../../../../utils/supabaseClient";
import { toast } from "sonner";
import { updateInfo } from "../../../../store/stateSlice";
import { Info } from "../../../../utils/store";

type RefObject<T> = React.RefObject<T>;

interface DrugHxFormProps {
  setDrugHxForm: Function;
  drugHxForm: boolean;
  info: Info[]
}

const DrugHxForm: React.FC<DrugHxFormProps> = ({
  drugHxForm,
  setDrugHxForm,
  info
}) => {
  const { userId } = useSelector((state: RootState) => state.app);
  const { name, phone, email, role, otcDrugs, herbs } = info[0];
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: name,
    phone: phone,
    email: email,
    role: role,
    otcDrugs: otcDrugs,
    herbs: herbs,
  });

  const dropdownRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent): void => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDrugHxForm(false);
    }
  };
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      handleClickOutside(event);
    };

    // add event listener for clicks outside of dropdown
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      // remove event listener when component unmounts
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSelectChange =
    (fieldName: string) => (e: ChangeEvent<HTMLSelectElement>) => {
      const { value } = e.target;
      setFormData({ ...formData, [fieldName]: value });
    };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from("users")
        .update({
          otcDrugs: formData.otcDrugs,
          herbs: formData.herbs,
        })
        .eq("userId", userId);

      if (error) {
        console.error("Failed to update profile", error);
        return;
      }

      dispatch(updateInfo([formData]));
      setDrugHxForm(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating Profile:", error);
    }
  };

  return (
    <div
      className={` ${
        drugHxForm ? "w-full h-[100dvh] over" : "w-0 h-0"
      } right-0 bg-none fixed z-[32]`}
    >
      <div
        ref={dropdownRef}
        className={` ${
          drugHxForm
            ? "right-0 ss:w-[450px] h-full"
            : "-right-[450px] ss:w-[450px] h-full"
        } transition-all duration-300 absolute w-full bg-white h-full z-[4] `}
      >
        <div className={`h-[100dvh] w-full bg-white p-8 overflow-y-scroll text-blackII`}>
          <div className="w-full flex justify-end mb-10">
            <Image
              src="/assets/x (1).png"
              width={18}
              height={18}
              alt="cancel"
              onClick={() => {
                setDrugHxForm(false);
              }}
              className="cursor-pointer"
            />
          </div>
          <div className="mb-10">
            <h1 className="text-[24px] text-darkBlue font-bold">
              Drug History
            </h1>
          </div>
          <form
            onSubmit={handleSubmit}
            className="h-auto flex flex-col justify-between w-full"
          >
            <div className="w-full">
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="name"
                  className="text-[14px] mb-1 font-semibold text-navyBlue"
                >
                  Over the Counter Drugs
                </label>
                <div className="bg-[#EDF2F7] outline-none rounded-[10px] w-full px-4 mb-4 h-[56px]">
                  <select
                    id="otcDrugs"
                    name="otcDrugs"
                    value={formData.otcDrugs}
                    onChange={handleSelectChange("otcDrugs")}
                    className=" bg-[#EDF2F7] border-none w-full outline-none py-4 cursor-pointer h-[56px]"
                  >
                    <option value="">--</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="w-full">
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="name"
                  className="text-[14px] mb-1 font-semibold text-navyBlue"
                >
                  Herbs and Concoctions
                </label>
                <div className="bg-[#EDF2F7] outline-none rounded-[10px] w-full px-4 mb-4 h-[56px]">
                  <select
                    id="herbs"
                    name="herbs"
                    value={formData.herbs}
                    onChange={handleSelectChange("herbs")}
                    className=" bg-[#EDF2F7] border-none w-full outline-none py-4 cursor-pointer h-[56px]"
                  >
                    <option value="">--</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="mt-8 font-semibold bg-darkBlue text-white rounded-[10px] w-full text-center py-4  px-4 hover:bg-navyBlue transition duration-300"
            >
              UPDATE PROFILE
            </button>
          </form>
        </div>
      </div>
      <div
        onClick={() => {
          setDrugHxForm(false);
        }}
        className="absolute w-full h-full bg-blackII opacity-[40] z-[3]"
      />
    </div>
  );
};

export default DrugHxForm;
