/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Lock, Trash, X, ChevronRight } from "lucide-react";

interface Settings {
  setActiveModal: (value: string) => void;
  activeModal: string;
}

const AccountSettings: React.FC<Settings> = ({
  setActiveModal,
  activeModal,
}) => {
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
        } transition-all duration-200 w-full max-w-md bg-white rounded-2xl shadow-2xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Account Settings
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-3">
            {/* Change Password Button */}
            <button
              onClick={() => setActiveModal("changePassword")}
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Lock className="w-5 h-5 text-blue-600" strokeWidth={2} />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-medium text-gray-900">
                    Change Password
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Update your account password
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>

            {/* Delete Account Button - Disabled */}
            <button
              disabled={true}
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg opacity-50 cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg">
                  <Trash className="w-5 h-5 text-red-600" strokeWidth={2} />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-medium text-gray-900">
                    Delete Account
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Permanently delete your account
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Info Message */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              Account deletion is currently disabled. Contact support for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;