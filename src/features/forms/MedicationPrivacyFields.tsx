"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";

type Props = {
  nickname: string;
  onNicknameChange: (value: string) => void;
  /** Existing Cloudinary URL (edit / refill) */
  imageUrl?: string;
  /** Local preview when user picks a new file */
  imageFile: File | null;
  onImageFileChange: (file: File | null) => void;
  /** Clear a previously saved photo */
  onClearSavedImage?: () => void;
  disabled?: boolean;
  /** Shorter copy for the allergy form */
  compact?: boolean;
};

const MedicationPrivacyFields: React.FC<Props> = ({
  nickname,
  onNicknameChange,
  imageUrl = "",
  imageFile,
  onImageFileChange,
  onClearSavedImage,
  disabled = false,
  compact = false,
}) => {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!imageFile) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const shown = preview || imageUrl;

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    if (!/^image\/(jpeg|jpg|png|webp|gif)$/i.test(file.type)) {
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      e.target.value = "";
      return;
    }
    onImageFileChange(file);
  };

  return (
    <div className="space-y-5">
      <div className="w-full">
        <label
          htmlFor="nickname"
          className="block text-sm font-medium text-soft-ink mb-2"
        >
          Nickname{" "}
          <span className="font-normal text-soft-muted">(optional)</span>
        </label>
        <div className="w-full h-[47px] px-4 border border-black/[0.06] rounded-soft-sm focus-within:ring-4 focus-within:ring-soft-ink/[0.04] transition-shadow bg-white flex items-center">
          <input
            type="text"
            id="nickname"
            name="nickname"
            placeholder={compact ? "e.g., Morning pill" : "e.g., Blue morning pill"}
            value={nickname}
            onChange={(e) => onNicknameChange(e.target.value)}
            disabled={disabled}
            className="w-full h-full bg-transparent border-none outline-none p-0 text-soft-ink placeholder:text-soft-muted disabled:cursor-not-allowed"
            autoComplete="off"
          />
        </div>
        <p className="mt-1.5 text-[12px] leading-snug text-soft-muted">
          {compact
            ? "Used instead of the real name when you want it private."
            : "Shown on dose reminders instead of the real name — keeps lock-screen notifications private."}
        </p>
      </div>

      <div className="w-full">
        <span className="block text-sm font-medium text-soft-ink mb-2">
          Photo{" "}
          <span className="font-normal text-soft-muted">(optional)</span>
        </span>
        <div className="flex items-center gap-3">
          {shown ? (
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-black/[0.06] bg-soft-canvas">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shown}
                alt=""
                className="size-full object-cover"
              />
              {!disabled ? (
                <button
                  type="button"
                  onClick={() => {
                    if (imageFile) onImageFileChange(null);
                    else onClearSavedImage?.();
                  }}
                  className="absolute right-0.5 top-0.5 rounded-md bg-black/55 p-0.5 text-white"
                  aria-label="Remove photo"
                >
                  <X size={12} />
                </button>
              ) : null}
            </div>
          ) : (
            <div className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-dashed border-black/[0.1] bg-soft-canvas text-soft-muted">
              <ImagePlus size={18} strokeWidth={1.75} />
            </div>
          )}
          <label
            className={`inline-flex cursor-pointer items-center rounded-soft-sm border border-black/[0.08] bg-white px-3 py-2 text-[13px] font-medium text-soft-ink transition-colors hover:bg-soft-canvas ${
              disabled ? "pointer-events-none opacity-50" : ""
            }`}
          >
            {shown ? "Change photo" : "Add photo"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              disabled={disabled}
              onChange={onPick}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default MedicationPrivacyFields;

export async function fileToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}
