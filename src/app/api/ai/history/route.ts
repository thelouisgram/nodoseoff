import type { UIMessage } from "ai";
import { requireUserId } from "@/lib/server/auth";
import { createAiChat, listAiChats } from "@/lib/ai/history";

/** List chat threads for the signed-in user. */
export async function GET(req: Request) {
  try {
    const userId = await requireUserId(req);
    const chats = await listAiChats(userId);
    return Response.json({ chats });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("ai/history GET error:", error);
    return Response.json({ error: "Failed to load chat history" }, { status: 500 });
  }
}

/** Create a new empty chat thread (or seed with messages). */
export async function POST(req: Request) {
  try {
    const userId = await requireUserId(req);
    let messages: UIMessage[] = [];
    try {
      const body = (await req.json()) as { messages?: UIMessage[] };
      messages = body?.messages ?? [];
    } catch {
      /* empty body ok */
    }
    const chat = await createAiChat(userId, messages);
    return Response.json({ chat });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("ai/history POST error:", error);
    return Response.json({ error: "Failed to create chat" }, { status: 500 });
  }
}
