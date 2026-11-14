"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  History,
  Loader2,
  Plus,
  SendHorizontal,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SoftSectionHeader } from "@/components/ui/soft";
import { getAccessToken } from "@/lib/auth/client";
import { toast } from "sonner";
import ChatHistoryPanel from "./ChatHistoryPanel";
import type { AiChatSummary } from "@/lib/ai/history";
import { AMANDA_PREFILL_KEY } from "@/utils/dashboard/homeInsights";
import { AnimatePresence, motion } from "framer-motion";
import {
  ndoEase,
  useDashboardSectionMotion,
} from "@/components/landing/motion";
import AmandaMark from "@/Layout/marketing/AmandaMark";

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 px-0.5 py-1" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-soft-primary/55"
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -2, 0] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.14,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

const ACTIVE_CHAT_KEY = "nodoseoff_ai_chat_id";

const FALLBACK_SUGGESTIONS = [
  "Tips for remembering evening doses",
  "When should I call a doctor about a rash from a new drug?",
  "What should I ask my pharmacist about a new prescription?",
  "How do I store medications safely at home?",
];

type AiUsage = {
  limit: number;
  used: number;
  remaining: number;
  day: string;
  drugNames: string[];
};

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function buildSuggestions(drugNames: string[]): string[] {
  if (drugNames.length === 0) return FALLBACK_SUGGESTIONS;
  const first = drugNames[0];
  const second = drugNames[1];
  return [
    "Any interactions among my medications?",
    first
      ? `Common side effects of ${first}?`
      : "Common side effects of my medications?",
    "Tips for remembering my evening doses",
    second
      ? `Can I take ${first} and ${second} together?`
      : "When should I call a doctor about a side effect?",
  ].filter(Boolean);
}

function messageText(m: UIMessage): string {
  return m.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export default function AiAssistant() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const persistEnabled = useRef(false);
  const chatIdRef = useRef<string | null>(null);
  const prefillConsumed = useRef(false);
  const [input, setInput] = useState("");
  const [usage, setUsage] = useState<AiUsage | null>(null);
  const [historyReady, setHistoryReady] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [chatList, setChatList] = useState<AiChatSummary[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [switching, setSwitching] = useState(false);
  const { reduce, stagger, rise } = useDashboardSectionMotion();

  const refreshUsage = useCallback(async () => {
    try {
      const res = await fetch("/api/ai/usage", {
        headers: await authHeaders(),
        credentials: "include",
      });
      if (!res.ok) return;
      setUsage((await res.json()) as AiUsage);
    } catch {
      /* non-blocking */
    }
  }, []);

  const refreshChatList = useCallback(async () => {
    setListLoading(true);
    try {
      const res = await fetch("/api/ai/history", {
        headers: await authHeaders(),
        credentials: "include",
      });
      if (!res.ok) return;
      const data = (await res.json()) as { chats?: AiChatSummary[] };
      setChatList(Array.isArray(data.chats) ? data.chats : []);
    } catch {
      /* non-blocking */
    } finally {
      setListLoading(false);
    }
  }, []);

  const persistMessages = useCallback(async (next: UIMessage[]) => {
    if (!next.length) return;
    let id = chatIdRef.current;
    try {
      if (!id) {
        const created = await fetch("/api/ai/history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(await authHeaders()),
          },
          credentials: "include",
          body: JSON.stringify({ messages: next }),
        });
        if (!created.ok) return;
        const data = (await created.json()) as {
          chat?: { id: string };
        };
        id = data.chat?.id ?? null;
        if (!id) return;
        chatIdRef.current = id;
        setActiveChatId(id);
        try {
          localStorage.setItem(ACTIVE_CHAT_KEY, id);
        } catch {
          /* ignore */
        }
        void refreshChatList();
        return;
      }

      await fetch(`/api/ai/history/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(await authHeaders()),
        },
        credentials: "include",
        body: JSON.stringify({ messages: next }),
      });
      void refreshChatList();
    } catch {
      /* non-blocking */
    }
  }, [refreshChatList]);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai/chat",
        headers: async (): Promise<Record<string, string>> => authHeaders(),
        prepareSendMessagesRequest: ({
          messages: chatMessages,
          id,
          body,
          trigger,
          messageId,
        }) => ({
          body: {
            ...body,
            id,
            messages: chatMessages,
            trigger,
            messageId,
            // Fresh device clock each send so AMANDA can answer countdowns.
            clientNow: new Date().toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        }),
      }),
    []
  );

  const { messages, setMessages, sendMessage, status, error, clearError } =
    useChat({
      transport,
      onFinish: ({ messages: finished }) => {
        if (persistEnabled.current) {
          void persistMessages(finished);
        }
      },
    });

  const busy = status === "submitted" || status === "streaming";
  const remaining = usage?.remaining ?? null;
  const outOfPrompts = remaining === 0;

  // Boot: restore last active chat or start empty
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let savedId: string | null = null;
        try {
          savedId = localStorage.getItem(ACTIVE_CHAT_KEY);
        } catch {
          savedId = null;
        }

        const listRes = await fetch("/api/ai/history", {
          headers: await authHeaders(),
          credentials: "include",
        });
        if (listRes.ok) {
          const data = (await listRes.json()) as { chats?: AiChatSummary[] };
          if (!cancelled) {
            setChatList(Array.isArray(data.chats) ? data.chats : []);
          }
        }

        if (savedId) {
          const res = await fetch(`/api/ai/history/${savedId}`, {
            headers: await authHeaders(),
            credentials: "include",
          });
          if (res.ok) {
            const data = (await res.json()) as {
              chat?: { id: string; messages: UIMessage[] };
            };
            if (!cancelled && data.chat) {
              chatIdRef.current = data.chat.id;
              setActiveChatId(data.chat.id);
              if (data.chat.messages?.length) {
                setMessages(data.chat.messages);
              }
            }
          } else {
            try {
              localStorage.removeItem(ACTIVE_CHAT_KEY);
            } catch {
              /* ignore */
            }
          }
        }
      } catch {
        /* start empty */
      } finally {
        if (!cancelled) {
          requestAnimationFrame(() => {
            persistEnabled.current = true;
            setHistoryReady(true);
          });
        }
      }
    })();
    void refreshUsage();
    return () => {
      cancelled = true;
      persistEnabled.current = false;
    };
  }, [setMessages, refreshUsage]);

  useEffect(() => {
    if (!historyReady || !persistEnabled.current || busy) return;
    if (messages.length === 0) return;
    const t = setTimeout(() => {
      void persistMessages(messages);
    }, 500);
    return () => clearTimeout(t);
  }, [messages, busy, historyReady, persistMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status]);

  useEffect(() => {
    if (status === "ready" && messages.length > 0) {
      void refreshUsage();
    }
  }, [status, messages.length, refreshUsage]);

  // Home shortcuts: consume a one-shot prefilled prompt
  useEffect(() => {
    if (
      !historyReady ||
      switching ||
      busy ||
      outOfPrompts ||
      prefillConsumed.current
    ) {
      return;
    }
    let prompt: string | null = null;
    try {
      prompt = sessionStorage.getItem(AMANDA_PREFILL_KEY);
      if (prompt) sessionStorage.removeItem(AMANDA_PREFILL_KEY);
    } catch {
      prompt = null;
    }
    if (!prompt?.trim()) return;
    prefillConsumed.current = true;
    void sendMessage({ text: prompt.trim() });
  }, [historyReady, switching, busy, outOfPrompts, sendMessage]);

  useEffect(() => {
    if (error) {
      const raw = error.message || "AI request failed";
      let message = raw;
      try {
        const parsed = JSON.parse(raw) as { error?: string };
        if (parsed?.error) message = parsed.error;
      } catch {
        /* plain text */
      }
      toast.error(message);
      clearError();
      void refreshUsage();
    }
  }, [error, clearError, refreshUsage]);

  const openHistory = () => {
    setHistoryOpen(true);
    void refreshChatList();
  };

  const startNewChat = async () => {
    if (busy || switching) return;
    setSwitching(true);
    try {
      // Save current thread first if it has messages
      if (messages.length > 0 && chatIdRef.current) {
        await persistMessages(messages);
      }
      chatIdRef.current = null;
      setActiveChatId(null);
      setMessages([]);
      try {
        localStorage.removeItem(ACTIVE_CHAT_KEY);
      } catch {
        /* ignore */
      }
      setHistoryOpen(false);
    } finally {
      setSwitching(false);
    }
  };

  const openChat = async (id: string) => {
    if (busy || switching || id === chatIdRef.current) {
      setHistoryOpen(false);
      return;
    }
    setSwitching(true);
    persistEnabled.current = false;
    try {
      if (messages.length > 0 && chatIdRef.current) {
        await persistMessages(messages);
      }
      const res = await fetch(`/api/ai/history/${id}`, {
        headers: await authHeaders(),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to open chat");
      const data = (await res.json()) as {
        chat?: { id: string; messages: UIMessage[] };
      };
      if (!data.chat) throw new Error("Chat missing");
      chatIdRef.current = data.chat.id;
      setActiveChatId(data.chat.id);
      setMessages(data.chat.messages ?? []);
      try {
        localStorage.setItem(ACTIVE_CHAT_KEY, data.chat.id);
      } catch {
        /* ignore */
      }
      setHistoryOpen(false);
    } catch {
      toast.error("Could not open that chat");
    } finally {
      requestAnimationFrame(() => {
        persistEnabled.current = true;
        setSwitching(false);
      });
    }
  };

  const deleteChat = async (id: string) => {
    try {
      const res = await fetch(`/api/ai/history/${id}`, {
        method: "DELETE",
        headers: await authHeaders(),
        credentials: "include",
      });
      if (!res.ok) throw new Error("delete failed");
      setChatList((prev) => prev.filter((c) => c.id !== id));
      if (chatIdRef.current === id) {
        chatIdRef.current = null;
        setActiveChatId(null);
        setMessages([]);
        try {
          localStorage.removeItem(ACTIVE_CHAT_KEY);
        } catch {
          /* ignore */
        }
      }
      toast.success("Chat deleted");
    } catch {
      toast.error("Could not delete chat");
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy || outOfPrompts || !historyReady || switching) return;
    setInput("");
    await sendMessage({ text });
  };

  const ask = async (text: string) => {
    if (busy || outOfPrompts || !historyReady || switching) return;
    setInput("");
    await sendMessage({ text });
  };

  const suggestions = buildSuggestions(usage?.drugNames ?? []);
  const limit = usage?.limit ?? 5;
  const hideComposer = outOfPrompts && messages.length === 0;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={stagger}
      className="relative flex h-full w-full flex-col overflow-hidden bg-soft-canvas px-4 pb-[calc(5.25rem+env(safe-area-inset-bottom))] pt-6 font-jakarta text-soft-ink ss:px-8 md:px-12 md:pb-10 md:pt-10"
    >
      <motion.div
        variants={rise}
        className="relative z-10 mb-2 flex items-start justify-between gap-3"
      >
        <div className="mb-0 flex min-w-0 flex-1 items-start gap-3">
          <AmandaMark className="mt-0.5 size-10 shrink-0 ss:size-11" pulse />
          <SoftSectionHeader
            className="mb-0 min-w-0 flex-1 [&_h1]:text-[22px] ss:[&_h1]:text-[28px] [&_p]:truncate [&_p]:text-[13px] ss:[&_p]:text-[14px]"
            title="AMANDA 6"
            subtitle="Meds, side effects, and adherence."
          />
        </div>
        <div className="relative z-10 flex shrink-0 items-center gap-1.5 pt-0.5">
          <button
            type="button"
            onClick={() => void startNewChat()}
            disabled={busy || switching}
            className="ndo-press inline-flex items-center gap-1 rounded-lg border border-black/[0.06] bg-white px-2.5 py-1.5 text-[12px] font-semibold text-soft-ink shadow-soft-sm hover:bg-soft-canvas disabled:opacity-45"
          >
            <Plus className="size-3.5" strokeWidth={2.25} />
            New
          </button>
          <button
            type="button"
            onClick={openHistory}
            className="ndo-press inline-flex items-center gap-1 rounded-lg bg-soft-primary px-2.5 py-1.5 text-[12px] font-semibold text-white shadow-soft-sm hover:bg-soft-primary/90"
          >
            <History className="size-3.5" strokeWidth={2.25} />
            History
          </button>
        </div>
      </motion.div>

      <motion.div
        variants={rise}
        className="mb-2 flex items-center justify-between gap-3 text-[12px] text-soft-muted"
      >
        <p className="min-w-0 truncate">
          {usage?.drugNames?.length
            ? `${usage.drugNames.length} med${usage.drugNames.length === 1 ? "" : "s"} loaded`
            : "No meds yet — add some in Drugs"}
        </p>
        <p
          className={`shrink-0 font-semibold tabular-nums ${
            outOfPrompts ? "text-[#8a3d5a]" : "text-soft-ink"
          }`}
        >
          {usage ? `${usage.remaining}/${usage.limit} today` : "…"}
        </p>
      </motion.div>

      <motion.div
        variants={rise}
        className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-black/[0.05] bg-white shadow-soft-sm"
      >
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 ss:p-5">
          {!historyReady || switching ? (
            <div className="flex items-center gap-2 pt-6 text-[13px] text-soft-muted">
              <Loader2 className="size-4 animate-spin" />
              {switching ? "Opening chat…" : "Loading chat…"}
            </div>
          ) : messages.length === 0 ? (
            <motion.div
              className="flex flex-col gap-4 pt-2"
              initial="hidden"
              animate="show"
              variants={stagger}
            >
              <motion.div
                variants={rise}
                className="flex max-w-md flex-col items-start text-left"
              >
                <AmandaMark className="mb-3 size-10" />
                {outOfPrompts ? (
                  <>
                    <h2 className="text-[16px] font-semibold tracking-tight text-soft-ink">
                      Daily limit reached
                    </h2>
                    <p className="mt-1 text-[13px] leading-relaxed text-soft-muted">
                      You’ve used all {limit} prompts today. Come back tomorrow,
                      or reopen an earlier chat.
                    </p>
                    <button
                      type="button"
                      onClick={openHistory}
                      className="ndo-press mt-4 inline-flex items-center gap-1.5 rounded-lg bg-soft-primary px-3.5 py-2 text-[12px] font-semibold text-white shadow-soft-sm hover:bg-soft-primary/90"
                    >
                      <History className="size-3.5" strokeWidth={2.25} />
                      Open History
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-[16px] font-semibold tracking-tight text-soft-ink">
                      Ask about your medications
                    </h2>
                    <p className="mt-1 text-[13px] leading-relaxed text-soft-muted">
                      Educational only — confirm personal advice with a
                      clinician. {limit} prompts/day.
                    </p>
                  </>
                )}
              </motion.div>

              {!outOfPrompts ? (
                <div className="grid w-full gap-2 ss:grid-cols-2">
                  {suggestions.map((s, i) => (
                    <motion.button
                      key={s}
                      type="button"
                      disabled={busy}
                      onClick={() => void ask(s)}
                      initial={reduce ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: reduce ? 0 : 0.28,
                        delay: reduce ? 0 : 0.08 + i * 0.05,
                        ease: ndoEase,
                      }}
                      className="ndo-press rounded-xl border border-black/[0.05] bg-soft-canvas/70 px-3.5 py-3 text-left text-[13px] font-medium text-soft-ink transition hover:bg-soft-primary-soft disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              ) : null}
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((m) => {
                const text = messageText(m);
                const isUser = m.role === "user";
                return (
                  <motion.div
                    key={m.id}
                    layout
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: reduce ? 0 : 0.28,
                      ease: ndoEase,
                    }}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[92%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed ss:max-w-[75%] ${
                        isUser
                          ? "bg-soft-primary text-white"
                          : "border border-black/[0.05] bg-soft-canvas text-soft-ink"
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{text}</p>
                      ) : (
                        <div className="ai-md [&_a]:text-soft-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-soft-primary/30 [&_blockquote]:pl-3 [&_blockquote]:text-soft-muted [&_code]:rounded [&_code]:bg-black/[0.05] [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[12px] [&_h1]:mb-2 [&_h1]:mt-3 [&_h1]:text-[16px] [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:text-[15px] [&_h2]:font-semibold [&_h3]:mb-1.5 [&_h3]:mt-2.5 [&_h3]:text-[14px] [&_h3]:font-semibold [&_li]:my-0.5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {text}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
          {(() => {
            const last = messages[messages.length - 1];
            const lastText =
              last?.parts
                ?.filter(
                  (p): p is { type: "text"; text: string } => p.type === "text"
                )
                .map((p) => p.text)
                .join("") ?? "";
            const waiting =
              busy &&
              (messages.length === 0 ||
                last?.role === "user" ||
                (last?.role === "assistant" && !lastText.trim()));
            return waiting ? (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-[13px] text-soft-muted"
              >
                <Loader2 className="size-4 animate-spin" />
                Thinking…
              </motion.div>
            ) : null;
          })()}
          <div ref={bottomRef} />
        </div>

        {!hideComposer ? (
          <form
            onSubmit={onSubmit}
            className="shrink-0 border-t border-black/[0.05] bg-white p-3"
          >
            {outOfPrompts ? (
              <p className="mb-2 rounded-lg bg-[#ffe4ee] px-3 py-2 text-center text-[12px] font-medium text-[#8a3d5a]">
                Daily limit reached — back tomorrow for {limit} more.
              </p>
            ) : null}
            <div className="flex items-end gap-2 rounded-xl border border-black/[0.06] bg-soft-canvas/60 p-1.5 focus-within:border-soft-primary/25 focus-within:bg-white focus-within:ring-4 focus-within:ring-soft-primary/[0.06]">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
                disabled={outOfPrompts || !historyReady || switching}
                placeholder={
                  outOfPrompts
                    ? "Limit reached — try again tomorrow"
                    : usage?.drugNames?.length
                      ? "Ask about your meds…"
                      : "Ask about a drug or side effect…"
                }
                className="max-h-28 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2 text-[14px] text-soft-ink outline-none placeholder:text-soft-muted disabled:cursor-not-allowed disabled:opacity-60"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void onSubmit(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={
                  busy ||
                  !input.trim() ||
                  outOfPrompts ||
                  !historyReady ||
                  switching
                }
                className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-soft-primary text-white shadow-soft-sm transition hover:bg-soft-primary/90 disabled:cursor-not-allowed disabled:opacity-45"
                aria-label="Send"
              >
                {busy ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <SendHorizontal className="size-4" strokeWidth={2} />
                )}
              </button>
            </div>
          </form>
        ) : null}
      </motion.div>

      <ChatHistoryPanel
        open={historyOpen}
        loading={listLoading}
        chats={chatList}
        activeChatId={activeChatId}
        onClose={() => setHistoryOpen(false)}
        onNewChat={() => void startNewChat()}
        onSelect={(id) => void openChat(id)}
        onDelete={(id) => void deleteChat(id)}
      />
    </motion.div>
  );
}
