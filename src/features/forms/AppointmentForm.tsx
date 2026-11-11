"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarPlus,
  Loader2,
  MapPin,
  Stethoscope,
  Trash2,
  X,
} from "lucide-react";
import { format, isPast, isToday, isTomorrow } from "date-fns";
import { toast } from "sonner";
import { useAppSelector } from "@/store";
import {
  useAppointment,
  useDeleteAppointmentMutation,
  useUpsertAppointmentMutation,
} from "@/hooks/useDashboardData";
import { ndoEase } from "@/components/landing/motion";

interface AppointmentFormProps {
  activeModal: string;
  setActiveModal: (value: string) => void;
}

function toLocalInputValue(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function whenLabel(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Date TBD";
  if (isToday(d)) return `Today · ${format(d, "h:mm a")}`;
  if (isTomorrow(d)) return `Tomorrow · ${format(d, "h:mm a")}`;
  return format(d, "EEE, MMM d · h:mm a");
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  activeModal,
  setActiveModal,
}) => {
  const { userId } = useAppSelector((state) => state.app);
  const { data: appointment } = useAppointment(userId);
  const upsert = useUpsertAppointmentMutation();
  const remove = useDeleteAppointmentMutation();

  const [doctor, setDoctor] = useState("");
  const [location, setLocation] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const open = activeModal === "appointment";

  useEffect(() => {
    if (!open) return;
    if (!appointment) {
      setDoctor("");
      setLocation("");
      setStartsAt("");
      setNotes("");
      return;
    }
    setDoctor(appointment.doctor);
    setLocation(appointment.location);
    setStartsAt(toLocalInputValue(appointment.startsAt));
    setNotes(appointment.notes);
  }, [open, appointment]);

  const past = useMemo(() => {
    if (!appointment?.startsAt) return false;
    const d = new Date(appointment.startsAt);
    return !Number.isNaN(d.getTime()) && isPast(d) && !isToday(d);
  }, [appointment]);

  const handleClose = () => {
    if (saving) return;
    setActiveModal("");
  };

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (!startsAt) {
      toast.error("Pick a date and time");
      return;
    }
    const iso = new Date(startsAt).toISOString();
    if (Number.isNaN(new Date(iso).getTime())) {
      toast.error("Pick a valid date and time");
      return;
    }

    setSaving(true);
    try {
      await upsert.mutateAsync({
        userId,
        doctor,
        location,
        startsAt: iso,
        notes,
      });
      toast.success("Appointment saved");
      setActiveModal("");
    } catch {
      toast.error("Could not save appointment");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    setSaving(true);
    try {
      await remove.mutateAsync();
      toast.success("Appointment cleared");
      setActiveModal("");
    } catch {
      toast.error("Could not clear appointment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: ndoEase }}
          onClick={handleClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-soft-ink/25 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.28, ease: ndoEase }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[min(90dvh,640px)] w-full max-w-md overflow-y-auto rounded-2xl border border-black/[0.05] bg-white shadow-soft-float"
          >
            <div className="sticky top-0 z-[1] flex items-center justify-between border-b border-black/[0.05] bg-white px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-xl bg-soft-mint text-soft-mint-ink">
                  <CalendarPlus className="size-4" strokeWidth={2} />
                </span>
                <div>
                  <h2 className="text-[16px] font-semibold text-soft-ink">
                    {appointment ? "Edit appointment" : "Add appointment"}
                  </h2>
                  <p className="text-[12px] text-soft-muted">
                    Keep your next visit handy for prep
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                disabled={saving}
                className="ndo-press grid size-8 place-items-center rounded-lg text-soft-muted hover:bg-soft-canvas"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            {appointment ? (
              <div className="border-b border-black/[0.05] px-5 py-3">
                <p className="text-[14px] font-semibold text-soft-ink">
                  {whenLabel(appointment.startsAt)}
                </p>
                {past ? (
                  <p className="mt-0.5 text-[12px] font-medium text-soft-peach-ink">
                    This date has passed — update or clear it
                  </p>
                ) : null}
                {appointment.doctor ? (
                  <p className="mt-2 flex items-center gap-2 text-[13px] text-soft-ink">
                    <Stethoscope className="size-3.5 shrink-0 text-soft-primary" />
                    <span className="truncate">{appointment.doctor}</span>
                  </p>
                ) : null}
                {appointment.location ? (
                  <p className="mt-1 flex items-center gap-2 text-[13px] text-soft-muted">
                    <MapPin className="size-3.5 shrink-0" />
                    <span className="truncate">{appointment.location}</span>
                  </p>
                ) : null}
              </div>
            ) : null}

            <form onSubmit={onSave} className="space-y-3.5 px-5 py-5">
              <div>
                <label
                  htmlFor="appt-when"
                  className="mb-1 block text-[12px] font-medium text-soft-muted"
                >
                  Date &amp; time
                </label>
                <input
                  id="appt-when"
                  type="datetime-local"
                  required
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  className="w-full rounded-xl border border-black/[0.06] bg-soft-canvas px-3.5 py-2.5 text-[14px] text-soft-ink outline-none focus:border-soft-primary/25 focus:bg-white focus:ring-4 focus:ring-soft-primary/[0.06]"
                />
              </div>
              <div>
                <label
                  htmlFor="appt-doctor"
                  className="mb-1 block text-[12px] font-medium text-soft-muted"
                >
                  Doctor or clinic
                </label>
                <input
                  id="appt-doctor"
                  type="text"
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  placeholder="e.g. Dr. Okonkwo"
                  className="w-full rounded-xl border border-black/[0.06] bg-soft-canvas px-3.5 py-2.5 text-[14px] text-soft-ink outline-none placeholder:text-soft-muted focus:border-soft-primary/25 focus:bg-white focus:ring-4 focus:ring-soft-primary/[0.06]"
                />
              </div>
              <div>
                <label
                  htmlFor="appt-location"
                  className="mb-1 block text-[12px] font-medium text-soft-muted"
                >
                  Location
                </label>
                <input
                  id="appt-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Clinic or hospital"
                  className="w-full rounded-xl border border-black/[0.06] bg-soft-canvas px-3.5 py-2.5 text-[14px] text-soft-ink outline-none placeholder:text-soft-muted focus:border-soft-primary/25 focus:bg-white focus:ring-4 focus:ring-soft-primary/[0.06]"
                />
              </div>
              <div>
                <label
                  htmlFor="appt-notes"
                  className="mb-1 block text-[12px] font-medium text-soft-muted"
                >
                  Notes
                </label>
                <textarea
                  id="appt-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What to ask or bring"
                  className="w-full resize-none rounded-xl border border-black/[0.06] bg-soft-canvas px-3.5 py-2.5 text-[14px] text-soft-ink outline-none placeholder:text-soft-muted focus:border-soft-primary/25 focus:bg-white focus:ring-4 focus:ring-soft-primary/[0.06]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="ndo-press inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-soft-primary px-4 py-3 text-[14px] font-semibold text-white disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Save appointment"
                  )}
                </button>
                {appointment ? (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={onDelete}
                    className="ndo-press inline-flex items-center gap-1.5 rounded-xl px-3 py-3 text-[13px] font-semibold text-[#8a3d5a] transition hover:bg-[#fff7fa] disabled:opacity-60"
                  >
                    <Trash2 className="size-3.5" strokeWidth={1.75} />
                    Clear
                  </button>
                ) : null}
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default AppointmentForm;
