import LegalDoc, {
  LegalList,
  LegalSection,
} from "@/components/legal/LegalDoc";
import Link from "next/link";

const UPDATED = "November 9, 2026";

export default function CookiesPage() {
  return (
    <LegalDoc
      title="Cookie Policy"
      description="How NoDoseOff uses cookies and similar technologies, and how to manage your preferences."
      path="/cookies"
      updated={UPDATED}
    >
      <LegalSection title="1. What this policy covers">
        <p>
          This Cookie Policy explains how NoDoseOff uses cookies, local storage,
          and similar technologies on our website and app. It should be read
          with our{" "}
          <Link href="/privacy" className="text-soft-primary underline">
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. What are cookies?">
        <p>
          Cookies are small text files stored on your device. We also use
          browser local storage for preferences and anonymous visitor IDs. Some
          are essential for login and security; others help us understand how
          the product is used.
        </p>
      </LegalSection>

      <LegalSection title="3. How we use them">
        <LegalList
          items={[
            "Keep you signed in and protect your session",
            "Remember cookie consent choices",
            "Measure page visits when you allow analytics",
            "Support security features such as bot protection on signup",
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Categories we use">
        <p>
          <span className="font-semibold text-soft-ink">Strictly necessary.</span>{" "}
          Required for authentication, security, and storing your cookie
          preferences. These cannot be switched off if you use the Service.
        </p>
        <LegalList
          items={[
            "Auth/session cookies set by Neon Auth (login state)",
            "Cookie consent record in local storage (nodoseoff_cookie_consent)",
          ]}
        />
        <p>
          <span className="font-semibold text-soft-ink">Analytics (optional).</span>{" "}
          Help us see which pages are used so we can improve the product. Used
          only if you accept analytics in the cookie banner.
        </p>
        <LegalList
          items={[
            "Anonymous visitor ID in local storage (nodoseoff_vid)",
            "First-party visit events sent to our /api/visits/track endpoint (path, referrer, user agent)",
          ]}
        />
        <p>
          <span className="font-semibold text-soft-ink">Functional / security.</span>{" "}
          Google reCAPTCHA may set cookies when you complete signup captcha
          challenges. Those are governed by Google’s policies.
        </p>
      </LegalSection>

      <LegalSection title="5. Your choices">
        <LegalList
          items={[
            "Use the cookie banner to Accept all, Necessary only, or open Preferences",
            "Change your mind anytime via “Cookie settings” in the site footer",
            "Clear site data in your browser to remove local storage and cookies",
          ]}
        />
        <p>
          If you choose Necessary only, we will not set the analytics visitor ID
          or send visit beacons. The Service still works for login and core
          features.
        </p>
      </LegalSection>

      <LegalSection title="6. Retention">
        <p>
          Consent preferences remain until you change or clear them. Analytics
          visitor IDs persist until cleared. Auth cookies last according to our
          auth provider’s session settings. Visit logs on our servers are kept
          for operational analytics and may be deleted or aggregated over time.
        </p>
      </LegalSection>

      <LegalSection title="7. Updates">
        <p>
          We may update this Cookie Policy when our practices change. Check the
          “Last updated” date above.
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
