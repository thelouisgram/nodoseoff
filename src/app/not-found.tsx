import type { Metadata } from "next";
import NotFoundView from "@/components/NotFoundView";

export const metadata: Metadata = {
  title: "Page not found | NoDoseOff",
  description:
    "This NoDoseOff page does not exist. Head home or sign in to your dashboard.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundView />;
}
