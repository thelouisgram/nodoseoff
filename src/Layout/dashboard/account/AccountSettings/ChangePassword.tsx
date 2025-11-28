import React, { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";
import { createClient } from "../../../../../lib/supabase/client";
import { ChevronLeft, X } from "lucide-react";

interface ChangePasswordProps {
  setAccountSettings: Function;
  setTab: Function;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
  setAccountSettings,
  setTab,
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

   const supabase = createClient()
  

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check password strength (at least 6 characters)
    if (password.length < 6) {
      setErrorMessage(
        "Please enter a password that is at least 6 characters long."
      );
      return;
    }

    if (!password || !confirmPassword) {
      setErrorMessage("Please fill in both password fields.");
    } else if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
    } else {
      setLoading(true);
      setErrorMessage("");

      try {
        // Update the user's password using the token
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
          setErrorMessage(`Error updating password: ${error.message}`);
        } else {
          toast.success("Password updated successfully!");
          setTab("default");
        }
      } catch (error) {
        setErrorMessage(`Error updating password: ${error}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClick = () => {
    const syntheticEvent = new Event(
      "submit"
    ) as unknown as FormEvent<HTMLFormElement>;
    handleSubmit(syntheticEvent);
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <form
        className="bg-white rounded-[15px] w-full h-full"
        onSubmit={handleSubmit}
      >
        <div className="w-full flex items-center h-auto justify-between mb-10 pt-8">
          <button
            onClick={() => setTab("default")}
            className="flex gap-1 items-center font-Inter "
          >
            <ChevronLeft className="text-navyBlue size-5" />
            <p className="font-[500] text-[18px] text-navyBlue">Back</p>
          </button>
          <button
            onClick={() => {
              setAccountSettings(false);
              setTab("default");
            }}
            id="top-drug"
            className="cursor-pointer"
          >
            <X className="size-6 text-gray-800" />
          </button>
        </div>
        <div className="mb-10 w-full flex flex-col">
          <legend className="text-[24px] font-bold text-blue-700 font-Inter">
            Reset Password
          </legend>
          <p className="text-[14px]">Please enter your new password</p>
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="changePassword" className="text-[14px] mb-1">
            New Password
          </label>
          <input
            type="password"
            id="changePassword"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            className="border bg-[#EDF2F7] border-none outline-none rounded-[10px] p-4 mb-4"
            placeholder="New Password"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="confirmPassword" className="text-[14px] mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="border bg-[#EDF2F7] border-none outline-none rounded-[10px] p-4 mb-4"
            placeholder="Confirm New Password"
          />
        </div>
      </form>
      {errorMessage && (
        <p className="mb-4 -mt-4 text-red font-[500] tracking-none leading-none text-[14px]">
          {errorMessage}
        </p>
      )}
      <button
        onClick={handleClick}
        disabled={loading}
        className={`font-semibold  rounded-[10px] h-[56px] w-full text-white items-center justify-center flex transition duration-300 ${
          loading ? "bg-navyBlue opacity-85" : "bg-blue-700"
        }`}
      >
        {loading ? <div className="loaderInfinity"></div> : "Change Password"}
      </button>
    </div>
  );
};

export default ChangePassword;
