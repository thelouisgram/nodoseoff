import { Resend } from "resend";

let client: Resend | null = null;

export function getResend(): Resend {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    throw new Error("RESEND_API_KEY is not set");
  }
  if (!client) client = new Resend(key);
  return client;
}

export function resendFromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "NoDoseOff <onboarding@resend.dev>"
  );
}

export async function sendResendEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from: resendFromAddress(),
    to: params.to,
    subject: params.subject,
    html: params.html,
  });
  if (error) {
    throw new Error(
      typeof error === "object" && error && "message" in error
        ? String((error as { message?: string }).message)
        : "Resend send failed"
    );
  }
  return data;
}
