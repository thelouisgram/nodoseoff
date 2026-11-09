import { randomUUID } from "crypto";
import type { UIMessage } from "ai";
import { getSql } from "@/lib/db";

const MAX_STORED_MESSAGES = 80;
const MAX_LIST = 50;

export type AiChatSummary = {
  id: string;
  title: string;
  updatedAt: string;
  preview: string;
  messageCount: number;
};

export type AiChat = {
  id: string;
  title: string;
  messages: UIMessage[];
  updatedAt: string;
};

function sanitizeMessages(messages: unknown): UIMessage[] {
  if (!Array.isArray(messages)) return [];
  const cleaned: UIMessage[] = [];
  for (const raw of messages) {
    if (!raw || typeof raw !== "object") continue;
    const m = raw as Partial<UIMessage>;
    if (typeof m.id !== "string" || !m.id) continue;
    if (m.role !== "user" && m.role !== "assistant" && m.role !== "system") {
      continue;
    }
    if (!Array.isArray(m.parts)) continue;
    cleaned.push({
      id: m.id,
      role: m.role,
      parts: m.parts,
    } as UIMessage);
  }
  return cleaned.slice(-MAX_STORED_MESSAGES);
}

function firstUserText(messages: UIMessage[]): string {
  for (const m of messages) {
    if (m.role !== "user") continue;
    const text = m.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("")
      .trim();
    if (text) return text;
  }
  return "";
}

function titleFromMessages(messages: UIMessage[]): string {
  const text = firstUserText(messages);
  if (!text) return "New chat";
  return text.length > 60 ? `${text.slice(0, 57)}…` : text;
}

function previewFromMessages(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    const text = m.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("")
      .trim();
    if (text) {
      return text.length > 90 ? `${text.slice(0, 87)}…` : text;
    }
  }
  return "No messages yet";
}

export async function listAiChats(userId: string): Promise<AiChatSummary[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, title, messages, updated_at
    FROM ai_chats
    WHERE "userId" = ${userId}
    ORDER BY updated_at DESC
    LIMIT ${MAX_LIST}
  `;
  return rows.map((row) => {
    const messages = sanitizeMessages(row.messages);
    return {
      id: String(row.id),
      title: String(row.title || "New chat"),
      updatedAt: new Date(row.updated_at as string | Date).toISOString(),
      preview: previewFromMessages(messages),
      messageCount: messages.length,
    };
  });
}

export async function getAiChat(
  userId: string,
  chatId: string
): Promise<AiChat | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, title, messages, updated_at
    FROM ai_chats
    WHERE id = ${chatId} AND "userId" = ${userId}
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) return null;
  return {
    id: String(row.id),
    title: String(row.title || "New chat"),
    messages: sanitizeMessages(row.messages),
    updatedAt: new Date(row.updated_at as string | Date).toISOString(),
  };
}

export async function createAiChat(
  userId: string,
  messages: UIMessage[] = []
): Promise<AiChat> {
  const sql = getSql();
  const id = randomUUID();
  const cleaned = sanitizeMessages(messages);
  const title = titleFromMessages(cleaned);
  await sql`
    INSERT INTO ai_chats (id, "userId", title, messages, created_at, updated_at)
    VALUES (${id}, ${userId}, ${title}, ${JSON.stringify(cleaned)}::jsonb, NOW(), NOW())
  `;
  return {
    id,
    title,
    messages: cleaned,
    updatedAt: new Date().toISOString(),
  };
}

export async function saveAiChat(
  userId: string,
  chatId: string,
  messages: UIMessage[]
): Promise<AiChat | null> {
  const cleaned = sanitizeMessages(messages);
  if (cleaned.length === 0) {
    return getAiChat(userId, chatId);
  }
  const sql = getSql();
  const title = titleFromMessages(cleaned);
  const rows = await sql`
    UPDATE ai_chats
    SET
      messages = ${JSON.stringify(cleaned)}::jsonb,
      title = CASE
        WHEN title = 'New chat' OR title = '' THEN ${title}
        ELSE title
      END,
      updated_at = NOW()
    WHERE id = ${chatId} AND "userId" = ${userId}
    RETURNING id, title, messages, updated_at
  `;
  const row = rows[0];
  if (!row) return null;
  return {
    id: String(row.id),
    title: String(row.title || "New chat"),
    messages: sanitizeMessages(row.messages),
    updatedAt: new Date(row.updated_at as string | Date).toISOString(),
  };
}

export async function deleteAiChat(
  userId: string,
  chatId: string
): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`
    DELETE FROM ai_chats
    WHERE id = ${chatId} AND "userId" = ${userId}
    RETURNING id
  `;
  return Boolean(rows[0]);
}
