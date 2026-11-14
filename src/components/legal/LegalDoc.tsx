import Link from "next/link";
import type { ReactNode } from "react";
import SeoHead from "@/components/seo/SeoHead";
import { SoftPage } from "@/components/ui/soft";

const NAV = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
];

export function LegalSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="text-[18px] font-semibold tracking-tight text-soft-ink">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-soft-muted">
        {children}
      </div>
    </section>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export default function LegalDoc({
  title,
  description,
  path,
  updated,
  children,
}: {
  title: string;
  description: string;
  path: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <SoftPage whims>
      <SeoHead title={title} description={description} path={path} />
      <div className="mx-auto max-w-3xl px-4 py-12 ss:px-6 ss:py-16">
        <Link
          href="/"
          className="text-[13px] font-semibold text-soft-primary hover:underline"
        >
          ← Back home
        </Link>

        <nav
          aria-label="Legal documents"
          className="mt-6 flex flex-wrap gap-2 border-b border-black/[0.06] pb-4"
        >
          {NAV.map((item) => {
            const active = item.href === path;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${
                  active
                    ? "bg-soft-primary text-white"
                    : "bg-white text-soft-muted ring-1 ring-black/[0.06] hover:text-soft-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <h1 className="mt-8 text-[32px] font-bold tracking-tight text-soft-ink">
          {title}
        </h1>
        <p className="mt-2 text-[14px] text-soft-muted">
          Last updated: {updated}
        </p>

        <div className="mt-10 space-y-9">{children}</div>

        <p className="mt-12 border-t border-black/[0.06] pt-6 text-[13px] text-soft-muted">
          Questions? Email{" "}
          <a
            className="font-semibold text-soft-primary hover:underline"
            href="mailto:hello@nodoseoff.com"
          >
            hello@nodoseoff.com
          </a>{" "}
          or{" "}
          <a
            className="font-semibold text-soft-primary hover:underline"
            href="mailto:nodoseoff@gmail.com"
          >
            nodoseoff@gmail.com
          </a>
          .
        </p>
      </div>
    </SoftPage>
  );
}
