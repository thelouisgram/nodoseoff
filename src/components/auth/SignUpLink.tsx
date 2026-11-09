"use client";

import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/router";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

type SignUpLinkProps = Omit<LinkProps, "href"> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
    href?: LinkProps["href"];
  };

/** Navigates to sign-up; signs out first when already signed in. */
export function SignUpLink({ children, onClick, href = "/signup", ...rest }: SignUpLinkProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [busy, setBusy] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    if (!user) return;

    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      await signOut();
      await router.push(typeof href === "string" ? href : "/signup");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Link href={href} onClick={handleClick} aria-busy={busy} {...rest}>
      {children}
    </Link>
  );
}
