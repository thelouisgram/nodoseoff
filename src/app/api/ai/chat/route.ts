import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { requireUserId } from "@/lib/server/auth";
import {
  DRUG_ASSISTANT_SYSTEM,
  formatAiProviderError,
  getLanguageModel,
} from "@/lib/ai/neon";
import { consumeAiPrompt } from "@/lib/ai/quota";
import { buildUserMedsContext } from "@/lib/ai/user-meds";
import { createAmandaTools } from "@/lib/ai/add-medication";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const userId = await requireUserId(req);

    const body = (await req.json()) as {
      messages?: UIMessage[];
      clientNow?: string;
      timeZone?: string;
    };
    const messages = body?.messages ?? [];
    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "messages required" }, { status: 400 });
    }

    const quota = await consumeAiPrompt(userId);
    if (!quota) {
      return Response.json(
        {
          error: "AMANDA is resting for today. Try again tomorrow.",
          remaining: 0,
        },
        {
          status: 429,
        }
      );
    }

    const clientNow =
      typeof body.clientNow === "string" ? body.clientNow.slice(0, 40) : undefined;
    const timeZone =
      typeof body.timeZone === "string" ? body.timeZone.slice(0, 64) : undefined;

    const medsContext = await buildUserMedsContext(userId, {
      nowIso: clientNow,
      timeZone,
    });
    const system = `${DRUG_ASSISTANT_SYSTEM}\n\n${medsContext}`;

    const result = streamText({
      model: getLanguageModel(),
      system,
      messages: await convertToModelMessages(messages.slice(-20)),
      tools: createAmandaTools(userId),
      stopWhen: stepCountIs(4),
      maxOutputTokens: 1200,
    });

    return result.toUIMessageStreamResponse({
      sendReasoning: false,
      onError: (error) => formatAiProviderError(error),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = formatAiProviderError(error);
    console.error("ai/chat error:", error);
    const status = /paid_plan|not enabled|No AI provider|Add GOOGLE/i.test(
      message
    )
      ? 402
      : 500;
    return Response.json({ error: message }, { status });
  }
}
