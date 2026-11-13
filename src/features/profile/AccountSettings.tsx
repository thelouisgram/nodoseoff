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
        className="w-full max-w-md overflow-hidden rounded-[22px] border border-soft-line bg-white shadow-soft-lg"
      >
        <div className="flex items-start justify-between gap-4 border-b border-black/[0.05] px-6 py-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-soft-muted">
              Security
            </p>
            <h2 className="mt-1 text-[20px] font-bold tracking-tight text-soft-ink">
              Account settings
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="ndo-press -mr-1 -mt-1 grid size-9 shrink-0 place-items-center rounded-xl text-soft-muted hover:bg-soft-canvas hover:text-soft-ink"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 ss:p-5">
          <div className="overflow-hidden rounded-[18px] border border-soft-line">
            <button
              onClick={() => setActiveModal("changePassword")}
              className="group flex w-full items-center gap-3.5 border-b border-soft-line px-4 py-4 text-left transition-colors hover:bg-soft-primary-soft/45"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-soft-primary-soft text-soft-primary">
                <Lock className="size-[18px]" strokeWidth={1.75} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-soft-ink">
                  Change password
                </span>
                <span className="mt-0.5 block text-[12.5px] text-soft-muted">
                  Update your account password
                </span>
              </span>
              <ChevronRight
                className="size-4 shrink-0 text-soft-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-soft-primary"
                strokeWidth={2}
              />
            </button>

            <button
              onClick={() => setActiveModal("deleteAccount")}
              className="group flex w-full items-center gap-3.5 px-4 py-4 text-left transition-colors hover:bg-[#FFF6F9]"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-soft-pink text-soft-pink-ink">
                <Trash className="size-[18px]" strokeWidth={1.75} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-soft-pink-ink">
                  Delete account
                </span>
                <span className="mt-0.5 block text-[12.5px] text-soft-muted">
                  Permanently delete your account
                </span>
              </span>
              <ChevronRight
                className="size-4 shrink-0 text-soft-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-soft-pink-ink"
                strokeWidth={2}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
