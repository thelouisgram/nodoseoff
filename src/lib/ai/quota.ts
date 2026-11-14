import { getSql } from "@/lib/db";

export const AI_DAILY_PROMPT_LIMIT = 10;

function utcDay(): string {
  return new Date().toISOString().slice(0, 10);
}

export type AiQuota = {
  limit: number;
  used: number;
  remaining: number;
  day: string;
};

async function readUsage(userId: string, day: string): Promise<number> {
  const sql = getSql();
  const rows = await sql`
    SELECT prompts FROM ai_daily_usage
    WHERE "userId" = ${userId} AND day = ${day}::date
    LIMIT 1
  `;
  return Number(rows[0]?.prompts ?? 0);
}

export async function getAiQuota(userId: string): Promise<AiQuota> {
  const day = utcDay();
  const used = await readUsage(userId, day);
  return {
    limit: AI_DAILY_PROMPT_LIMIT,
    used,
    remaining: Math.max(0, AI_DAILY_PROMPT_LIMIT - used),
    day,
  };
}

/**
 * Atomically consume one daily prompt if under the limit.
 * Returns the updated quota, or null if the limit was already reached.
 */
export async function consumeAiPrompt(
  userId: string
): Promise<AiQuota | null> {
  const day = utcDay();
  const sql = getSql();

  const rows = await sql`
    INSERT INTO ai_daily_usage ("userId", day, prompts, updated_at)
    VALUES (${userId}, ${day}::date, 1, NOW())
    ON CONFLICT ("userId", day) DO UPDATE
      SET prompts = ai_daily_usage.prompts + 1,
          updated_at = NOW()
      WHERE ai_daily_usage.prompts < ${AI_DAILY_PROMPT_LIMIT}
    RETURNING prompts
  `;

  if (!rows[0]) {
    const used = await readUsage(userId, day);
    return used >= AI_DAILY_PROMPT_LIMIT
      ? null
      : {
          limit: AI_DAILY_PROMPT_LIMIT,
          used,
          remaining: Math.max(0, AI_DAILY_PROMPT_LIMIT - used),
          day,
        };
  }

  const used = Number(rows[0].prompts);
  return {
    limit: AI_DAILY_PROMPT_LIMIT,
    used,
    remaining: Math.max(0, AI_DAILY_PROMPT_LIMIT - used),
    day,
  };
}
