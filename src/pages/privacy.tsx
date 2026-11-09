import LegalDoc, {
  LegalList,
  LegalSection,
} from "@/components/legal/LegalDoc";
import Link from "next/link";

const UPDATED = "November 9, 2026";

export default function PrivacyPolicyPage() {
  return (
    <LegalDoc
      title="Privacy Policy"
      description="How NoDoseOff collects, uses, shares, and protects your personal and medication data."
      path="/privacy"
      updated={UPDATED}
    >
      <LegalSection title="1. Who we are">
        <p>
          NoDoseOff (“we”, “us”, “our”) provides a medication tracking,
          reminder, adherence reporting, and AI education product. This Privacy
          Policy explains what we collect, why we collect it, and the choices you
          have.
        </p>
        <p>
          Controller contact:{" "}
          <a className="text-soft-primary underline" href="mailto:hello@nodoseoff.com">
            hello@nodoseoff.com
          </a>
          . Alternate:{" "}
          <a className="text-soft-primary underline" href="mailto:nodoseoff@gmail.com">
            nodoseoff@gmail.com
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Scope">
        <p>
          This policy covers nodoseoff.com and related apps, dashboards, and
          APIs we operate. It does not cover third-party sites you link to from
          our service.
        </p>
      </LegalSection>

      <LegalSection title="3. Information we collect">
        <p>
          <span className="font-semibold text-soft-ink">Account data.</span>{" "}
          Name, email, password (hashed by our auth provider), optional phone
          number, and optional profile photo.
        </p>
        <p>
          <span className="font-semibold text-soft-ink">Health-related data you enter.</span>{" "}
          Medication names, schedules, dose times, routes, allergies, OTC/herb
          history, adherence (taken/missed), and reports you generate. This is
          sensitive information you choose to store so the product can work.
        </p>
        <p>
          <span className="font-semibold text-soft-ink">AI assistant content.</span>{" "}
          Messages you send to AMANDA 6 and related chat history, used to answer
          your questions in context of your regimen.
        </p>
        <p>
          <span className="font-semibold text-soft-ink">Usage &amp; device data.</span>{" "}
          Pages visited, approximate timestamps, referrer, user agent, and an
          anonymous visitor ID when you allow analytics cookies. See our{" "}
          <Link href="/cookies" className="text-soft-primary underline">
            Cookie Policy
          </Link>
          .
        </p>
        <p>
          <span className="font-semibold text-soft-ink">Communications.</span>{" "}
          Emails you send us, newsletter sign-ups, and support messages.
        </p>
      </LegalSection>

      <LegalSection title="4. How we use information">
        <LegalList
          items={[
            "Operate accounts, dashboards, reminders, and adherence reports",
            "Send transactional email (welcome, password reset, drug updates)",
            "Provide optional newsletter updates if you subscribe",
            "Power AMANDA 6 answers (educational only — not medical advice or diagnosis)",
            "Secure the service, prevent abuse, and debug reliability issues",
            "Understand product usage when analytics consent is given",
            "Comply with law and enforce our Terms",
          ]}
        />
      </LegalSection>

      <LegalSection title="5. Legal bases (where applicable)">
        <p>
          Where GDPR/UK GDPR apply, we process data based on: contract
          (providing the service you signed up for), consent (newsletter,
          non-essential cookies, certain AI features where required), legitimate
          interests (security, product improvement with safeguards), and legal
          obligation when disclosure is required.
        </p>
      </LegalSection>

      <LegalSection title="6. Sharing &amp; processors">
        <p>
          We do not sell your personal information or health data. We share data
          with service providers who process it on our instructions:
        </p>
        <LegalList
          items={[
            "Neon — database and authentication",
            "Cloudinary — profile image hosting",
            "Resend — transactional and (if configured) newsletter email",
            "AI model providers — only when you use AMANDA 6",
            "Hosting/CDN (e.g. Vercel) — serving the application",
            "Google reCAPTCHA — bot protection on signup where enabled",
          ]}
        />
        <p>
          We may disclose information if required by law, court order, or to
          protect rights, safety, and security.
        </p>
      </LegalSection>

      <LegalSection title="7. International transfers">
        <p>
          Our providers may process data in the United States and other
          countries. Where required, we rely on appropriate safeguards (such as
          standard contractual clauses) offered by those providers.
        </p>
      </LegalSection>

      <LegalSection title="8. Retention">
        <p>
          We keep account and medication data while your account is active. After
          deletion, we remove primary records from our database, subject to
          short-lived backups and logs needed for security or legal compliance.
          Newsletter emails remain until you unsubscribe. Analytics events may
          be aggregated or deleted on a rolling basis.
        </p>
      </LegalSection>

      <LegalSection title="9. Security">
        <p>
          We use HTTPS, access controls, and provider-side security features. No
          online service is perfectly secure. Use a strong unique password and
          keep devices locked. Do not share your account.
        </p>
      </LegalSection>

      <LegalSection title="10. Your rights &amp; choices">
        <LegalList
          items={[
            "Access, correct, or update profile and medication data in the app",
            "Delete your account from Account settings (removes primary app data)",
            "Clear AI chat history where the product allows",
            "Unsubscribe from the newsletter via email or by contacting us",
            "Manage cookie preferences (see Cookie Policy / banner)",
            "Request export or deletion by emailing us",
          ]}
        />
        <p>
          Depending on your location, you may also have rights to restrict
          processing, object, or lodge a complaint with a supervisory authority.
        </p>
      </LegalSection>

      <LegalSection title="11. Children">
        <p>
          NoDoseOff is not directed to children under 13 (or the minimum age in
          your country). We do not knowingly collect data from children. Contact
          us if you believe a child has created an account so we can delete it.
        </p>
      </LegalSection>

      <LegalSection title="12. Not medical advice">
        <p>
          NoDoseOff and AMANDA 6 provide tools and general education. They do
          not diagnose, treat, or replace a licensed clinician. Always follow
          your prescriber’s instructions for medications.
        </p>
      </LegalSection>

      <LegalSection title="13. Changes">
        <p>
          We may update this policy. The “Last updated” date will change. For
          material changes we may also notify you in-app or by email. Continued
          use after the update means you accept the revised policy.
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
