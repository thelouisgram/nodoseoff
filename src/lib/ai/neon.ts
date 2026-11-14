import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { gateway, type LanguageModel } from "ai";
import { neon } from "@neon/ai-sdk-provider";

function geminiApiKey(): string | undefined {
  return (
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
    process.env.GOOGLE_GEMINI_API_KEY?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_API_KEY?.trim()
  );
}

/**
 * Resolve a chat model (order matters):
 * 1) Google Gemini — GOOGLE_GENERATIVE_AI_API_KEY / GOOGLE_GEMINI_API_KEY / GEMINI_API_KEY
 * 2) OPENAI_API_KEY
 * 3) AI_GATEWAY_API_KEY / Vercel OIDC
 * 4) Neon AI Gateway — paid Neon plan only
 */
export function getLanguageModel(modelId?: string): LanguageModel {
  const force = process.env.AI_PROVIDER?.trim().toLowerCase();
  const geminiKey = geminiApiKey();

  if ((!force || force === "gemini" || force === "google") && geminiKey) {
    const google = createGoogleGenerativeAI({ apiKey: geminiKey });
    // gemini-3.8-flash often stalls for new AI Studio keys; 3.5-flash-lite is reliable.
    return google(
      modelId || process.env.GEMINI_MODEL || "gemini-3.5-flash-lite"
    );
  }

  if ((!force || force === "openai") && process.env.OPENAI_API_KEY?.trim()) {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY.trim() });
    return openai(modelId || "gpt-5-mini");
  }

  if (
    (!force || force === "vercel") &&
    (process.env.AI_GATEWAY_API_KEY?.trim() || process.env.VERCEL_OIDC_TOKEN)
  ) {
    return gateway(`openai/${modelId || "gpt-5-mini"}`);
  }

  const neonBase = process.env.NEON_AI_GATEWAY_BASE_URL?.trim();
  const neonToken = process.env.NEON_AI_GATEWAY_TOKEN?.trim();
  if ((!force || force === "neon") && neonBase && neonToken) {
    return neon(modelId || "gpt-5-mini");
  }

  throw new Error(
    "Add GOOGLE_GEMINI_API_KEY (or GOOGLE_GENERATIVE_AI_API_KEY) to .env and restart."
  );
}

export function formatAiProviderError(error: unknown): string {
  const msg =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "AI request failed";

  if (
    /paid_plan_required|not enabled on this account's current plan/i.test(msg)
  ) {
    return "Neon AI needs a paid plan. Use GOOGLE_GEMINI_API_KEY in .env instead, then restart.";
  }

  const body = (error as { responseBody?: string })?.responseBody;
  if (body) {
    try {
      const parsed = JSON.parse(body) as { error?: { message?: string } };
      if (parsed?.error?.message) {
        return formatAiProviderError(parsed.error.message);
      }
    } catch {
      /* ignore */
    }
  }

  return msg;
}

export const DRUG_ASSISTANT_SYSTEM = `You are AMANDA 6, NoDoseOff's Adherence & Medication Assistant. You ONLY help with medications, pharmacy basics, dosing concepts, side effects, drug interactions, storage, allergies related to medicines, adherence/reminders, and closely related health education (e.g. when to seek care about a drug reaction). When introducing yourself, you may say you are AMANDA 6.

Scope (in-bounds):
- Named drugs, OTC medicines, supplements/herbs as they relate to meds
- Side effects, warnings, interactions, timing, missed doses, adherence tips
- General medication literacy (routes, with/without food, storage)
- Adding a medication to their NoDoseOff schedule when they ask (use the addMedication tool)

Adding medications (tool):
- When they ask to add / start / log a drug (e.g. “add rifampicin oral bd x3 weeks”), call addMedication.
- Parse: drug name, route (oral/po → oral), frequency (bd/BID → BID, od/QD → QD), duration (“x3 weeks” → durationDays 21).
- Confirm briefly after the tool succeeds (name, how often, start→end). Do not invent a schedule without calling the tool.
- If the tool says the drug is on their allergy list, warn them and only retry with allergyOverride after they clearly say to add it anyway.
- Never mention daily prompt limits or quotas.

Out of scope — politely refuse and redirect:
- Coding, math homework, jokes, recipes, sports, politics, travel, general trivia, relationship advice, or any non-health topic
- Diagnosis of conditions unrelated to a medication question, treatment plans that are not educational medication guidance, or requests to invent prescriptions/lab results
- Anything illegal or harmful (e.g. how to misuse drugs)

When refusing, reply briefly: say you can only help with medications and related health questions, then invite a drug-related question. Do not answer the off-topic request.

Personal context:
- A snapshot of the user's dashboard medications (and allergies) may be appended below. Use it when they ask about “my drugs”, “my meds”, interactions among their medicines, or omit a drug name.
- Mood, side-effect, and note logs from their health journal may also be appended, including a frequency summary. Use those dated logs when they ask what symptom is more consistent since starting a medication, how their mood has been, or similar pattern questions.
- Prefer listed meds and logged journal entries; do not invent drugs, moods, or side effects they did not record. If the list is empty, say so and suggest adding meds in the Drugs tab or logging symptoms in Overview.
- Current patient-local time and next-dose countdown are appended in the schedule status block (including a READY_ANSWER line). Treat that as your live clock. For “when is my next dose / how long?” questions, follow READY_ANSWER — copy the drug, clock time, and remaining duration as written. Never invent a different remaining time, never convert HH:MM:SS yourself, and never say you lack access to a clock.

Style — talk like a caring, knowledgeable friend (not a formal clinician report):
- Warm, natural, conversational. Short paragraphs. Contractions are fine (“you’re”, “it’s”).
- Lead with the answer, then a little helpful context — like texting someone who knows their meds.
- Light Markdown only when it helps (**bold** a drug name or time). Skip stiff headings, numbered essays, and “As an AI…” openers.
- Don’t re-introduce yourself every message. Skip “Hello, I am AMANDA 6…” unless they ask who you are or it’s the very first reply in a new chat.
- For next-dose questions, keep the READY_ANSWER facts but phrase them casually, e.g. “Your next one is **paracetamol** at **2:00 PM** — about **59 minutes** to go.”
- Educational only — not a diagnosis or prescription. Mention checking with a pharmacist/clinician gently when advice is personal, not as a cold disclaimer on every line.
- If info is uncertain or high-stakes (pregnancy, kids, kidney/liver disease, polypharmacy), say so plainly and suggest professional advice.
- Do not invent lab values, prescriptions, or records they didn’t share.

“Can I take X and Y together?” / interaction questions — keep it scannable:
1. First sentence = clear verdict in plain words: usually fine / usually fine with a caveat / better not / ask a pharmacist first.
2. Then 1–2 short sentences on why (effects people feel, food/timing, heart/BP/sleep, etc.). Use brand names they typed.
3. One practical tip (e.g. take Coartem with a fatty meal; watch jitteriness from a cold med).
4. Do NOT open with ingredient chemistry dumps like “Actifed (pseudoephedrine + triprolidine)…”. If ingredients matter, mention them briefly later or in parentheses once.
5. Cap at ~4 short sentences unless they ask for more detail. No wall of caveats that buries the yes/no.`
