import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = createMetadata({
  title: "Who We Help | Employee Fraud Experts for Employers & Solicitors UK",
  description:
    "Employee fraud expert witnesses for UK employers who have discovered fraud - and for solicitors handling civil fraud recovery and criminal proceedings.",
  path: "/who-we-help",
});

export default function WhoWeHelpPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Who We Help", path: "/who-we-help" },
        ])}
      />
      <PageHero
        title="Who We Help"
        subtitle="EmployeeFraudExpert.com serves two distinct audiences - UK employers who have just discovered suspected fraud and need immediate expert help, and solicitors handling civil fraud recovery, criminal proceedings, and regulatory matters."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Who We Help" },
        ]}
      />
      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          <Link
            href="/who-we-help/employers-hr"
            className="group rounded-lg border border-border bg-white p-8 shadow-[var(--shadow-card)] transition-shadow hover:shadow-md"
          >
            <h2 className="text-xl font-bold text-heading group-hover:text-highlight">
              Employers &amp; HR Teams
            </h2>
            <p className="mt-4 text-body leading-relaxed">
              Discovered suspected employee fraud? Get immediate guidance on
              evidence preservation, loss quantification, and the first 72 hours
              after discovery.
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-highlight">
              View employer services →
            </span>
          </Link>
          <Link
            href="/who-we-help/solicitors-law-firms"
            className="group rounded-lg border border-border bg-white p-8 shadow-[var(--shadow-card)] transition-shadow hover:shadow-md"
          >
            <h2 className="text-xl font-bold text-heading group-hover:text-highlight">
              Solicitors &amp; Law Firms
            </h2>
            <p className="mt-4 text-body leading-relaxed">
              Need CPR Part 35 compliant expert reports, asset tracing evidence,
              and credible expert testimony for civil or criminal proceedings?
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-highlight">
              View solicitor services →
            </span>
          </Link>
        </div>
      </Section>
      <CTASection />
    </>
  );
}
