import { createMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { SITE_EMAIL } from "@/lib/site";

export const metadata = createMetadata({
  title: "Privacy Policy | EmployeeFraudExpert.com",
  description: "Privacy policy for EmployeeFraudExpert.com - UK GDPR compliant.",
  path: "/privacy",
  noindex: true,
  nofollow: false,
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
      />
      <Section>
        <div className="prose-content mx-auto max-w-3xl">
          <p>Last updated: May 2025</p>

          <h2>Who We Are</h2>
          <p>
            EmployeeFraudExpert.com (&quot;we&quot;, &quot;us&quot;) operates a
            referral service connecting UK employers and solicitors with qualified
            employee fraud expert witnesses. We are the data controller for personal
            data submitted through this website.
          </p>

          <h2>What Data We Collect</h2>
          <p>When you submit our contact form, we collect:</p>
          <ul>
            <li>Name and organisation</li>
            <li>Email address and phone number</li>
            <li>Your role (employer, solicitor, insurer, or other)</li>
            <li>Details about the suspected fraud and proceedings</li>
            <li>Approximate loss value and urgency</li>
          </ul>

          <h2>How We Use Your Data</h2>
          <p>We use your data to:</p>
          <ul>
            <li>Respond to your enquiry and match you with a suitable expert</li>
            <li>Communicate with you about your case</li>
            <li>Improve our referral service</li>
          </ul>
          <p>
            Our lawful basis for processing is legitimate interests (responding to
            enquiries) and, where applicable, consent.
          </p>

          <h2>Data Sharing</h2>
          <p>
            We share your enquiry details with qualified expert witnesses to
            facilitate your referral. Contact submissions are sent to our secure
            lead notification system; Formspree may be used as a backup when
            configured.
            We do not sell your personal data.
          </p>

          <h2>Data Retention</h2>
          <p>
            We retain enquiry data for up to 3 years unless a longer period is
            required for legal or regulatory purposes.
          </p>

          <h2>Your Rights</h2>
          <p>
            Under UK GDPR, you have the right to access, rectify, erase, restrict,
            or object to processing of your personal data, and the right to data
            portability. Contact us at {SITE_EMAIL} to exercise these rights. You
            may also complain to the Information Commissioner&apos;s Office (ICO).
          </p>

          <h2>Cookies</h2>
          <p>
            We use necessary cookies to operate the site and, with your consent,
            analytics and marketing cookies. Non-essential tracking is blocked
            until you choose. See our{" "}
            <a href="/cookies">Cookie Policy</a> or use Cookie Settings in the
            footer to manage preferences.
          </p>

          <h2>Contact</h2>
          <p>
            For privacy enquiries: {SITE_EMAIL}
          </p>
        </div>
      </Section>
    </>
  );
}
