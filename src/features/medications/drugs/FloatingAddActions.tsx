import React from "react";
import { ShieldOff, Pill, X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingAddActionsProps {
  add: boolean;
  setAdd: React.Dispatch<React.SetStateAction<boolean>>;
  activeModal: string;
  setActiveModal: (value: string) => void;
}

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
            <div className="mb-4 flex flex-col items-end gap-3">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.85 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="flex items-center gap-3"
              >
                <span className="rounded-xl border border-black/[0.05] bg-white px-3 py-1.5 text-sm font-semibold text-soft-ink shadow-soft-sm">
                  Add medication
                </span>
                <button
                  onClick={() => {
                    setAdd(false);
                    setActiveModal("drugs");
                  }}
                  className="flex size-12 items-center justify-center rounded-full border border-black/[0.05] bg-soft-blue text-soft-blue-ink shadow-soft-sm transition hover:scale-105 active:scale-95 ss:size-14"
                >
                  <Pill className="size-6 ss:size-7" strokeWidth={1.8} />
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.85 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.05,
                }}
                className="flex items-center gap-3"
              >
                <span className="rounded-xl border border-black/[0.05] bg-white px-3 py-1.5 text-sm font-semibold text-soft-ink shadow-soft-sm">
                  Add allergy
                </span>
                <button
                  onClick={() => {
                    setAdd(false);
                    setActiveModal("allergies");
                  }}
                  className="flex size-12 items-center justify-center rounded-full border border-black/[0.05] bg-soft-lavender text-soft-lavender-ink shadow-soft-sm transition hover:scale-105 active:scale-95 ss:size-14"
                >
                  <ShieldOff className="size-6 ss:size-7" strokeWidth={1.8} />
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setAdd((prev) => !prev)}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ delay: 0.5 }}
          className="relative z-[146] flex size-14 items-center justify-center rounded-full bg-soft-primary shadow-soft-float ss:size-16"
        >
          <motion.div
            animate={{ rotate: add ? 0 : 90 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {add ? (
              <X className="size-7 text-white ss:size-8" strokeWidth={2.2} />
            ) : (
              <Plus className="size-7 text-white ss:size-8" strokeWidth={2.2} />
            )}
          </motion.div>
        </motion.button>
      </div>
    </>
  );
};

export default FloatingAddActions;
