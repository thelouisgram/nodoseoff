"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterForm({
  source = "footer",
}: {
  source?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        ok?: boolean;
      };

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Could not subscribe. Try again.");
        return;
      }

      setStatus("success");
      setMessage("You're in — thanks for joining.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Could not subscribe. Try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-start gap-2.5 border border-white/15 bg-white/5 px-3.5 py-3">
        <Check className="mt-0.5 size-4 shrink-0 text-[#7dcea0]" strokeWidth={2} />
        <p className="text-[13px] leading-relaxed text-white/85">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2.5">
      <label htmlFor="newsletter-email" className="sr-only">
        Email for newsletter
      </label>
      <div className="flex flex-col gap-2 ss:flex-row">
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="you@example.com"
          className="min-w-0 flex-1 border border-white/15 bg-white/5 px-3.5 py-2.5 text-[14px] text-white outline-none placeholder:text-white/40 focus:border-white/40"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 border border-white/20 bg-white px-4 py-2.5 text-[13px] font-semibold text-[#0b1a2e] transition hover:bg-white/90 disabled:opacity-60"
        >
          {status === "loading" ? (
            <Loader2 className="size-4 animate-spin" strokeWidth={2} />
          ) : (
            <>
              Join
              <ArrowRight className="size-3.5" strokeWidth={2} />
            </>
          )}
        </button>
      </div>
      {status === "error" && message ? (
        <p className="text-[12px] text-[#f0a8b8]">{message}</p>
      ) : (
        <p className="text-[11px] leading-relaxed text-white/45">
          Tips on sticking with treatment. Unsubscribe anytime.
        </p>
      )}
    </form>
  );
}
