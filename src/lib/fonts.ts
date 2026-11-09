import { Manrope } from "next/font/google";

/** Shared Manrope instance — use `.className` on portaled UI so fonts match. */
export const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});
