import React from "react";
import {
  CalendarPlus,
  CircleAlert,
  ShieldOff,
  Pill,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingAddActionsProps {
  add: boolean;
  setAdd: React.Dispatch<React.SetStateAction<boolean>>;
  activeModal: string;
  setActiveModal: (value: string) => void;
}

const ACTIONS = [
  {
    id: "drugs",
    label: "Add medication",
    Icon: Pill,
    btn: "bg-soft-blue text-soft-blue-ink",
    delay: 0,
  },
  {
    id: "side-effects",
    label: "Side effect",
    Icon: CircleAlert,
    btn: "bg-soft-peach text-soft-peach-ink",
    delay: 0.04,
  },
  {
    id: "appointment",
    label: "Appointment",
    Icon: CalendarPlus,
    btn: "bg-soft-mint text-soft-mint-ink",
    delay: 0.08,
  },
  {
    id: "allergies",
    label: "Add allergy",
    Icon: ShieldOff,
    btn: "bg-soft-lavender text-soft-lavender-ink",
    delay: 0.12,
  },
] as const;

const FloatingAddActions: React.FC<FloatingAddActionsProps> = ({
  add,
  setAdd,
  activeModal,
  setActiveModal,
}) => {
  const handleClose = () => setAdd(false);

  if (activeModal !== "") return null;

  return (
    <>
      <AnimatePresence>
        {add && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[143] bg-soft-ink/25 backdrop-blur-sm"
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-24 right-5 z-[144] flex flex-col items-end ss:right-10 md:bottom-10">
        <AnimatePresence>
          {add && (
            <div className="mb-4 flex flex-col items-end gap-2.5">
              {ACTIONS.map(({ id, label, Icon, btn, delay }) => (
                <motion.button
                  key={id}
                  type="button"
                  initial={{ opacity: 0, y: 16, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.9 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 24,
                    delay,
                  }}
                  onClick={() => {
                    setAdd(false);
                    setActiveModal(id);
                  }}
                  className="ndo-press group flex items-center gap-2.5"
                >
                  <span className="rounded-full border border-black/[0.04] bg-white px-3.5 py-2 text-[13px] font-semibold text-soft-ink shadow-soft-sm transition group-hover:border-black/[0.08]">
                    {label}
                  </span>
                  <span
                    className={`flex size-12 items-center justify-center rounded-full border border-black/[0.04] shadow-soft-sm transition group-hover:scale-105 ss:size-14 ${btn}`}
                  >
                    <Icon className="size-5 ss:size-6" strokeWidth={2} />
                  </span>
                </motion.button>
              ))}
            </div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setAdd((prev) => !prev)}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.08, rotate: add ? 0 : -8 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 22, delay: 0.25 }}
          aria-label={add ? "Close add menu" : "Open add menu"}
          aria-expanded={add}
          className="relative z-[146] flex size-14 items-center justify-center rounded-full bg-soft-primary shadow-soft-float ss:size-16"
        >
          <motion.div
            animate={{ rotate: add ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
          >
            <Plus className="size-7 text-white ss:size-8" strokeWidth={2.2} />
          </motion.div>
        </motion.button>
      </div>
    </>
  );
};

export default FloatingAddActions;
