/** Calm, clear AMANDA-style voice (Gemini prebuilt). */
export const AMANDA_TTS_VOICE =
  process.env.GEMINI_TTS_VOICE?.trim() || "Aoede";

/** Prefer Flash-Lite TTS — much lower latency than 2.5 preview. */
export const AMANDA_TTS_MODEL =
  process.env.GEMINI_TTS_MODEL?.trim() || "gemini-3.8-flash-lite-tts";

function geminiApiKey(): string | undefined {
  return (
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
    process.env.GOOGLE_GEMINI_API_KEY?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_API_KEY?.trim()
  );
}

type InlineAudio = {
  data: string;
  mimeType: string;
};

/**
 * Gemini TTS → WAV bytes (always browser-playable audio/wav).
 * Pass the verbatim transcript only — do not add style instructions
 * (those get spoken and slow generation).
 */
export async function synthesizeAmandaSpeech(
  text: string
): Promise<{ bytes: Uint8Array; mimeType: string }> {
  const apiKey = geminiApiKey();
  if (!apiKey) {
    throw new Error("Google Gemini API key is not configured for speech.");
  }

  const cleaned = text.slice(0, 1200).trim();
  if (!cleaned) throw new Error("Nothing to speak.");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${AMANDA_TTS_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: cleaned }],
        },
      ],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: AMANDA_TTS_VOICE,
            },
          },
        },
      },
    }),
  });

  const json = (await res.json()) as {
    error?: { message?: string; code?: number };
    candidates?: Array<{
      content?: { parts?: Array<{ inlineData?: InlineAudio }> };
    }>;
  };

  if (!res.ok) {
    const msg =
      json.error?.message || `Speech generation failed (${res.status})`;
    const err = new Error(msg) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }

  const inline = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)
    ?.inlineData;
  if (!inline?.data) {
    throw new Error("No audio returned from speech model.");
  }

  const raw = Buffer.from(inline.data, "base64");
  const mime = inline.mimeType || "audio/wav";

  // Already a WAV container (3.8 lite returns this)
  if (/wav/i.test(mime) || raw.slice(0, 4).toString() === "RIFF") {
    return { bytes: new Uint8Array(raw), mimeType: "audio/wav" };
  }

  const rateMatch = /rate=(\d+)/i.exec(mime);
  const sampleRate = rateMatch ? Number(rateMatch[1]) : 24000;
  return {
    bytes: pcm16ToWav(raw, sampleRate),
    mimeType: "audio/wav",
  };
}

/** Wrap little-endian PCM16 mono as a WAV container for HTMLAudioElement. */
function pcm16ToWav(pcm: Buffer, sampleRate: number): Uint8Array {
  const dataSize = pcm.length + (pcm.length % 2);
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  pcm.copy(buffer, 44);
  if (pcm.length % 2 === 1) buffer[44 + pcm.length] = 0;

  return new Uint8Array(buffer);
}
