"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  CalendarPlus,
  CircleAlert,
  ShieldOff,
  Pill,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ndoEase } from "@/components/landing/motion";

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
  },
  {
    id: "side-effects",
    label: "Add side effect",
    Icon: CircleAlert,
    btn: "bg-soft-peach text-soft-peach-ink",
  },
  {
    id: "appointment",
    label: "Book appointment",
    Icon: CalendarPlus,
    btn: "bg-soft-mint text-soft-mint-ink",
  },
  {
    id: "allergies",
    label: "Add allergy",
    Icon: ShieldOff,
    btn: "bg-soft-lavender text-soft-lavender-ink",
  },
] as const;

const FloatingAddActions: React.FC<FloatingAddActionsProps> = ({
  add,
  setAdd,
  activeModal,
  setActiveModal,
}) => {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (activeModal !== "" || !mounted) return null;

  const handleClose = () => setAdd(false);

  return createPortal(
    <>
      <AnimatePresence>
        {add ? (
          <motion.div
            key="fab-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: ndoEase }}
            className="fixed inset-0 z-[143] bg-soft-ink/25 backdrop-blur-sm"
            onClick={handleClose}
          />
        ) : null}
      </AnimatePresence>

      <div className="pointer-events-none fixed bottom-24 right-5 z-[144] flex flex-col items-end ss:right-10 md:bottom-10">
        <AnimatePresence>
          {add ? (
            <motion.div
              key="fab-actions"
              initial="hidden"
              animate="show"
              exit="exit"
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: reduce ? 0 : 0.045,
                    delayChildren: reduce ? 0 : 0.02,
                  },
                },
                exit: {
                  transition: {
                    staggerChildren: reduce ? 0 : 0.03,
                    staggerDirection: -1,
                  },
                },
              }}
              className="pointer-events-auto mb-3 flex flex-col items-end gap-2.5"
            >
              {ACTIONS.map(({ id, label, Icon, btn }) => (
                <motion.button
                  key={id}
                  type="button"
                  variants={{
                    hidden: reduce
                      ? { opacity: 0 }
                      : { opacity: 0, y: 10, scale: 0.96 },
                    show: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        duration: 0.28,
                        ease: ndoEase,
                      },
                    },
                    exit: reduce
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          y: 8,
                          scale: 0.96,
                          transition: { duration: 0.18, ease: ndoEase },
                        },
                  }}
                  style={{ transformOrigin: "bottom right" }}
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
                    className={`flex size-12 items-center justify-center rounded-full border border-black/[0.04] shadow-soft-sm transition group-hover:scale-[1.03] ss:size-14 ${btn}`}
                  >
                    <Icon className="size-5 ss:size-6" strokeWidth={2} />
                  </span>
                </motion.button>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setAdd((prev) => !prev)}
          whileHover={reduce ? undefined : { scale: 1.05 }}
          whileTap={reduce ? undefined : { scale: 0.94 }}
          transition={{ duration: 0.2, ease: ndoEase }}
          aria-label={add ? "Close add menu" : "Open add menu"}
          aria-expanded={add}
          className="pointer-events-auto relative z-[146] flex size-14 items-center justify-center rounded-full bg-soft-primary shadow-soft-float ss:size-16"
        >
          <motion.span
            animate={{ rotate: add ? 45 : 0 }}
            transition={{
              duration: reduce ? 0 : 0.28,
              ease: ndoEase,
            }}
            className="flex"
          >
            <Plus className="size-7 text-white ss:size-8" strokeWidth={2.2} />
          </motion.span>
        </motion.button>
      </div>
    </>,
    document.body
  );
};

export default FloatingAddActions;
