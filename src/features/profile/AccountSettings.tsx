/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Lock, Trash, X, ChevronRight, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface Settings {
  setActiveModal: (value: string) => void;
  activeModal: string;
}

const AccountSettings: React.FC<Settings> = ({
  setActiveModal,
  activeModal,
}) => {
  const { theme, toggleTheme } = useTheme();
  const handleClose = () => {
    setActiveModal("");
  };

  if (activeModal !== "accountSettings") return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          activeModal === "accountSettings"
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0"
        } transition-all duration-200 w-full max-w-md bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-2xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
            Account Settings
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-4 border border-gray-100 dark:border-slate-800 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-200 dark:hover:border-slate-700 transition-all group bg-gray-50/30 dark:bg-slate-900/50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                  {theme === "light" ? (
                    <Moon
                      className="w-5 h-5 text-blue-600 dark:text-blue-400"
                      strokeWidth={2}
                    />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-500" strokeWidth={2} />
                  )}
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-slate-200">
                    {theme === "light" ? "Dark Mode" : "Light Mode"}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Switch to {theme === "light" ? "dark" : "light"} theme
                  </p>
                </div>
              </div>
              <div className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Toggle
              </div>
            </button>
            {/* Change Password Button */}
            <button
              onClick={() => setActiveModal("changePassword")}
              className="w-full flex items-center justify-between p-4 border border-gray-100 dark:border-slate-800 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-200 dark:hover:border-slate-700 transition-all group bg-gray-50/30 dark:bg-slate-900/50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                  <Lock
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                    strokeWidth={2}
                  />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-slate-200">
                    Change Password
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Update your account password
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
            </button>

            {/* Delete Account Button - Disabled */}
            <button
              disabled={true}
              className="w-full flex items-center justify-between p-4 border border-gray-100 dark:border-slate-800 rounded-lg opacity-50 cursor-not-allowed bg-gray-50/50 dark:bg-slate-900/30"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <Trash
                    className="w-5 h-5 text-red-600 dark:text-red-400"
                    strokeWidth={2}
                  />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-slate-200">
                    Delete Account
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Permanently delete your account
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Info Message */}
          <div className="mt-6 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-100 dark:border-slate-800">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Account deletion is currently disabled. Contact support for
              assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
