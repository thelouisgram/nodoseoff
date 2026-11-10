import { apiJson } from "@/lib/api-client";

export const sendMail = async (
  to: string,
  html: string,
  subject: string
): Promise<void> => {
  await apiJson("/api/send-mail", {
    method: "POST",
    json: { to, html, subject },
  });
};
