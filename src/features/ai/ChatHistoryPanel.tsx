"use client";

import { History, Loader2, Plus, Trash2, X } from "lucide-react";
import type { AiChatSummary } from "@/lib/ai/history";

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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center ss:items-center">
      <button
        type="button"
        aria-label="Close history"
        className="absolute inset-0 bg-soft-ink/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[85dvh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-black/[0.05] bg-white shadow-soft-md ss:rounded-3xl">
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
            className="flex size-9 items-center justify-center rounded-xl text-soft-muted transition hover:bg-soft-canvas hover:text-soft-ink"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="border-b border-black/[0.05] p-3">
          <button
            type="button"
            onClick={onNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-soft-primary px-3 py-2.5 text-[13px] font-semibold text-white shadow-soft-sm transition hover:bg-soft-primary/90"
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
          ) : (
            <ul className="space-y-1">
              {chats.map((chat) => {
                const active = chat.id === activeChatId;
                return (
                  <li key={chat.id} className="group relative">
                    <button
                      type="button"
                      onClick={() => onSelect(chat.id)}
                      className={`w-full rounded-xl px-3 py-3 text-left transition ${
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
                      className="absolute bottom-2.5 right-2 flex size-8 items-center justify-center rounded-lg text-soft-muted opacity-100 transition hover:bg-white hover:text-red-600 ss:opacity-0 ss:group-hover:opacity-100"
                      aria-label={`Delete ${chat.title}`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
