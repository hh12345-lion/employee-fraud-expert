import { createMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { SITE_EMAIL } from "@/lib/site";

export const metadata = createMetadata({
  title: "Terms of Use | EmployeeFraudExpert.com",
  description:
    "Terms of use for EmployeeFraudExpert.com - referral service, not a law firm.",
  path: "/terms",
  noindex: true,
  nofollow: false,
});

export default function TermsPage() {
  return (
    <>
      <PageHero
        title="Terms of Use"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Terms of Use" },
        ]}
      />
      <Section>
        <div className="prose-content mx-auto max-w-3xl">
          <p>Last updated: May 2025</p>

          <h2>About This Service</h2>
          <p>
            EmployeeFraudExpert.com is a referral service that connects UK employers
            and solicitors with qualified employee fraud expert witnesses and
            forensic accountants. We are not a law firm and do not provide legal
            advice. We do not provide forensic accounting services directly.
          </p>

          <h2>No Client Relationship</h2>
          <p>
            Submitting an enquiry through this website does not create a
            solicitor-client relationship or an expert witness engagement. Any
            professional relationship is formed directly between you and the expert
            or firm we refer you to, under their terms and conditions.
          </p>

          <h2>Referral Process</h2>
          <p>
            We match enquiries with qualified experts based on the fraud type,
            proceedings, and urgency described in your submission. We do not
            guarantee a particular outcome, response time, or fee level. Expert
            availability varies.
          </p>

          <h2>Accuracy of Information</h2>
          <p>
            Content on this website is provided for general information only and
            does not constitute legal or professional advice. While we strive for
            accuracy, we make no warranties about the completeness or currentness
            of information, including legal references and fee ranges.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, EmployeeFraudExpert.com shall
            not be liable for any loss arising from use of this website or from
            services provided by referred experts. Your recourse lies with the
            expert or firm you engage.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            All content on this website is owned by EmployeeFraudExpert.com and
            may not be reproduced without permission.
          </p>

          <h2>Governing Law</h2>
          <p>
            These terms are governed by the laws of England and Wales. The courts
            of England and Wales have exclusive jurisdiction.
          </p>

          <h2>Contact</h2>
          <p>For enquiries about these terms: {SITE_EMAIL}</p>
        </div>
      </Section>
    </>
  );
}
