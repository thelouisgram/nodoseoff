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
      {/* Overlay */}
      <AnimatePresence>
        {add && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[143]"
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      {/* Floating Actions Wrapper */}
      <div className="fixed right-5 ss:right-10 bottom-24 md:bottom-10 z-[144] flex flex-col items-end">
        {/* Pop-out Actions */}
        <AnimatePresence>
          {add && (
            <div className="flex flex-col items-end gap-3 mb-4">
              {/* Add Drug */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.85 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="flex items-center gap-3"
              >
                <span className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Add New Drug
                </span>
                <button
                  onClick={() => {
                    setAdd(false);
                    setActiveModal("drugs");
                  }}
                  className="bg-white dark:bg-slate-800 shadow-lg rounded-full size-12 ss:size-14 
                    flex justify-center items-center hover:scale-110 active:scale-95
                    border border-gray-100 dark:border-slate-700 transition-all duration-200"
                >
                  <Pill className="size-6 ss:size-7 text-blue-600" strokeWidth={2} />
                </button>
              </motion.div>

              {/* Add Allergy */}
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
                <span className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Add Allergy
                </span>
                <button
                  onClick={() => {
                    setAdd(false);
                    setActiveModal("allergies");
                  }}
                  className="bg-white dark:bg-slate-800 shadow-lg rounded-full size-12 ss:size-14
                    flex justify-center items-center hover:scale-110 active:scale-95
                    border border-gray-100 dark:border-slate-700 transition-all duration-200"
                >
                  <ShieldOff
                    className="size-6 ss:size-7 text-indigo-500"
                    strokeWidth={2}
                  />
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Main Floating Button (NO JUMP) */}
        <motion.button
          onClick={() => setAdd((prev) => !prev)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`rounded-full size-14 ss:size-16 flex justify-center items-center 
            shadow-2xl relative z-[146] transition-colors duration-300 ${
              add
                ? "bg-slate-900 border border-slate-800"
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
            }`}
        >
          <motion.div
            animate={{ rotate: add ? 0 : 90 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {add ? (
              <X className="size-7 ss:size-8 text-white" strokeWidth={2.5} />
            ) : (
              <Plus className="size-7 ss:size-8 text-white" strokeWidth={2.5} />
            )}
          </motion.div>
        </motion.button>
      </div>
    </>
  );
};

export default FloatingAddActions;
