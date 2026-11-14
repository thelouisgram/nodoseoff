"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";

export type TeamMember = {
  name: string;
  role: string;
  blurb: string;
  /** Drop a photo at this public path — placeholder shows until then. */
  image: string;
  initials: string;
  /** Extra object-position / scale for awkward full-body sources */
  imageClassName?: string;
};

export default function TeamMemberCard({ member }: { member: TeamMember }) {
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const showPhoto = Boolean(member.image) && !failed;
  const reduce = useReducedMotion();
  const controls = useAnimationControls();

  const playWiggle = useCallback(async () => {
    if (reduce || busy) return;
    setBusy(true);
    await controls.start({
      rotate: [12, -8, 16, -4, 12],
      scale: [1, 1.18, 1.08, 1.14, 1],
      y: [0, -3, 1, -2, 0],
      transition: { duration: 0.55, ease: "easeInOut" },
    });
    setBusy(false);
  }, [busy, controls, reduce]);

  return (
    <article className="group/card relative overflow-visible rounded-2xl border border-black/[0.05] bg-white shadow-soft-sm">
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-2xl bg-soft-primary-soft">
        {showPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element -- optional team assets; fall back if missing
          <img
            src={member.image}
            alt={member.name}
            className={`absolute inset-0 size-full object-cover object-[center_8%] ${member.imageClassName ?? ""}`}
            onError={() => setFailed(true)}
          />
        ) : null}
        {!showPhoto ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-soft-primary-soft to-[#dff5ee] px-4 text-center">
            <span className="grid size-16 place-items-center rounded-2xl bg-white/80 text-[1.35rem] font-bold tracking-tight text-soft-primary shadow-soft-sm">
              {member.initials}
            </span>
            <p className="text-[11px] font-medium text-soft-muted">
              Add photo at
              <br />
              <span className="font-mono text-[10px] text-soft-ink/70">
                {member.image}
              </span>
            </p>
          </div>
        ) : null}
      </div>

      <div className="relative flex min-h-[5.75rem] flex-col overflow-visible p-4 pr-8 ss:p-5 ss:pr-9">
        <h3 className="text-[16px] font-bold tracking-tight text-soft-ink">
          {member.name}
        </h3>
        <p className="mt-1 min-h-[2.4em] text-[11px] font-semibold uppercase leading-snug tracking-[0.08em] text-soft-primary">
          {member.role}
        </p>
        {member.blurb ? (
          <p className="mt-2 text-[13px] leading-relaxed text-soft-muted">
            {member.blurb}
          </p>
        ) : null}

        <motion.button
          type="button"
          aria-label="NoDoseOff mark"
          className="absolute -right-2 top-4 z-[2] size-5 cursor-pointer ss:-right-2.5 ss:size-[1.35rem]"
          style={{ rotate: 12 }}
          animate={controls}
          whileHover={
            reduce
              ? undefined
              : {
                  scale: 1.15,
                  rotate: 20,
                  opacity: 1,
                  transition: { type: "spring", stiffness: 420, damping: 14 },
                }
          }
          whileTap={
            reduce
              ? undefined
              : {
                  scale: 0.9,
                  rotate: 4,
                  transition: { type: "spring", stiffness: 500, damping: 16 },
                }
          }
          initial={{ opacity: 0.7 }}
          onHoverStart={() => {
            if (!reduce) void controls.start({ opacity: 1 });
          }}
          onHoverEnd={() => {
            if (!busy && !reduce) {
              void controls.start({
                rotate: 12,
                scale: 1,
                y: 0,
                opacity: 0.7,
                transition: { type: "spring", stiffness: 320, damping: 20 },
              });
            }
          }}
          onClick={() => void playWiggle()}
        >
          <Image
            src="/assets/logo/logo-blue.png"
            alt=""
            width={22}
            height={22}
            className="size-full select-none drop-shadow-[0_3px_8px_rgba(0,40,96,0.18)]"
            draggable={false}
          />
        </motion.button>
      </div>
    </article>
  );
}
