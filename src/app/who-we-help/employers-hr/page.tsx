import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import {
  breadcrumbSchema,
  graphSchema,
  organizationSchema,
} from "@/lib/schema";
import { faqs } from "@/data/faqs";

export const metadata = createMetadata({
  title:
    "Employee Fraud Help for Employers & HR UK | What to Do When You Discover Fraud",
  description:
    "Discovered suspected employee fraud? Our forensic accountants help employers investigate, quantify losses, preserve evidence, and prepare for civil or criminal action.",
  path: "/who-we-help/employers-hr",
});

const employerFaqs = [
  faqs[3],
  faqs[4],
  faqs[5],
  faqs[8],
  faqs[10],
].filter(Boolean);

export default function EmployersHRPage() {
  return (
    <>
      <JsonLd
        data={graphSchema([
          organizationSchema,
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Who We Help", path: "/who-we-help" },
            { name: "Employers & HR", path: "/who-we-help/employers-hr" },
          ]),
        ])}
      />
      <PageHero
        title="Employee Fraud Help for Employers & HR Teams"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Who We Help", href: "/who-we-help" },
          { label: "Employers & HR" },
        ]}
      />
      <Section>
        <div className="prose-content mx-auto max-w-3xl">
          <h2>You&apos;ve Just Discovered Suspected Fraud - What Now?</h2>
          <p>
            The first 24–72 hours after discovering suspected employee fraud are
            critical. Most frauds leave both a paper trail and an electronic
            footprint - but acting without a plan can alert the suspect, destroy
            evidence, and prejudice any subsequent proceedings.
          </p>
          <p>
            See our step-by-step guide:{" "}
            <Link href="/investigation-process">Investigation Process</Link>
          </p>

          <h2>What We Do for Employers</h2>
          <ul>
            <li>
              <strong>Immediate response</strong> - forensic accountant available
              within 24 hours
            </li>
            <li>
              <strong>Evidence preservation</strong> - securing financial records,
              email data, and system logs before the suspect is alerted
            </li>
            <li>
              <strong>Preliminary assessment</strong> - quantifying the potential
              scale of the fraud quickly
            </li>
            <li>
              <strong>Full fraud investigation</strong> - producing evidence-quality
              findings under legal professional privilege (working alongside your
              solicitor)
            </li>
            <li>
              <strong>Loss quantification</strong> - exact figure for civil
              recovery and insurance claim
            </li>
            <li>
              <strong>Expert witness report</strong> - CPR Part 35 compliant, ready
              for court proceedings
            </li>
            <li>
              <strong>FTPF advisory</strong> - assessing whether your fraud
              prevention procedures are adequate under the new offence
            </li>
          </ul>

          <h2>When to Call Us Before You Call the Police</h2>
          <p>
            Many employers instinctively want to call the police immediately. In
            most cases, it is better to call a forensic accountant first - to
            secure evidence, quantify the loss, and advise on the most effective
            route to recovery (civil proceedings often recover more than criminal
            prosecution alone).
          </p>

          <h2>Common Questions Employers Ask</h2>
          <div className="mt-6 space-y-4">
            {employerFaqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-lg border border-border bg-section-alt p-4 sm:p-5"
              >
                <h3 className="text-base font-semibold text-heading">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-body sm:text-[0.9375rem]">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center rounded bg-highlight px-8 py-3 font-semibold text-white hover:bg-[#b45309]"
            >
              Get Immediate Fraud Help
            </Link>
          </div>
        </div>
      </Section>
      <CTASection />
    </>
  );
}
