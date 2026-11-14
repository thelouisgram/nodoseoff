/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useMemo, useState } from "react";
import { Bell, Lock, Trash, X, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAppSelector } from "@/store";
import { useDrugs, useUpdateRemindersMutation } from "@/hooks/useDashboardData";

interface Settings {
  setActiveModal: (value: string) => void;
  activeModal: string;
}

const AccountSettings: React.FC<Settings> = ({
  setActiveModal,
  activeModal,
}) => {
  const { userId } = useAppSelector((state) => state.app);
  const { data: drugs = [] } = useDrugs(userId);
  const updateReminders = useUpdateRemindersMutation();
  const [saving, setSaving] = useState(false);

  const remindersOn = useMemo(() => {
    if (drugs.length === 0) return true;
    return drugs.some((d) => d.reminder !== false);
  }, [drugs]);

  const handleClose = () => {
    setActiveModal("");
  };

  const toggleReminders = async () => {
    if (!userId || saving) return;
    const next = !remindersOn;
    setSaving(true);
    try {
      await updateReminders.mutateAsync({ userId, enabled: next });
      toast.success(
        next ? "Dose reminders turned on" : "Dose reminders turned off"
      );
    } catch (error) {
      console.error(error);
      toast.error("Could not update reminders. Try again.");
    } finally {
      setSaving(false);
    }
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
              Preferences
            </p>
            <h2 className="mt-1 text-[20px] font-bold tracking-tight text-soft-ink">
              Account settings
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="ndo-press -mr-1 -mt-1 grid size-9 shrink-0 place-items-center rounded-xl text-soft-muted hover:bg-soft-canvas hover:text-soft-ink"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 p-4 ss:p-5">
          <div className="overflow-hidden rounded-[18px] border border-soft-line">
            <div className="flex w-full items-center gap-3.5 border-b border-soft-line px-4 py-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-soft-primary-soft text-soft-primary">
                <Bell className="size-[18px]" strokeWidth={1.75} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-soft-ink">
                  Dose reminders
                </span>
                <span className="mt-0.5 block text-[12.5px] text-soft-muted">
                  {remindersOn
                    ? "On for your ongoing medications"
                    : "Off for all ongoing medications"}
                </span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={remindersOn}
                aria-label="Toggle dose reminders"
                disabled={saving}
                onClick={() => void toggleReminders()}
                className={`ndo-press relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-60 ${
                  remindersOn ? "bg-soft-primary" : "bg-black/[0.12]"
                }`}
              >
                <span
                  className={`absolute top-0.5 grid size-6 place-items-center rounded-full bg-white shadow-sm transition-transform ${
                    remindersOn ? "translate-x-[1.35rem]" : "translate-x-0.5"
                  }`}
                >
                  {saving ? (
                    <Loader2
                      className="size-3 animate-spin text-soft-muted"
                      strokeWidth={2.5}
                    />
                  ) : null}
                </span>
              </button>
            </div>

            <button
              type="button"
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
                className="ndo-chevron size-4 shrink-0 text-soft-muted group-hover:text-soft-primary"
                strokeWidth={2}
              />
            </button>

            <button
              type="button"
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
                className="ndo-chevron size-4 shrink-0 text-soft-muted group-hover:text-soft-pink-ink"
                strokeWidth={2}
              />
            </button>
          </div>

          <p className="px-1 text-[12px] leading-relaxed text-soft-muted">
            Turning reminders off updates every ongoing medication. You can still
            change reminders on a single drug when you edit it.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
