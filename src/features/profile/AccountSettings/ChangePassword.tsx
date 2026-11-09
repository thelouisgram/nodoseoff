/* eslint-disable react-hooks/exhaustive-deps */
import React, { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/client";
import { ChevronLeft, X, Loader2 } from "lucide-react";

interface ChangePasswordProps {
  setActiveModal: (value: string) => void;
  activeModal: string;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
  setActiveModal,
  activeModal,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => {
    if (!loading) {
      setActiveModal("");
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 8) {
      setErrorMessage(
        "Please enter a password that is at least 8 characters long."
      );
      return;
    }

    if (!currentPassword || !password || !confirmPassword) {
      setErrorMessage("Please fill in all password fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword: password,
      });
      if (error) {
        setErrorMessage(error.message || "Error updating password");
        return;
      }
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
      setActiveModal("");
    } catch (error) {
      setErrorMessage(`Error updating password: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  if (activeModal !== "changePassword") return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md scale-100 rounded-2xl border border-black/[0.05] bg-white opacity-100 shadow-soft-md transition-all duration-200"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <button
            type="button"
            onClick={() => setActiveModal("accountSettings")}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            Change Password
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setCurrentPassword(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
              minLength={8}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setConfirmPassword(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
              required
            />
          </div>
          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
