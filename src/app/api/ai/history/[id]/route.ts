import type { UIMessage } from "ai";
import { requireUserId } from "@/lib/server/auth";
import { deleteAiChat, getAiChat, saveAiChat } from "@/lib/ai/history";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Ctx) {
  try {
    const userId = await requireUserId(req);
    const { id } = await ctx.params;
    const chat = await getAiChat(userId, id);
    if (!chat) {
      return Response.json({ error: "Chat not found" }, { status: 404 });
    }
    return Response.json({ chat });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("ai/history/[id] GET error:", error);
    return Response.json({ error: "Failed to load chat" }, { status: 500 });
  }
}

export async function PUT(req: Request, ctx: Ctx) {
  try {
    const userId = await requireUserId(req);
    const { id } = await ctx.params;
    const body = (await req.json()) as { messages?: UIMessage[] };
    const chat = await saveAiChat(userId, id, body?.messages ?? []);
    if (!chat) {
      return Response.json({ error: "Chat not found" }, { status: 404 });
    }
    return Response.json({ chat });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("ai/history/[id] PUT error:", error);
    return Response.json({ error: "Failed to save chat" }, { status: 500 });
  }
}

export async function DELETE(req: Request, ctx: Ctx) {
  try {
    const userId = await requireUserId(req);
    const { id } = await ctx.params;
    const ok = await deleteAiChat(userId, id);
    if (!ok) {
      return Response.json({ error: "Chat not found" }, { status: 404 });
    }
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("ai/history/[id] DELETE error:", error);
    return Response.json({ error: "Failed to delete chat" }, { status: 500 });
  }
}
