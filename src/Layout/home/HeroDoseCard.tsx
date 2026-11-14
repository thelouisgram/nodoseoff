"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Check, Pill, RefreshCw } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { m } from "@/components/landing/motion";

type Dose = {
  drug: string;
  when: string;
  hint: string;
};

const DOSES: Dose[] = [
  { drug: "Metformin 500mg", when: "With dinner", hint: "Food helps the tummy" },
  { drug: "Lisinopril 10mg", when: "Morning", hint: "Same time, every day" },
  { drug: "Atorvastatin 20mg", when: "Evening", hint: "Night works well for this one" },
  { drug: "Levothyroxine 75mcg", when: "Before breakfast", hint: "Empty stomach if you can" },
  { drug: "Amlodipine 5mg", when: "Morning", hint: "Blood pressure, steady as she goes" },
  { drug: "Omeprazole 20mg", when: "Before food", hint: "30 minutes early is the sweet spot" },
  { drug: "Sertraline 50mg", when: "Morning", hint: "Consistency beats perfection" },
  { drug: "Vitamin D 1000 IU", when: "With lunch", hint: "Fat-soluble — pair with a meal" },
  { drug: "Losartan 50mg", when: "Evening", hint: "A quiet end-of-day ritual" },
  { drug: "Gabapentin 300mg", when: "Night", hint: "Often taken at bedtime" },
];

function pickDose(exclude?: string): Dose {
  const pool = exclude
    ? DOSES.filter((d) => d.drug !== exclude)
    : DOSES;
  return pool[Math.floor(Math.random() * pool.length)] ?? DOSES[0];
}

/** Soft UI chimes via Web Audio — no asset files. */
function playTone(
  ctx: AudioContext,
  {
    freq,
    start,
    dur,
    type = "sine",
    gain = 0.045,
  }: {
    freq: number;
    start: number;
    dur: number;
    type?: OscillatorType;
    gain?: number;
  }
) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(gain, start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + dur + 0.02);
}

function playTakenSound(ctx: AudioContext) {
  const t = ctx.currentTime;
  playTone(ctx, { freq: 523.25, start: t, dur: 0.12, gain: 0.05 });
  playTone(ctx, { freq: 659.25, start: t + 0.08, dur: 0.14, gain: 0.045 });
  playTone(ctx, { freq: 783.99, start: t + 0.16, dur: 0.22, gain: 0.04 });
}

function playShuffleSound(ctx: AudioContext) {
  const t = ctx.currentTime;
  playTone(ctx, {
    freq: 392,
    start: t,
    dur: 0.08,
    type: "triangle",
    gain: 0.03,
  });
  playTone(ctx, {
    freq: 494,
    start: t + 0.06,
    dur: 0.1,
    type: "triangle",
    gain: 0.028,
  });
}

function playHoverSound(ctx: AudioContext) {
  playTone(ctx, {
    freq: 880,
    start: ctx.currentTime,
    dur: 0.05,
    type: "sine",
    gain: 0.018,
  });
}

export default function HeroDoseCard() {
  const reduce = useReducedMotion();
  const [dose, setDose] = useState<Dose>(() => pickDose());
  const [taken, setTaken] = useState(false);
  const [wiggle, setWiggle] = useState(0);
  const audioRef = useRef<AudioContext | null>(null);
  const hoverArmed = useRef(true);

  const audio = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!audioRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      audioRef.current = new AC();
    }
    const ctx = audioRef.current;
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  }, []);

  const celebrate = useCallback(() => {
    if (taken) return;
    const ctx = audio();
    if (ctx) playTakenSound(ctx);
    setTaken(true);
    setWiggle((n) => n + 1);
    window.setTimeout(() => {
      setDose((prev) => pickDose(prev.drug));
      setTaken(false);
    }, 1600);
  }, [audio, taken]);

  const shuffle = useCallback(() => {
    if (taken) return;
    const ctx = audio();
    if (ctx) playShuffleSound(ctx);
    setDose((prev) => pickDose(prev.drug));
    setWiggle((n) => n + 1);
  }, [audio, taken]);

  const onHover = useCallback(() => {
    if (!hoverArmed.current || taken) return;
    hoverArmed.current = false;
    const ctx = audio();
    if (ctx) playHoverSound(ctx);
    window.setTimeout(() => {
      hoverArmed.current = true;
    }, 900);
  }, [audio, taken]);

  const floatClass = reduce ? "" : "ndo-float";

  const status = useMemo(() => {
    if (taken) return { label: "Taken", line: "Nice — one less to remember" };
    return { label: "Due soon", line: dose.hint };
  }, [taken, dose.hint]);

  return (
    <m.div
      initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: reduce ? 0 : 0.55,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`absolute bottom-24 right-4 z-20 hidden max-w-[240px] md:block lg:right-8 ${floatClass}`}
      onMouseEnter={onHover}
    >
      <m.div
        key={wiggle}
        animate={
          reduce
            ? undefined
            : taken
              ? { scale: [1, 1.04, 1], rotate: [0, -1.5, 1.2, 0] }
              : { rotate: [0, -2, 2, -1, 0] }
        }
        transition={{ duration: reduce ? 0 : taken ? 0.55 : 0.45, ease: "easeOut" }}
        className="overflow-hidden rounded-2xl border border-white/20 bg-[#031428]/88 p-3.5 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.65)] backdrop-blur-md"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p
              className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${
                taken ? "text-[#3dcfb6]" : "text-white/55"
              }`}
            >
              {status.label}
            </p>
            <p className="mt-1 truncate text-[13px] font-semibold text-white">
              {dose.drug}
            </p>
            <p className="text-[11px] text-white/65">{dose.when}</p>
          </div>
          <m.span
            animate={
              reduce || taken
                ? undefined
                : { y: [0, -2, 0], rotate: [0, 8, -6, 0] }
            }
            transition={
              reduce
                ? undefined
                : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
            }
            className={`grid size-8 shrink-0 place-items-center rounded-xl ${
              taken
                ? "bg-[#3dcfb6] text-[#031428]"
                : "bg-white/10 text-[#3dcfb6]"
            }`}
          >
            {taken ? (
              <Check className="size-4" strokeWidth={2.5} />
            ) : (
              <Pill className="size-4" strokeWidth={1.85} />
            )}
          </m.span>
        </div>

        <p className="mt-2 text-[11px] leading-snug text-white/55">
          {status.line}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={celebrate}
            disabled={taken}
            className="ndo-press flex-1 rounded-xl bg-[#3dcfb6] px-2.5 py-1.5 text-[11px] font-bold text-[#031428] disabled:opacity-70"
          >
            {taken ? "Logged ✓" : "Mark taken"}
          </button>
          <button
            type="button"
            onClick={shuffle}
            disabled={taken}
            className="ndo-press group grid size-8 place-items-center rounded-xl border border-white/20 text-white/75 hover:bg-white/10 hover:text-white disabled:opacity-40"
            aria-label="Show another dose"
            title="Another dose"
          >
            <RefreshCw className="ndo-spin size-3.5" strokeWidth={2} />
          </button>
        </div>
      </m.div>
    </m.div>
  );
}
