import LegalDoc, {
  LegalList,
  LegalSection,
} from "@/components/legal/LegalDoc";
import Link from "next/link";

const UPDATED = "November 9, 2026";

export default function TermsPage() {
  return (
    <LegalDoc
      title="Terms of Service"
      description="Terms and conditions for using NoDoseOff medication tracking and AMANDA 6."
      path="/terms"
      updated={UPDATED}
    >
      <LegalSection title="1. Agreement">
        <p>
          These Terms of Service (“Terms”) govern your access to and use of
          NoDoseOff websites, apps, and related services (the “Service”). By
          creating an account or using the Service, you agree to these Terms and
          our{" "}
          <Link href="/privacy" className="text-soft-primary underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/cookies" className="text-soft-primary underline">
            Cookie Policy
          </Link>
          .
        </p>
        <p>
          If you do not agree, do not use the Service.
        </p>
      </LegalSection>

      <LegalSection title="2. Who may use NoDoseOff">
        <LegalList
          items={[
            "You must be at least 13 years old (or the age of digital consent in your country)",
            "If you use the Service on behalf of someone else (e.g. a caregiver), you confirm you have authority to do so",
            "You are responsible for keeping login credentials confidential",
          ]}
        />
      </LegalSection>

      <LegalSection title="3. The Service">
        <p>
          NoDoseOff helps you log medications, receive dose reminders, view
          adherence insights, export reports, and optionally ask AMANDA 6
          educational questions. Features may change, pause, or end as we
          improve the product.
        </p>
      </LegalSection>

      <LegalSection title="4. Important medical disclaimer">
        <p>
          <span className="font-semibold text-soft-ink">
            NoDoseOff is not a medical device and does not provide medical
            advice, diagnosis, or treatment.
          </span>{" "}
          Reminders can fail (device offline, notifications blocked, outages).
          Always follow your clinician’s and pharmacist’s instructions. In an
          emergency, contact local emergency services — do not rely on the app.
        </p>
        <p>
          AMANDA 6 answers are educational and may be incomplete or incorrect.
          They are not a substitute for professional care.
        </p>
      </LegalSection>

      <LegalSection title="5. Accounts &amp; acceptable use">
        <p>You agree to:</p>
        <LegalList
          items={[
            "Provide accurate registration information",
            "Use the Service only for lawful personal (or authorized caregiving) purposes",
            "Not attempt to break, scrape abusively, reverse engineer, or overload the Service",
            "Not upload malware, harass others, or misuse AI features",
            "Not use the Service to provide clinical care as a substitute for licensed practice",
          ]}
        />
        <p>
          We may suspend or terminate accounts that violate these Terms or pose
          risk to the Service or other users.
        </p>
      </LegalSection>

      <LegalSection title="6. Your content">
        <p>
          You retain rights to the medication and profile data you enter. You
          grant us a limited license to host, process, and display that content
          solely to operate and improve the Service. You are responsible for the
          accuracy of information you enter.
        </p>
      </LegalSection>

      <LegalSection title="7. Intellectual property">
        <p>
          NoDoseOff branding, UI, software, and documentation are owned by us or
          our licensors. You may not copy, modify, or redistribute them except
          as allowed by these Terms or written permission.
        </p>
      </LegalSection>

      <LegalSection title="8. Emails &amp; newsletter">
        <p>
          We send transactional emails needed for the Service (e.g. account and
          drug updates). Marketing or newsletter messages are optional and
          require your subscription; you can unsubscribe anytime.
        </p>
      </LegalSection>

      <LegalSection title="9. Third-party services">
        <p>
          The Service relies on third parties (hosting, auth, email, AI, image
          hosting, captcha). Their availability and terms may affect your
          experience. We are not responsible for third-party outages beyond our
          reasonable control.
        </p>
      </LegalSection>

      <LegalSection title="10. Disclaimers">
        <p>
          THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT WARRANTIES
          OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS
          FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT
          REMINDERS OR AI OUTPUTS WILL BE UNINTERRUPTED, ACCURATE, OR ERROR-FREE.
        </p>
      </LegalSection>

      <LegalSection title="11. Limitation of liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, NODOSEOFF AND ITS OPERATORS
          WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
          OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, DATA, OR HEALTH OUTCOMES
          ARISING FROM YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY FOR CLAIMS
          RELATING TO THE SERVICE IS LIMITED TO THE GREATER OF (A) AMOUNTS YOU
          PAID US IN THE 12 MONTHS BEFORE THE CLAIM OR (B) USD $50.
        </p>
        <p>
          Some jurisdictions do not allow certain limitations; in those places,
          our liability is limited to the fullest extent allowed.
        </p>
      </LegalSection>

      <LegalSection title="12. Indemnity">
        <p>
          You agree to defend and indemnify NoDoseOff against claims arising from
          your misuse of the Service, violation of these Terms, or infringement
          of others’ rights, except to the extent caused by our willful
          misconduct.
        </p>
      </LegalSection>

      <LegalSection title="13. Termination">
        <p>
          You may stop using the Service and delete your account at any time. We
          may suspend or end access if you breach these Terms or if we
          discontinue the Service. Provisions that should survive (disclaimers,
          liability limits, indemnity) will survive termination.
        </p>
      </LegalSection>

      <LegalSection title="14. Changes to the Terms">
        <p>
          We may update these Terms. The “Last updated” date will change.
          Material changes may be communicated in-app or by email. Continued use
          after changes take effect constitutes acceptance.
        </p>
      </LegalSection>

      <LegalSection title="15. Governing law">
        <p>
          These Terms are governed by the laws applicable in the jurisdiction
          where NoDoseOff primarily operates, without regard to conflict-of-law
          rules, except where mandatory consumer protections in your country
          apply. Courts in that jurisdiction will have exclusive venue, subject
          to those consumer rights.
        </p>
      </LegalSection>

      <LegalSection title="16. Contact">
        <p>
          For terms questions:{" "}
          <a className="text-soft-primary underline" href="mailto:hello@nodoseoff.com">
            hello@nodoseoff.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
