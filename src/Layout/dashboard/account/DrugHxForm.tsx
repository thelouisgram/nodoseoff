import React, {
  useState,
  FormEvent,
  ChangeEvent,
} from "react";
import { RootState } from "../../../../store";
import { useSelector, useDispatch } from "react-redux";
import { createClient } from "../../../../lib/supabase/client";
import { toast } from "sonner";
import { updateHerbs, updateOtcDrugs } from "../../../../store/stateSlice";
import { X, Loader2 } from "lucide-react";

interface DrugHxFormProps {
  setActiveModal: (value: string) => void;
  activeModal: string;
}

const DrugHxForm: React.FC<DrugHxFormProps> = ({
  activeModal,
  setActiveModal,
}) => {
  const { userId, otcDrugs, herbs } = useSelector(
    (state: RootState) => state.app
  );
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    otcDrugs: typeof otcDrugs === "string" ? otcDrugs : "",
    herbs: typeof herbs === "string" ? herbs : "",
  });

  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleSelectChange =
    (fieldName: string) => (e: ChangeEvent<HTMLSelectElement>) => {
      const { value } = e.target;
      setFormData({ ...formData, [fieldName]: value });
    };

  const handleClose = () => {
    if (!loading) {
      setActiveModal("");
      setFormData({
        otcDrugs: typeof otcDrugs === "string" ? otcDrugs : "",
        herbs: typeof herbs === "string" ? herbs : "",
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("drugHistory")
        .update({
          otcDrugs: formData.otcDrugs,
          herbs: formData.herbs,
        })
        .eq("userId", userId);

      if (error) {
        toast.error(
          "Failed to update profile, Check Internet Connection and Try again!"
        );
        return;
      }

      dispatch(updateHerbs(formData.herbs));
      dispatch(updateOtcDrugs(formData.otcDrugs));
      setActiveModal("");
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(
        "Failed to update profile, Check Internet Connection and Try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    const syntheticEvent = new Event(
      "submit"
    ) as unknown as FormEvent<HTMLFormElement>;
    handleSubmit(syntheticEvent);
  };

  if (activeModal !== "drugHx") return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-[100] transition-opacity duration-300"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          activeModal === "drugHx" ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 w-full ss:w-[450px] bg-white h-full`}
      >
        <div
          className={`h-full flex flex-col w-full justify-between gap-8 p-8 pt-0 overflow-y-scroll bg-white`}
        >
          <div className="w-full">
            <div className="w-full flex justify-end mb-10">
              <button
                onClick={handleClose}
                disabled={loading}
                id="top-drugHx"
                className="cursor-pointer pt-8 hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="size-6 text-gray-800" />
              </button>
            </div>
            <div className="mb-10">
              <h1 className="text-[24px] text-blue-600 font-bold">
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
                    htmlFor="otcDrugs"
                    className="text-[14px] mb-1 font-semibold text-navyBlue"
                  >
                    Over the Counter Drugs
                  </label>
                  <select
                    id="otcDrugs"
                    name="otcDrugs"
                    value={formData.otcDrugs !== null ? formData.otcDrugs : ""}
                    onChange={handleSelectChange("otcDrugs")}
                    disabled={loading}
                    className="bg-[#EDF2F7] border-none w-full outline-none p-4 cursor-pointer h-[56px] rounded-[10px] disabled:opacity-50"
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
                    htmlFor="herbs"
                    className="text-[14px] mb-1 font-semibold text-navyBlue"
                  >
                    Herbs and Concoctions
                  </label>
                  <select
                    id="herbs"
                    name="herbs"
                    value={formData.herbs !== null ? formData.herbs : ""}
                    onChange={handleSelectChange("herbs")}
                    disabled={loading}
                    className="bg-[#EDF2F7] border-none w-full outline-none p-4 cursor-pointer h-[56px] rounded-[10px] disabled:opacity-50"
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
                loading ? "bg-navyBlue opacity-85" : "bg-blue-600 h-14"
              }`}
          >
            {loading ? (
              <div className="h-14 flex items-center">
                <Loader2 className="size-5 animate-spin" />
              </div>
            ) : (
              <div className="h-14 flex items-center">UPDATE PROFILE</div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrugHxForm;