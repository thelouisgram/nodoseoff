/* eslint-disable react-hooks/exhaustive-deps */
import React, { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";
import { createClient } from "../../../../../lib/supabase/client";
import { ChevronLeft, X, Lock, Loader2 } from "lucide-react";

interface ChangePasswordProps {
  setActiveModal: (value: string) => void;
  activeModal: string;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
  setActiveModal,
  activeModal,
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const supabase = createClient();

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleClose = () => {
    if (!loading) {
      setActiveModal("");
      setPassword("");
      setConfirmPassword("");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 6) {
      setErrorMessage(
        "Please enter a password that is at least 6 characters long."
      );
      return;
    }

    if (!password || !confirmPassword) {
      setErrorMessage("Please fill in both password fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setErrorMessage(`Error updating password: ${error.message}`);
      } else {
        toast.success("Password updated successfully!");
        setPassword("");
        setConfirmPassword("");
        setActiveModal("");
      }
    } catch (error) {
      setErrorMessage(`Error updating password: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  if (activeModal !== "changePassword") return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-[100] transition-opacity duration-300"
      onClick={handleClose}
    >
      {/* Sliding panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          activeModal === "changePassword" ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 w-full ss:w-[450px] bg-white h-full p-8 pt-0 overflow-y-scroll flex flex-col`}
      >
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-10 pt-8">
          <button
            onClick={() => setActiveModal("accountSettings")}
            disabled={loading}
            className="flex gap-2 items-center text-navyBlue font-Inter text-[14px] font-medium hover:text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="size-5" strokeWidth={2} />
            Back
          </button>
          <button
            onClick={handleClose}
            disabled={loading}
            className="cursor-pointer hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="size-6 text-gray-800" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-[24px] font-bold text-blue-700 flex items-center gap-3">
              <Lock className="size-6" strokeWidth={2} />
              Reset Password
            </h1>
            <p className="text-[14px] text-grey font-Inter">
              Please enter your new password
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-[14px] font-Inter font-medium text-navyBlue"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              disabled={loading}
              className="p-4 rounded-[10px] bg-[#EDF2F7] border-none outline-none font-Inter text-[14px] focus:ring-2 focus:ring-blue-700 disabled:opacity-50"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="confirmPassword"
              className="text-[14px] font-Inter font-medium text-navyBlue"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm new password"
              disabled={loading}
              className="p-4 rounded-[10px] bg-[#EDF2F7] border-none outline-none font-Inter text-[14px] focus:ring-2 focus:ring-blue-700 disabled:opacity-50"
              required
            />
          </div>

          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-[10px]">
              <p className="text-red-600 font-Inter font-medium text-[14px]">
                {errorMessage}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-[56px] rounded-[10px] text-white font-Inter font-semibold text-[16px] flex items-center justify-center transition-all ${
              loading
                ? "bg-blue-700 opacity-75 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="size-5 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Change Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;