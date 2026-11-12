import { apiJson } from "@/lib/api-client";

/** Best-effort email send — never throws (rate limits must not break core flows). */
export const sendMail = async (
  to: string,
  html: string,
  subject: string
): Promise<boolean> => {
  try {
    await apiJson("/api/send-mail", {
      method: "POST",
      json: { to, html, subject },
    });
    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("[sendMail] skipped:", message.slice(0, 200));
    return false;
  }
};
