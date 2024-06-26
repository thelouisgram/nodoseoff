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
import supabase from "../../../../utils/supabase";
import { toast } from "sonner";
import { updateInfo } from "../../../../store/stateSlice";

interface DrugHxFormProps {
  setDrugHxForm: Function;
  drugHxForm: boolean;
}

const DrugHxForm: React.FC<DrugHxFormProps> = ({
  drugHxForm,
  setDrugHxForm,
}) => {
  const { info, userId } = useSelector((state: RootState) => state.app);
  const { name, phone, email, otcDrugs, herbs } = info[0];
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: name || "",
    phone: phone || "",
    email: email || "",
    otcDrugs: otcDrugs || "",
    herbs: herbs || "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const formElement = document.getElementById("top-drugHx");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [drugHxForm]);

  const handleClick = () => {
    const syntheticEvent = new Event(
      "submit"
    ) as unknown as FormEvent<HTMLFormElement>;
    handleSubmit(syntheticEvent);
  };

  const handleSelectChange =
    (fieldName: string) => (e: ChangeEvent<HTMLSelectElement>) => {
      const { value } = e.target;
      setFormData({ ...formData, [fieldName]: value });
    };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({
          otcDrugs: formData.otcDrugs,
          herbs: formData.herbs,
        })
        .eq("userId", userId);

      if (error) {
        toast.error(
          "Failed to update profile, Check Internet Connection and Try again!"
        );
        setLoading(false);
        return;
      }

      dispatch(updateInfo([formData]));
      setDrugHxForm(false);
      setLoading(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(
        "Failed to update profile, Check Internet Connection and Try again!"
      );
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        drugHxForm ? "w-full " : "w-0"
      } right-0 bg-none fixed z-[2] h-[100dvh]`}
    >
      <div
        className={`${
          drugHxForm ? "right-0 ss:w-[450px]" : "-right-[450px] ss:w-[450px]"
        } transition-all duration-300 absolute w-full bg-white h-full z-[4]`}
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
                alt="cancel"
                onClick={() => setDrugHxForm(false)}
                id="top-drugHx"
                className="cursor-pointer pt-8"
              />
            </div>
            <div className="mb-10">
              <h1 className="text-[24px] text-blue-700 font-bold">
                Drug History
              </h1>
            </div>
            <form
              onSubmit={handleSubmit}
              className="h-auto flex flex-col justify-between w-full"
            >
              <div className="w-full">
                <div className="flex flex-col mb-8">
                  <label
                    htmlFor="name"
                    className="text-[14px] mb-1 font-semibold text-navyBlue"
                  >
                    Over the Counter Drugs
                  </label>
                  <select
                    id="otcDrugs"
                    name="otcDrugs"
                    value={formData.otcDrugs !== null ? formData.otcDrugs : ""}
                    onChange={handleSelectChange("otcDrugs")}
                    className=" bg-[#EDF2F7] border-none w-full outline-none p-4 cursor-pointer h-[56px] rounded-[10px]"
                  >
                    <option value="">--</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
              <div className="w-full">
                <div className="flex flex-col mb-8">
                  <label
                    htmlFor="name"
                    className="text-[14px] mb-1 font-semibold text-navyBlue"
                  >
                    Herbs and Concoctions
                  </label>
                  <select
                    id="herbs"
                    name="herbs"
                    value={formData.herbs !== null ? formData.herbs : ""}
                    onChange={handleSelectChange("herbs")}
                    className="bg-[#EDF2F7] border-none w-full outline-none p-4 cursor-pointer h-[56px] rounded-[10px]"
                  >
                    <option value="">--</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
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
              <div className="h-14 flex items-center">UPDATE PROFILE</div>
            )}
          </button>
        </div>
      </div>
      <div
        onClick={() => {
          setDrugHxForm(false);
        }}
        className="absolute w-full h-full bg-grey opacity-[40] z-[3]"
      />
    </div>
  );
};

export default DrugHxForm;