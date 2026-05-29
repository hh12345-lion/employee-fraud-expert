import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE_EMAIL } from "@/lib/site";
import {
  COOKIE_CATEGORY_LABELS,
  CONSENT_POLICY_VERSION,
  CONSENT_STORAGE_KEY,
} from "@/lib/cookies/constants";

export const metadata = createMetadata({
  title: "Cookie Policy | EmployeeFraudExpert.com",
  description:
    "How EmployeeFraudExpert.com uses cookies and similar technologies. Manage your preferences and learn about GDPR-compliant cookie categories.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Cookie Policy", path: "/cookies" },
        ])}
      />
      <PageHero
        title="Cookie Policy"
        subtitle="How we use cookies and similar technologies, and how you can control your choices."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cookie Policy" },
        ]}
      />
      <Section>
        <article className="prose-content mx-auto max-w-3xl">
          <p className="text-sm text-body/70">
            Last updated: May 2025 · Policy version {CONSENT_POLICY_VERSION}
          </p>

          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit a
            website. We also use similar technologies such as local storage (for
            example, to remember your cookie consent choices). This policy
            explains what we use, why, and how you can manage your preferences.
          </p>

          <h2>Your Choices (GDPR &amp; ePrivacy)</h2>
          <p>
            Under UK GDPR and the Privacy and Electronic Communications
            Regulations (PECR), we must obtain your consent before placing
            non-essential cookies on your device. When you first visit our site,
            you can <strong>Accept All</strong>,{" "}
            <strong>Reject Non-Essential</strong>, or{" "}
            <strong>Customise Preferences</strong>. You may change your mind at
            any time using <strong>Cookie Settings</strong> in the footer.
          </p>
          <p>
            California residents: we do not sell personal information. You may
            opt out of non-essential cookies via Cookie Settings (CCPA best
            practice).
          </p>

          <h2>Cookie Categories</h2>

          <h3>{COOKIE_CATEGORY_LABELS.necessary.title}</h3>
          <p>{COOKIE_CATEGORY_LABELS.necessary.description}</p>
          <p>
            <strong>Examples:</strong> consent preference storage (
            <code>{CONSENT_STORAGE_KEY}</code> in localStorage, 12-month expiry).
          </p>

          <h3>{COOKIE_CATEGORY_LABELS.analytics.title}</h3>
          <p>{COOKIE_CATEGORY_LABELS.analytics.description}</p>
          <p>
            <strong>Examples (if enabled):</strong> Google Analytics (
            <code>_ga</code>, <code>_gid</code>), Google Tag Manager, Hotjar
            session cookies. We use Google Consent Mode v2 so tags respect your
            choices.
          </p>

          <h3>{COOKIE_CATEGORY_LABELS.marketing.title}</h3>
          <p>{COOKIE_CATEGORY_LABELS.marketing.description}</p>
          <p>
            <strong>Examples (if enabled):</strong> Meta Pixel (
            <code>_fbp</code>), LinkedIn Insight Tag (
            <code>li_sugr</code>, <code>bcookie</code>).
          </p>

          <h3>{COOKIE_CATEGORY_LABELS.preferences.title}</h3>
          <p>{COOKIE_CATEGORY_LABELS.preferences.description}</p>
          <p>
            <strong>Examples (if enabled):</strong> remembered interface or
            content preferences stored in first-party cookies or local storage.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            When you grant consent, we may load scripts from the following
            providers (only if configured for this site and the relevant
            category is enabled):
          </p>
          <ul>
            <li>Google Analytics / Google Tag Manager (Google)</li>
            <li>Meta Pixel (Meta Platforms)</li>
            <li>LinkedIn Insight Tag (LinkedIn)</li>
            <li>Hotjar (Contentsquare)</li>
          </ul>
          <p>
            Each provider processes data under its own privacy policy. We
            configure Google Consent Mode so analytics and advertising storage
            remain denied until you opt in. Non-essential scripts are not loaded
            before you make a choice.
          </p>

          <h2>How Long We Store Consent</h2>
          <p>
            Your consent record is stored locally for up to 12 months or until
            you clear site data. If we materially change this policy, we may
            bump the policy version and ask for consent again.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about cookies or your data rights? Email{" "}
            <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a> or see our{" "}
            <Link href="/privacy">Privacy Policy</Link>.
          </p>
        </article>
      </Section>
    </>
  );
}
