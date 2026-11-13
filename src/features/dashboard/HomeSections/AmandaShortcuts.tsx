"use client";

import { useMemo } from "react";
import { Sparkles } from "lucide-react";
import type { DrugProps } from "@/types/dashboard";
import {
  AMANDA_PREFILL_KEY,
  buildAmandaShortcuts,
} from "@/utils/dashboard/homeInsights";
import { uniqueDrugDisplayNames } from "@/utils/drugs";
import { useAppDispatch } from "@/store";
import { setActiveTab } from "@/store/appSlice";

type Props = {
  drugs: DrugProps[];
};

export default function AmandaShortcuts({ drugs }: Props) {
  const dispatch = useAppDispatch();
  const prompts = useMemo(
    () => buildAmandaShortcuts(uniqueDrugDisplayNames(drugs)),
    [drugs]
  );

  const openWithPrompt = (prompt: string) => {
    try {
      sessionStorage.setItem(AMANDA_PREFILL_KEY, prompt);
    } catch {
      /* ignore */
    }
    dispatch(setActiveTab("AMANDA 6"));
  };

  return (
    <section className="mx-4 mb-3 ss:mx-8 md:mx-0">
      <div className="mb-2.5 flex items-center gap-2">
        <Sparkles
          className="ndo-twinkle size-3.5 text-soft-primary"
          strokeWidth={2}
        />
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-soft-muted">
          Ask AMANDA 6
        </p>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => openWithPrompt(prompt)}
            className="ndo-press max-w-[240px] shrink-0 rounded-full border border-soft-primary/15 bg-soft-primary-soft px-3.5 py-2 text-left text-[12px] font-medium leading-snug text-soft-primary hover:bg-soft-primary hover:text-white"
          >
            {prompt}
          </button>
        ))}
      </div>
    </section>
  );
}
