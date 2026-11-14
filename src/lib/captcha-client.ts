/** Client-side helper to verify a reCAPTCHA token before auth actions. */

export async function verifyCaptchaClient(
  token: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!token) {
    return { ok: false, error: "Please complete the CAPTCHA verification." };
  }
  try {
    const res = await fetch("/api/captcha/verify", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      return {
        ok: false,
        error: body.error || "Captcha check failed. Please try again.",
      };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Captcha verification unavailable. Please try again." };
  }
}
