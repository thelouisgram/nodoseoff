import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = async (to: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "NoDoseOff <onboarding@resend.dev>",
      to,
      subject: "Welcome to Our Platform!",
      html: `<h1>Welcome!</h1><p>We're glad to have you with us.</p>`,
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: err };
  }
};