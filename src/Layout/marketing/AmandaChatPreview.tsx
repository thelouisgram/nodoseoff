"use client";

import { ArrowUp } from "lucide-react";
import { m, useLandingVariants, viewOnce } from "@/components/landing/motion";
import AmandaMark from "./AmandaMark";

const thread = [
  {
    role: "user" as const,
    text: "Can I take my evening blood pressure med with food?",
  },
  {
    role: "amanda" as const,
    text: "Yes — your lisinopril is fine with food. Take it at the same time each night so you don’t miss a dose.",
  },
];

const chips = ["Interactions", "Missed dose", "Storage"];

type Props = {
  featured?: boolean;
};

export default function AmandaChatPreview({ featured = false }: Props) {
  const { fadeUp, reduce } = useLandingVariants();

  return (
    <m.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewOnce}
      className={`relative mx-auto w-full ${featured ? "max-w-xl" : "max-w-md"}`}
    >
      <div className="relative overflow-hidden rounded-2xl border border-black/[0.05] bg-white shadow-soft-md">
        <div className="flex items-center gap-3 border-b border-black/[0.05] px-5 py-4">
          <AmandaMark className="size-9" pulse />
          <div className="min-w-0">
            <p className="text-[15px] font-semibold tracking-tight text-soft-ink">
              AMANDA 6
            </p>
            <p className="text-[12px] text-soft-muted">On your regimen</p>
          </div>
        </div>

        <div className={`space-y-5 px-5 py-6 ${featured ? "ss:py-8" : ""}`}>
          {thread.map((msg, i) => {
            const isUser = msg.role === "user";
            return (
              <m.div
                key={i}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={viewOnce}
                transition={{ delay: 0.12 + i * 0.14, duration: 0.45 }}
                className={isUser ? "flex justify-end" : "pr-4"}
              >
                {isUser ? (
                  <p className="max-w-[85%] rounded-2xl rounded-br-md bg-soft-primary px-4 py-2.5 text-[13px] font-medium leading-relaxed text-white">
                    {msg.text}
                  </p>
                ) : (
                  <div className="flex gap-3">
                    <AmandaMark className="mt-1 size-6 shrink-0" />
                    <p className="text-[14px] leading-relaxed text-soft-ink/90">
                      {msg.text}
                    </p>
                  </div>
                )}
              </m.div>
            );
          })}

          <m.div
            initial={reduce ? false : { opacity: 0 }}
            whileInView={reduce ? undefined : { opacity: 1 }}
            viewport={viewOnce}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="flex items-center gap-1.5 pl-9"
            aria-hidden
          >
            {[0, 1, 2].map((i) => (
              <m.span
                key={i}
                className="size-1.5 rounded-full bg-soft-primary/40"
                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.15, 1] }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  delay: i * 0.16,
                }}
              />
            ))}
          </m.div>
        </div>

        <div className="border-t border-black/[0.05] px-4 py-3.5">
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full bg-soft-canvas px-3 py-1 text-[11px] font-medium text-soft-muted"
              >
                {chip}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-black/[0.06] bg-soft-canvas/80 py-1.5 pl-3.5 pr-1.5">
            <p className="min-w-0 flex-1 truncate text-[13px] text-soft-muted/70">
              Ask about your meds…
            </p>
            <span className="grid size-9 place-items-center rounded-xl bg-soft-primary text-white">
              <ArrowUp className="size-4" strokeWidth={2.25} />
            </span>
          </div>
        </div>
      </div>
    </m.div>
  );
}
