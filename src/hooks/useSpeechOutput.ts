"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getAccessToken } from "@/lib/auth/client";
import {
  clipTextForSpeech,
  plainTextForSpeech,
} from "@/lib/ai/speech-text";

export { plainTextForSpeech, clipTextForSpeech };

export function speechOutputSupported() {
  return typeof window !== "undefined" && typeof Audio !== "undefined";
}

const audioCache = new Map<string, Blob>();
const MAX_CACHE = 24;

function cacheKey(text: string) {
  return clipTextForSpeech(text);
}

function putCache(key: string, blob: Blob) {
  if (audioCache.has(key)) audioCache.delete(key);
  audioCache.set(key, blob);
  while (audioCache.size > MAX_CACHE) {
    const oldest = audioCache.keys().next().value;
    if (oldest == null) break;
    audioCache.delete(oldest);
  }
}

/**
 * Neural TTS via /api/ai/speak (Gemini Flash-Lite), with browser fallback.
 * Caches clips so a second Hear is instant; prefetch warms the cache.
 */
export function useSpeechOutput() {
  const [supported, setSupported] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const requestGen = useRef(0);
  const ctxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const prefetching = useRef(new Set<string>());

  useEffect(() => {
    setSupported(speechOutputSupported());
  }, []);

  const stopPlaybackOnly = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      try {
        audioRef.current.pause();
      } catch {
        /* ignore */
      }
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
      } catch {
        /* ignore */
      }
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const clearAll = useCallback(() => {
    requestGen.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    stopPlaybackOnly();
    setSpeakingId(null);
    setLoadingId(null);
  }, [stopPlaybackOnly]);

  const stop = useCallback(() => {
    clearAll();
  }, [clearAll]);

  const speakBrowserFallback = useCallback((id: string, clean: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return false;
    }
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(clean);
      utter.rate = 0.98;
      utter.pitch = 1.02;
      utter.lang = "en-US";

      const pickVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        return (
          voices.find((v) =>
            /Google US English|Samantha|Karen|Moira|Neural/i.test(v.name)
          ) ||
          voices.find((v) => /^en/i.test(v.lang)) ||
          null
        );
      };

      const preferred = pickVoice();
      if (preferred) utter.voice = preferred;
      if (!preferred) {
        window.speechSynthesis.onvoiceschanged = () => {
          const v = pickVoice();
          if (v) utter.voice = v;
        };
      }

      utter.onend = () => setSpeakingId(null);
      utter.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(utter);
      return true;
    } catch {
      return false;
    }
  }, []);

  const fetchSpeechBlob = useCallback(async (text: string, signal?: AbortSignal) => {
    const key = cacheKey(text);
    const hit = audioCache.get(key);
    if (hit) return hit;

    const token = await getAccessToken();
    const res = await fetch("/api/ai/speak", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify({ text: key }),
      signal,
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      const err = new Error(`speak ${res.status} ${errBody.slice(0, 120)}`) as Error & {
        status?: number;
      };
      err.status = res.status;
      throw err;
    }

    const buffer = await res.arrayBuffer();
    if (!buffer.byteLength) throw new Error("empty audio");
    const blob = new Blob([buffer], { type: "audio/wav" });
    putCache(key, blob);
    return blob;
  }, []);

  const playViaAudioElement = useCallback(
    async (blob: Blob, gen: number) => {
      const url = URL.createObjectURL(blob);
      if (gen !== requestGen.current) {
        URL.revokeObjectURL(url);
        return false;
      }
      urlRef.current = url;
      const audio = new Audio();
      audio.preload = "auto";
      audio.src = url;
      audioRef.current = audio;

      audio.onended = () => {
        if (gen === requestGen.current) setSpeakingId(null);
      };
      audio.onerror = () => {
        if (gen === requestGen.current) setSpeakingId(null);
      };

      await new Promise<void>((resolve, reject) => {
        const onPlaying = () => {
          audio.removeEventListener("playing", onPlaying);
          resolve();
        };
        audio.addEventListener("playing", onPlaying);
        audio
          .play()
          .then(() => {
            if (!audio.paused) {
              audio.removeEventListener("playing", onPlaying);
              resolve();
            }
          })
          .catch(reject);
      });
      return gen === requestGen.current;
    },
    []
  );

  const playViaAudioContext = useCallback(
    async (bytes: ArrayBuffer, gen: number) => {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return false;

      const ctx = ctxRef.current || new AC();
      ctxRef.current = ctx;
      if (ctx.state === "suspended") await ctx.resume();

      const buffer = await ctx.decodeAudioData(bytes.slice(0));
      if (gen !== requestGen.current) return false;

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      sourceRef.current = source;
      source.onended = () => {
        if (gen === requestGen.current) setSpeakingId(null);
        sourceRef.current = null;
      };
      source.start(0);
      return true;
    },
    []
  );

  /** Warm cache after AMANDA finishes a reply so Hear starts immediately. */
  const prefetch = useCallback(
    async (text: string) => {
      const key = cacheKey(text);
      if (!key || audioCache.has(key) || prefetching.current.has(key)) return;
      prefetching.current.add(key);
      try {
        await fetchSpeechBlob(key);
      } catch {
        /* prefetch is best-effort */
      } finally {
        prefetching.current.delete(key);
      }
    },
    [fetchSpeechBlob]
  );

  const speak = useCallback(
    async (id: string, text: string) => {
      const clean = clipTextForSpeech(text);
      if (!clean || typeof window === "undefined") return false;

      abortRef.current?.abort();
      abortRef.current = null;
      stopPlaybackOnly();

      const gen = ++requestGen.current;
      setSpeakingId(null);
      setLoadingId(id);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const blob = await fetchSpeechBlob(clean, controller.signal);
        if (gen !== requestGen.current) return true;

        setLoadingId(null);
        setSpeakingId(id);

        try {
          await playViaAudioElement(blob, gen);
          return true;
        } catch {
          stopPlaybackOnly();
          try {
            await playViaAudioContext(await blob.arrayBuffer(), gen);
            return true;
          } catch {
            stopPlaybackOnly();
            setLoadingId(null);
            return speakBrowserFallback(id, clean);
          }
        }
      } catch (err) {
        if (gen !== requestGen.current) return true;
        setLoadingId(null);
        // Quota / model errors → browser voice immediately (don't hang on Preparing)
        console.error("AMANDA speak failed, using browser voice:", err);
        return speakBrowserFallback(id, clean);
      }
    },
    [
      fetchSpeechBlob,
      playViaAudioContext,
      playViaAudioElement,
      speakBrowserFallback,
      stopPlaybackOnly,
    ]
  );

  const toggle = useCallback(
    async (id: string, text: string) => {
      if (speakingId === id || loadingId === id) {
        stop();
        return false;
      }
      return speak(id, text);
    },
    [loadingId, speak, speakingId, stop]
  );

  useEffect(() => () => clearAll(), [clearAll]);

  return {
    supported,
    speakingId,
    loadingId,
    speak,
    stop,
    toggle,
    prefetch,
  };
}
