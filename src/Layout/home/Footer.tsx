import Image from "next/image";
import Link from "next/link";
import { Instagram, Mail } from "lucide-react";
import NewsletterForm from "@/components/landing/NewsletterForm";
import { openCookieSettings } from "@/components/legal/CookieConsent";

const productLinks = [
  { href: "#features", label: "Features" },
  { href: "#overview", label: "Overview" },
  { href: "#amanda", label: "AMANDA 6" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#who", label: "Who it’s for" },
  { href: "#safety", label: "Trust & safety" },
  { href: "#mobile-app", label: "Mobile app" },
];

const accountLinks = [
  { href: "/signup", label: "Create account" },
  { href: "/login", label: "Log in" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/forgetpassword", label: "Reset password" },
];

const companyLinks = [
  { href: "#about", label: "About NoDoseOff" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "mailto:hello@nodoseoff.com", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-soft-line bg-[#0b1a2e] text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 ss:px-6">
        <div className="grid gap-12 md:grid-cols-[1.35fr_repeat(3,minmax(0,1fr))] md:gap-10">
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/assets/logo/logo-with-name-white.png"
                alt="NoDoseOff"
                width={160}
                height={40}
                className="h-9 w-auto"
              />
            </Link>
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-white/65">
              Medication tracking, dose reminders, adherence reports, and
              AMANDA 6 — your AI assistant for staying consistent on long-term
              treatment.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="https://instagram.com/nodoseoff"
                target="_blank"
                rel="noreferrer"
                aria-label="NoDoseOff on Instagram"
                className="flex size-10 items-center justify-center border border-white/15 text-white/80 transition hover:border-white/40 hover:text-white"
              >
                <Instagram size={18} />
              </Link>
              <Link
                href="mailto:hello@nodoseoff.com"
                aria-label="Email NoDoseOff"
                className="flex size-10 items-center justify-center border border-white/15 text-white/80 transition hover:border-white/40 hover:text-white"
              >
                <Mail size={18} />
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/45">
              Product
            </p>
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-white/75 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/45">
              Account
            </p>
            <ul className="mt-4 space-y-3">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-white/75 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/45">
              Company
            </p>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-white/75 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 border border-white/15 p-4">
              <p className="text-[13px] font-semibold text-white">
                Join the newsletter
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-white/60">
                Adherence tips, product updates, and calm reminders — no spam.
              </p>
              <div className="mt-3">
                <NewsletterForm source="footer" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-[12px] text-white/45 ss:flex-row ss:items-center ss:justify-between ss:px-6">
          <p>© {new Date().getFullYear()} NoDoseOff. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy" className="hover:text-white/80">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white/80">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-white/80">
              Cookies
            </Link>
            <button
              type="button"
              onClick={() => openCookieSettings()}
              className="hover:text-white/80"
            >
              Cookie settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
