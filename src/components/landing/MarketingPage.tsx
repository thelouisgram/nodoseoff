"use client";

import type { ReactNode } from "react";
import LandingNav from "@/Layout/home/LandingNav";
import Footer from "@/Layout/home/Footer";
import SeoHead from "@/components/seo/SeoHead";
import SiteWhims from "@/components/landing/SiteWhims";
import { LandingMotion } from "@/components/landing/motion";

type Props = {
  title: string;
  description: string;
  path: string;
  children: ReactNode;
};

/** Shared chrome for marketing subpages (solid nav + footer). */
export default function MarketingPage({
  title,
  description,
  path,
  children,
}: Props) {
  return (
    <LandingMotion>
      <SeoHead title={title} description={description} path={path} />
      <LandingNav tone="solid" />
      <SiteWhims />
      <main className="relative z-[2] min-h-[100dvh] overflow-x-hidden bg-[#f3f7fb] font-sans text-soft-ink antialiased">
        {children}
      </main>
      <div className="relative z-[2]">
        <Footer />
      </div>
    </LandingMotion>
  );
}
