export const sendMail = async (
  to: string,
  html: string,
  subject: string
): Promise<void> => {
  const response = await fetch("/api/send-mail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, html, subject }),
  });

  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const body = (await response.json()) as { error?: unknown };
      if (body?.error) detail = String(body.error);
    } catch {
      /* ignore */
    }
    throw new Error(`Failed to send email: ${detail}`);
  }
};
