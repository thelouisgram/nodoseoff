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
      className="fixed inset-0 z-50 flex items-center justify-center bg-soft-ink/25 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-black/[0.05] bg-white shadow-soft-md"
      >
        <div className="flex items-center justify-between border-b border-black/[0.04] px-6 py-5">
          <h2 className="text-xl font-semibold text-soft-ink">
            Account settings
          </h2>
          <button
            onClick={handleClose}
            className="rounded-soft-sm p-1.5 text-soft-muted transition hover:bg-soft-canvas hover:text-soft-ink"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            <button
              onClick={() => setActiveModal("changePassword")}
              className="group flex w-full items-center justify-between rounded-soft-lg border border-black/[0.04] bg-soft-canvas/40 p-4 transition hover:bg-soft-canvas"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-soft-sm bg-soft-blue p-2 text-soft-blue-ink">
                  <Lock className="size-5" strokeWidth={1.75} />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-medium text-soft-ink">
                    Change password
                  </h3>
                  <p className="mt-0.5 text-xs text-soft-muted">
                    Update your account password
                  </p>
                </div>
              </div>
              <ChevronRight className="size-5 text-soft-muted transition group-hover:text-soft-ink" />
            </button>

            <button
              onClick={() => setActiveModal("deleteAccount")}
              className="group flex w-full items-center justify-between rounded-soft-lg border border-red-100 bg-red-50/40 p-4 transition hover:bg-red-50"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-soft-sm bg-soft-pink p-2 text-soft-pink-ink">
                  <Trash className="size-5" strokeWidth={1.75} />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-medium text-soft-ink">
                    Delete account
                  </h3>
                  <p className="mt-0.5 text-xs text-soft-muted">
                    Permanently delete your account
                  </p>
                </div>
              </div>
              <ChevronRight className="size-5 text-soft-muted transition group-hover:text-soft-ink" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
