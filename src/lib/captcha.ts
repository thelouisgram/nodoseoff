/** Google reCAPTCHA v2 helpers (signup / recovery). */

export function recaptchaSiteKey(): string {
  return (
    process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ||
    ""
  );
}

export function recaptchaSecretKey(): string {
  return process.env.RECAPTCHA_SECRET_KEY?.trim() || "";
}

export async function verifyRecaptchaToken(
  token: string,
  remoteip?: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const secret = recaptchaSecretKey();
  if (!secret) {
    return { ok: false, error: "Captcha is not configured on the server" };
  }
  if (!token || typeof token !== "string" || token.length > 4000) {
    return { ok: false, error: "Missing captcha token" };
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteip) body.set("remoteip", remoteip);

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) {
      return { ok: false, error: "Captcha verification failed" };
    }
    const data = (await res.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };
    if (!data.success) {
      return { ok: false, error: "Captcha check failed. Please try again." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Captcha verification unavailable" };
  }
}
