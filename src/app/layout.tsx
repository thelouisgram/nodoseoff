import type { ReactNode } from "react";
import "@/styles/globals.css";
import { manrope } from "@/lib/fonts";

/**
 * Minimal root layout for App Router (API routes + not-found).
 * Page UI still lives under pages/ with _app / _document.
 */
export default function AppRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`light ${manrope.variable}`}>
      <body className={`${manrope.className} antialiased`}>{children}</body>
    </html>
  );
}
