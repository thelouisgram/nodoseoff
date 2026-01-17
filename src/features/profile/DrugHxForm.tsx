import React, { useState, FormEvent, ChangeEvent } from "react";
import { toast } from "sonner";
import {
  useOtcDrugs,
  useHerbs,
  useUpdateDrugHistoryMutation,
} from "@/hooks/useDashboardData";
import { X, Loader2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

interface DrugHxFormProps {
  setActiveModal: (value: string) => void;
  activeModal: string;
}

const DrugHxForm: React.FC<DrugHxFormProps> = ({
  activeModal,
  setActiveModal,
}) => {
  const { userId } = useAppStore((state) => state);
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
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          activeModal === "drugHx"
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0"
        } transition-all duration-200 w-full max-w-md bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-2xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
            Drug History
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2"
            >
              Over the Counter Drugs
            </label>
            <div className="w-full h-[47px] px-4 border border-gray-300 dark:border-slate-800 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 transition-shadow bg-white dark:bg-slate-900 flex items-center">
              <select
                id="otcDrugs"
                name="otcDrugs"
                value={formData.otcDrugs !== null ? formData.otcDrugs : ""}
                onChange={handleSelectChange("otcDrugs")}
                disabled={loading}
                className="w-full h-full bg-transparent border-none outline-none p-0 text-gray-900 dark:text-gray-100 cursor-pointer dark:[color-scheme:dark]"
              >
                <option value="" className="dark:bg-slate-800">
                  Select option
                </option>
                <option value="yes" className="dark:bg-slate-800">
                  Yes
                </option>
                <option value="no" className="dark:bg-slate-800">
                  No
                </option>
              </select>
            </div>
          </div>

          {/* Herbs and Concoctions */}
          <div>
            <label
              htmlFor="herbs"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Herbs and Concoctions
            </label>
            <div className="w-full h-[47px] px-4 border border-gray-300 dark:border-slate-800 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 transition-shadow bg-white dark:bg-slate-900 flex items-center">
              <select
                id="herbs"
                name="herbs"
                value={formData.herbs !== null ? formData.herbs : ""}
                onChange={handleSelectChange("herbs")}
                disabled={loading}
                className="w-full h-full bg-transparent border-none outline-none p-0 text-gray-900 dark:text-gray-100 cursor-pointer dark:[color-scheme:dark]"
              >
                <option value="" className="dark:bg-slate-800">
                  Select option
                </option>
                <option value="yes" className="dark:bg-slate-800">
                  Yes
                </option>
                <option value="no" className="dark:bg-slate-800">
                  No
                </option>
              </select>
            </div>
          </div>
        </form>

        {/* Footer with Submit Button */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800">
          <button
            onClick={handleClick}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
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
