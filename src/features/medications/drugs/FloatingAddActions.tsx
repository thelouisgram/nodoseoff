"use client";

import React, { useEffect, useId, useState } from "react";
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

/** Stagger from the FAB upward — nearest item first. */
function delayFromFab(index: number, total: number, step: number) {
  return (total - 1 - index) * step;
}

const fabSpring = { type: "spring" as const, stiffness: 420, damping: 28 };
const itemSpring = { type: "spring" as const, stiffness: 380, damping: 26 };

const FloatingAddActions: React.FC<FloatingAddActionsProps> = ({
  add,
  setAdd,
  activeModal,
  setActiveModal,
}) => {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!add) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAdd(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [add, setAdd]);

  if (activeModal !== "" || !mounted) return null;

  const handleClose = () => setAdd(false);
  const total = ACTIONS.length;

  return createPortal(
    <>
      <AnimatePresence>
        {add ? (
          <motion.div
            key="fab-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.1 : 0.2, ease: ndoEase }}
            className="fixed inset-0 z-[143] bg-soft-ink/30 backdrop-blur-[6px]"
            onClick={handleClose}
            aria-hidden
          />
        ) : null}
      </AnimatePresence>

      <div className="pointer-events-none fixed bottom-24 right-5 z-[144] flex flex-col items-end ss:right-10 md:bottom-10">
        <AnimatePresence>
          {add ? (
            <motion.div
              key="fab-actions"
              id={menuId}
              role="menu"
              aria-label="Add to your regimen"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: reduce ? 0.1 : 0.22, ease: ndoEase }}
              className="pointer-events-auto mb-3.5 flex flex-col items-end gap-2.5"
            >
              {ACTIONS.map(({ id, label, Icon, btn }, index) => (
                <motion.button
                  key={id}
                  type="button"
                  role="menuitem"
                  initial={
                    reduce
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.92, y: 16, x: 10 }
                  }
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    y: 0,
                    transition: reduce
                      ? { duration: 0.12 }
                      : {
                          ...itemSpring,
                          delay: delayFromFab(index, total, 0.045),
                        },
                  }}
                  exit={
                    reduce
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          scale: 0.94,
                          x: 8,
                          y: 12,
                          transition: {
                            duration: 0.16,
                            ease: ndoEase,
                            // Exit the way it entered — closest to FAB leaves last
                            delay: delayFromFab(index, total, 0.03),
                          },
                        }
                  }
                  whileHover={
                    reduce
                      ? undefined
                      : { x: -3, transition: { duration: 0.16, ease: ndoEase } }
                  }
                  whileTap={reduce ? undefined : { scale: 0.97 }}
                  style={{ transformOrigin: "bottom right" }}
                  onClick={() => {
                    setAdd(false);
                    setActiveModal(id);
                  }}
                  className="group flex items-center gap-2.5 outline-none focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-soft-primary/40"
                >
                  <span className="rounded-full border border-black/[0.05] bg-white/95 px-3.5 py-2 text-[13px] font-semibold text-soft-ink shadow-soft-sm backdrop-blur-sm transition-[border-color,box-shadow] duration-200 ease-out group-hover:border-black/[0.1] group-hover:shadow-soft-md">
                    {label}
                  </span>
                  <span
                    className={`flex size-12 items-center justify-center rounded-full border border-black/[0.04] shadow-soft-sm transition-transform duration-200 ease-out group-hover:scale-[1.04] ss:size-14 ${btn}`}
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
          animate={
            reduce
              ? undefined
              : {
                  scale: add ? 1.04 : 1,
                  boxShadow: add
                    ? "0 16px 36px rgba(0, 40, 96, 0.32)"
                    : "0 10px 24px rgba(0, 40, 96, 0.18)",
                }
          }
          whileHover={
            reduce
              ? undefined
              : {
                  scale: add ? 1.06 : 1.05,
                  transition: fabSpring,
                }
          }
          whileTap={reduce ? undefined : { scale: 0.94 }}
          transition={reduce ? { duration: 0.12 } : fabSpring}
          aria-label={add ? "Close add menu" : "Open add menu"}
          aria-expanded={add}
          aria-controls={add ? menuId : undefined}
          aria-haspopup="menu"
          className={`pointer-events-auto relative z-[146] flex size-14 items-center justify-center rounded-full bg-soft-primary ss:size-16 ${
            add ? "ring-4 ring-soft-primary/20" : ""
          }`}
        >
          <motion.span
            animate={{ rotate: add ? 45 : 0 }}
            transition={
              reduce
                ? { duration: 0.1 }
                : { type: "spring", stiffness: 480, damping: 28 }
            }
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
