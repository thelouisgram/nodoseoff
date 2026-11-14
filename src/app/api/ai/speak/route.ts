import { requireUserId } from "@/lib/server/auth";
import { synthesizeAmandaSpeech } from "@/lib/ai/tts";
import { clipTextForSpeech } from "@/lib/ai/speech-text";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    await requireUserId(req);

    const body = (await req.json()) as { text?: string };
    // Short spoken clip → much faster TTS than reading the whole reply
    const text = clipTextForSpeech(String(body.text || ""));
    if (!text) {
      return Response.json({ error: "text required" }, { status: 400 });
    }

    const { bytes, mimeType } = await synthesizeAmandaSpeech(text);
    // Copy into a fresh ArrayBuffer-backed Uint8Array for Response body typing
    const audio = new Uint8Array(bytes.byteLength);
    audio.set(bytes);
    return new Response(audio, {
      status: 200,
      headers: {
        "Content-Type": mimeType || "audio/wav",
        "Content-Length": String(audio.byteLength),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message =
      error instanceof Error ? error.message : "Speech generation failed";
    console.error("ai/speak error:", error);
    return Response.json({ error: message }, { status: 502 });
  }
}
