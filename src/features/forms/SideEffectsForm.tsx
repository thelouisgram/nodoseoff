"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useAppSelector } from "@/store";
import {
  useCompletedDrugs,
  useDrugs,
  useInsertHealthJournalMutation,
} from "@/hooks/useDashboardData";
import { ndoEase } from "@/components/landing/motion";

const COMMON_SYMPTOMS = [
  "Nausea",
  "Headache",
  "Dizziness",
  "Fatigue",
  "Insomnia",
  "Stomach upset",
  "Dry mouth",
  "Rash",
  "Appetite change",
  "Muscle pain",
];

interface SideEffectsFormProps {
  activeModal: string;
  setActiveModal: (value: string) => void;
}

const SideEffectsForm: React.FC<SideEffectsFormProps> = ({
  activeModal,
  setActiveModal,
}) => {
  const { userId, activeDrug } = useAppSelector((state) => state.app);
  const { data: drugs = [] } = useDrugs(userId);
  const { data: completed = [] } = useCompletedDrugs(userId);
  const insert = useInsertHealthJournalMutation();

  const [symptom, setSymptom] = useState("");
  const [severity, setSeverity] = useState(3);
  const [drug, setDrug] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const drugOptions = useMemo(() => {
    const names = Array.from(
      new Set(
        [...drugs, ...completed]
          .map((d) => d.drug.trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));
    return names;
  }, [drugs, completed]);

  const reset = () => {
    setSymptom("");
    setSeverity(3);
    setDrug("");
    setNotes("");
  };

  const handleClose = () => {
    if (loading) return;
    setActiveModal("");
    reset();
  };

  // Prefill linked med when opened from a drug context
  useEffect(() => {
    if (activeModal !== "side-effects") return;
    if (
      activeDrug &&
      drugOptions.some((n) => n.toLowerCase() === activeDrug.toLowerCase())
    ) {
      setDrug(activeDrug);
    }
  }, [activeModal, activeDrug, drugOptions]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    const trimmed = symptom.trim();
    if (!trimmed) {
      toast.error("Describe the side effect");
      return;
    }

    setLoading(true);
    try {
      const matched = [...drugs, ...completed].find(
        (d) => d.drug.trim().toLowerCase() === drug.trim().toLowerCase()
      );
      await insert.mutateAsync({
        kind: "side_effect",
        symptom: trimmed,
        severity,
        drug: drug.trim(),
        drugId: matched?.drugId || "",
        notes: notes.trim(),
      });
      toast.success("Side effect logged");
      reset();
      setActiveModal("");
    } catch {
      toast.error("Could not save side effect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {activeModal === "side-effects" ? (
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
            className="w-full max-w-md overflow-hidden rounded-2xl border border-black/[0.05] bg-white shadow-soft-float"
          >
            <div className="flex items-center justify-between border-b border-black/[0.05] px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-xl bg-soft-peach text-soft-peach-ink">
                  <CircleAlert className="size-4" strokeWidth={2} />
                </span>
                <div>
                  <h2 className="text-[16px] font-semibold text-soft-ink">
                    Log side effect
                  </h2>
                  <p className="text-[12px] text-soft-muted">
                    Helps AMANDA 6 spot patterns over time
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="ndo-press grid size-8 place-items-center rounded-lg text-soft-muted hover:bg-soft-canvas"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-soft-muted">
                  Symptom
                </p>
                <div className="mb-2 flex flex-wrap gap-2">
                  {COMMON_SYMPTOMS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSymptom(s)}
                      className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${
                        symptom === s
                          ? "bg-soft-primary text-white"
                          : "bg-soft-canvas text-soft-muted hover:text-soft-ink"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <input
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  placeholder="Or type a symptom"
                  className="w-full rounded-xl border border-black/[0.08] bg-white px-3 py-2.5 text-[13px] text-soft-ink outline-none focus:border-soft-primary/40"
                />
              </div>

              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-soft-muted">
                  Severity {severity}/5
                </p>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="w-full accent-[#002860]"
                />
                <div className="mt-1 flex justify-between text-[11px] text-soft-muted">
                  <span>Mild</span>
                  <span>Severe</span>
                </div>
              </div>

              {drugOptions.length > 0 ? (
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-soft-muted">
                    Linked medication
                  </p>
                  <select
                    value={drug}
                    onChange={(e) => setDrug(e.target.value)}
                    className="w-full rounded-xl border border-black/[0.08] bg-white px-3 py-2.5 text-[13px] text-soft-ink outline-none focus:border-soft-primary/40"
                  >
                    <option value="">None / not sure</option>
                    {drugOptions.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-soft-muted">
                  Notes (optional)
                </p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="When it started, what helped, anything else…"
                  className="w-full resize-none rounded-xl border border-black/[0.08] bg-white px-3 py-2.5 text-[13px] text-soft-ink outline-none focus:border-soft-primary/40"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="ndo-press flex w-full items-center justify-center gap-2 rounded-xl bg-soft-primary px-4 py-3 text-[14px] font-semibold text-white disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save side effect"
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default SideEffectsForm;
