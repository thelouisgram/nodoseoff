import React, { useState, FormEvent, ChangeEvent } from "react";
import { toast } from "sonner";
import {
  useOtcDrugs,
  useHerbs,
  useUpdateDrugHistoryMutation,
} from "@/hooks/useDashboardData";
import { X, Loader2 } from "lucide-react";
import { useAppSelector } from "@/store";

interface DrugHxFormProps {
  setActiveModal: (value: string) => void;
  activeModal: string;
}

const DrugHxForm: React.FC<DrugHxFormProps> = ({
  activeModal,
  setActiveModal,
}) => {
  const { userId } = useAppSelector((state) => state.app);
  const { data: otcDrugs = "" } = useOtcDrugs(userId);
  const { data: herbs = "" } = useHerbs(userId);

  const updateDrugHistoryMutation = useUpdateDrugHistoryMutation();

  const [formData, setFormData] = useState({
    otcDrugs: typeof otcDrugs === "string" ? otcDrugs : "",
    herbs: typeof herbs === "string" ? herbs : "",
  });

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
      await updateDrugHistoryMutation.mutateAsync({
        userId: userId!,
        otcDrugs: formData.otcDrugs,
        herbs: formData.herbs,
      });

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
      onClick={handleClose}
      className="fixed inset-0 bg-soft-ink/25 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          activeModal === "drugHx"
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0"
        } w-full max-w-md rounded-2xl border border-black/[0.05] bg-white shadow-soft-md transition-all duration-200`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.04]">
          <h2 className="text-xl font-semibold text-soft-ink ">
            Drug History
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-1.5 text-soft-muted hover:text-soft-ink hover:bg-soft-canvas rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Over the Counter Drugs */}
          <div>
            <label
              htmlFor="otcDrugs"
              className="block text-sm font-medium text-soft-ink  mb-2"
            >
              Over the Counter Drugs
            </label>
            <div className="w-full h-[47px] px-4 border border-black/[0.06] rounded-soft-sm focus-within:ring-4 focus-within:ring-soft-ink/[0.04] transition-shadow bg-white flex items-center">
              <select
                id="otcDrugs"
                name="otcDrugs"
                value={formData.otcDrugs !== null ? formData.otcDrugs : ""}
                onChange={handleSelectChange("otcDrugs")}
                disabled={loading}
                className="w-full h-full bg-transparent border-none outline-none p-0 text-soft-ink cursor-pointer"
              >
                <option value="" className="">
                  Select option
                </option>
                <option value="yes" className="">
                  Yes
                </option>
                <option value="no" className="">
                  No
                </option>
              </select>
            </div>
          </div>

          {/* Herbs and Concoctions */}
          <div>
            <label
              htmlFor="herbs"
              className="block text-sm font-medium text-soft-ink  mb-2"
            >
              Herbs and Concoctions
            </label>
            <div className="w-full h-[47px] px-4 border border-black/[0.06] rounded-soft-sm focus-within:ring-4 focus-within:ring-soft-ink/[0.04] transition-shadow bg-white flex items-center">
              <select
                id="herbs"
                name="herbs"
                value={formData.herbs !== null ? formData.herbs : ""}
                onChange={handleSelectChange("herbs")}
                disabled={loading}
                className="w-full h-full bg-transparent border-none outline-none p-0 text-soft-ink cursor-pointer"
              >
                <option value="" className="">
                  Select option
                </option>
                <option value="yes" className="">
                  Yes
                </option>
                <option value="no" className="">
                  No
                </option>
              </select>
            </div>
          </div>
        </form>

        {/* Footer with Submit Button */}
        <div className="px-6 py-4 border-t border-black/[0.04]">
          <button
            onClick={handleClick}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-soft-md font-semibold text-white transition-all flex items-center justify-center gap-2 ${
              loading
                ? "bg-soft-primary/50 cursor-not-allowed"
                : "bg-soft-primary hover:bg-soft-primary/90 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              "Update Profile"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrugHxForm;
