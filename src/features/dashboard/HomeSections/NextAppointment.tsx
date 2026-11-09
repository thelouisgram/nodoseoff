"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { format, isPast, isToday, isTomorrow } from "date-fns";
import { CalendarPlus, MapPin, Pencil, Stethoscope, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useAppSelector } from "@/store";
import {
  useAppointment,
  useDeleteAppointmentMutation,
  useUpsertAppointmentMutation,
} from "@/hooks/useDashboardData";

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

export default function NextAppointment() {
  const { userId } = useAppSelector((state) => state.app);
  const { data: appointment } = useAppointment(userId);
  const upsert = useUpsertAppointmentMutation();
  const remove = useDeleteAppointmentMutation();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [doctor, setDoctor] = useState("");
  const [location, setLocation] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
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
  }, [appointment]);

  const past = useMemo(() => {
    if (!appointment?.startsAt) return false;
    const d = new Date(appointment.startsAt);
    return !Number.isNaN(d.getTime()) && isPast(d) && !isToday(d);
  }, [appointment]);

  const openCreate = () => {
    setDoctor("");
    setLocation("");
    setStartsAt("");
    setNotes("");
    setEditing(true);
  };

  const openEdit = () => {
    if (appointment) {
      setDoctor(appointment.doctor);
      setLocation(appointment.location);
      setStartsAt(toLocalInputValue(appointment.startsAt));
      setNotes(appointment.notes);
    }
    setEditing(true);
  };

  const onCancel = () => {
    setEditing(false);
    if (appointment) {
      setDoctor(appointment.doctor);
      setLocation(appointment.location);
      setStartsAt(toLocalInputValue(appointment.startsAt));
      setNotes(appointment.notes);
    }
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
      setEditing(false);
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
      setEditing(false);
    } catch {
      toast.error("Could not clear appointment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-4 mb-4 ss:mx-8 md:mx-0">
      <div className="rounded-2xl border border-black/[0.05] bg-white p-4 shadow-soft-sm ss:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-soft-muted">
              Next appointment
            </p>
            {!editing && !appointment ? (
              <p className="mt-1.5 text-[15px] font-semibold text-soft-ink">
                Add your next doctor visit
              </p>
            ) : null}
            {!editing && appointment ? (
              <>
                <p className="mt-1.5 text-[17px] font-semibold tracking-tight text-soft-ink">
                  {whenLabel(appointment.startsAt)}
                </p>
                {past ? (
                  <p className="mt-1 text-[12px] font-medium text-soft-peach-ink">
                    This date has passed — update or clear it
                  </p>
                ) : null}
              </>
            ) : null}
            {editing ? (
              <p className="mt-1.5 text-[15px] font-semibold text-soft-ink">
                {appointment ? "Edit appointment" : "New appointment"}
              </p>
            ) : null}
          </div>

          {!editing ? (
            <button
              type="button"
              onClick={appointment ? openEdit : openCreate}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-black/[0.06] bg-soft-canvas px-3 py-2 text-[13px] font-semibold text-soft-ink transition hover:bg-white"
            >
              {appointment ? (
                <>
                  <Pencil className="size-3.5" strokeWidth={2} />
                  Edit
                </>
              ) : (
                <>
                  <CalendarPlus className="size-3.5" strokeWidth={2} />
                  Add
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-black/[0.06] text-soft-muted transition hover:bg-soft-canvas hover:text-soft-ink"
              aria-label="Cancel"
            >
              <X className="size-4" strokeWidth={2} />
            </button>
          )}
        </div>

        {!editing && appointment ? (
          <div className="mt-3 space-y-2">
            {appointment.doctor ? (
              <p className="flex items-center gap-2 text-[14px] text-soft-ink">
                <Stethoscope className="size-4 shrink-0 text-soft-primary" strokeWidth={1.75} />
                <span className="truncate">{appointment.doctor}</span>
              </p>
            ) : null}
            {appointment.location ? (
              <p className="flex items-center gap-2 text-[14px] text-soft-muted">
                <MapPin className="size-4 shrink-0" strokeWidth={1.75} />
                <span className="truncate">{appointment.location}</span>
              </p>
            ) : null}
            {appointment.notes ? (
              <p className="text-[13px] leading-relaxed text-soft-muted">
                {appointment.notes}
              </p>
            ) : null}
          </div>
        ) : null}

        {!editing && !appointment ? (
          <p className="mt-1 text-[13px] text-soft-muted">
            Keep the date handy so you can prep your adherence report.
          </p>
        ) : null}

        {editing ? (
          <form onSubmit={onSave} className="mt-4 space-y-3">
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
                className="rounded-xl bg-soft-primary px-4 py-2.5 text-[13px] font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save appointment"}
              </button>
              {appointment ? (
                <button
                  type="button"
                  disabled={saving}
                  onClick={onDelete}
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-[#8a3d5a] transition hover:bg-[#fff7fa] disabled:opacity-60"
                >
                  <Trash2 className="size-3.5" strokeWidth={1.75} />
                  Clear
                </button>
              ) : null}
            </div>
          </form>
        ) : null}
      </div>
    </section>
  );
}
