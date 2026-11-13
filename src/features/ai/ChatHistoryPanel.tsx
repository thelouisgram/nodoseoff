"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { History, Loader2, Plus, Search, Trash2, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { AiChatSummary } from "@/lib/ai/history";
import { ndoEase } from "@/components/landing/motion";

function formatWhen(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const sameDay =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();
    if (sameDay) {
      return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

type Props = {
  open: boolean;
  loading: boolean;
  chats: AiChatSummary[];
  activeChatId: string | null;
  onClose: () => void;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function ChatHistoryPanel({
  open,
  loading,
  chats,
  activeChatId,
  onClose,
  onNewChat,
  onSelect,
  onDelete,
}: Props) {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const t = window.setTimeout(() => searchRef.current?.focus(), 80);
    return () => window.clearTimeout(t);
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.preview.toLowerCase().includes(q)
    );
  }, [chats, query]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="amanda-history"
          className="fixed inset-0 z-[60] flex items-end justify-center ss:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
        >
          <button
            type="button"
            aria-label="Close history"
            className="absolute inset-0 bg-soft-ink/30 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Chat history"
            initial={
              reduce
                ? { opacity: 1 }
                : { opacity: 0, y: 28, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 16, scale: 0.98 }
            }
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 0.32, ease: ndoEase }
            }
            className="relative z-10 flex max-h-[85dvh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-black/[0.05] bg-white shadow-soft-md ss:rounded-3xl"
          >
            <div className="flex items-center justify-between border-b border-black/[0.05] px-4 py-3.5">
              <div className="flex items-center gap-2">
                <History className="size-4 text-soft-primary" strokeWidth={2} />
                <h2 className="text-[15px] font-semibold text-soft-ink">
                  Chat history
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="ndo-press flex size-9 items-center justify-center rounded-xl text-soft-muted transition hover:bg-soft-canvas hover:text-soft-ink"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-2 border-b border-black/[0.05] p-3">
              <div className="flex items-center gap-2 rounded-xl border border-black/[0.06] bg-soft-canvas/70 px-3 py-2.5 focus-within:border-soft-primary/25 focus-within:bg-white focus-within:ring-4 focus-within:ring-soft-primary/[0.06]">
                <Search
                  className="size-4 shrink-0 text-soft-muted"
                  strokeWidth={2}
                />
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search chats…"
                  className="min-w-0 flex-1 bg-transparent text-[14px] text-soft-ink outline-none placeholder:text-soft-muted"
                  aria-label="Search chat history"
                />
                {query.trim() ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="ndo-press grid size-7 place-items-center rounded-lg text-soft-muted hover:bg-white hover:text-soft-ink"
                    aria-label="Clear search"
                  >
                    <X className="size-3.5" strokeWidth={2} />
                  </button>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onNewChat}
                className="ndo-press flex w-full items-center justify-center gap-2 rounded-xl bg-soft-primary px-3 py-2.5 text-[13px] font-semibold text-white shadow-soft-sm hover:bg-soft-primary/90"
              >
                <Plus className="size-4" strokeWidth={2.25} />
                New chat
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-12 text-[13px] text-soft-muted">
                  <Loader2 className="size-4 animate-spin" />
                  Loading…
                </div>
              ) : chats.length === 0 ? (
                <p className="px-3 py-10 text-center text-[13px] text-soft-muted">
                  No past chats yet. Ask something and it will show up here.
                </p>
              ) : filtered.length === 0 ? (
                <p className="px-3 py-10 text-center text-[13px] text-soft-muted">
                  No chats match “{query.trim()}”.
                </p>
              ) : (
                <motion.ul
                  className="space-y-1"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: {
                      transition: {
                        staggerChildren: reduce ? 0 : 0.04,
                        delayChildren: reduce ? 0 : 0.04,
                      },
                    },
                  }}
                >
                  {filtered.map((chat) => {
                    const active = chat.id === activeChatId;
                    return (
                      <motion.li
                        key={chat.id}
                        className="group relative"
                        variants={{
                          hidden: reduce
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 8 },
                          show: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.28, ease: ndoEase },
                          },
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => onSelect(chat.id)}
                          className={`ndo-press w-full rounded-xl px-3 py-3 text-left transition ${
                            active
                              ? "bg-soft-primary-soft"
                              : "hover:bg-soft-canvas"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="line-clamp-1 text-[13px] font-semibold text-soft-ink">
                              {chat.title}
                            </p>
                            <span className="shrink-0 text-[11px] text-soft-muted">
                              {formatWhen(chat.updatedAt)}
                            </span>
                          </div>
                          <p className="mt-0.5 line-clamp-2 pr-8 text-[12px] text-soft-muted">
                            {chat.preview}
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(chat.id);
                          }}
                          className="ndo-press absolute bottom-2.5 right-2 flex size-8 items-center justify-center rounded-lg text-soft-muted opacity-100 transition hover:bg-white hover:text-red-600 ss:opacity-0 ss:group-hover:opacity-100"
                          aria-label={`Delete ${chat.title}`}
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
