import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";
import { requireUserId } from "@/lib/server/auth";
import {
  DRUG_ASSISTANT_SYSTEM,
  formatAiProviderError,
  getLanguageModel,
} from "@/lib/ai/neon";
import { AI_DAILY_PROMPT_LIMIT, consumeAiPrompt } from "@/lib/ai/quota";
import { buildUserMedsContext } from "@/lib/ai/user-meds";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const userId = await requireUserId(req);

    const body = (await req.json()) as { messages?: UIMessage[] };
    const messages = body?.messages ?? [];
    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "messages required" }, { status: 400 });
    }

    const quota = await consumeAiPrompt(userId);
    if (!quota) {
      return Response.json(
        {
          error: `Daily AI limit reached (${AI_DAILY_PROMPT_LIMIT} prompts/day). Try again tomorrow.`,
          limit: AI_DAILY_PROMPT_LIMIT,
          remaining: 0,
        },
        {
          status: 429,
          headers: {
            "X-AI-Prompt-Limit": String(AI_DAILY_PROMPT_LIMIT),
            "X-AI-Prompt-Remaining": "0",
          },
        }
      );
    }

    const medsContext = await buildUserMedsContext(userId);
    const system = `${DRUG_ASSISTANT_SYSTEM}\n\n${medsContext}`;

    const result = streamText({
      model: getLanguageModel(),
      system,
      messages: await convertToModelMessages(messages.slice(-20)),
      maxOutputTokens: 1200,
    });

    return result.toUIMessageStreamResponse({
      headers: {
        "X-AI-Prompt-Limit": String(quota.limit),
        "X-AI-Prompt-Remaining": String(quota.remaining),
        "X-AI-Prompt-Used": String(quota.used),
      },
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
