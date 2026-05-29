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

export const metadata = createMetadata({
  title:
    "Employee Fraud Expert Witnesses for Solicitors UK | CPR Part 35 Compliant Reports",
  description:
    "Forensic accountants and employee fraud expert witnesses for UK solicitors. Civil fraud recovery, criminal proceedings, POCA confiscation, and CPR Part 35 compliant expert reports.",
  path: "/who-we-help/solicitors-law-firms",
});

export default function SolicitorsPage() {
  return (
    <>
      <JsonLd
        data={graphSchema([
          organizationSchema,
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Who We Help", path: "/who-we-help" },
            {
              name: "Solicitors & Law Firms",
              path: "/who-we-help/solicitors-law-firms",
            },
          ]),
        ])}
      />
      <PageHero
        title="Employee Fraud Expert Witnesses for UK Solicitors & Law Firms"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Who We Help", href: "/who-we-help" },
          { label: "Solicitors & Law Firms" },
        ]}
      />
      <Section>
        <div className="prose-content mx-auto max-w-3xl">
          <h2>What Solicitors Need from an Employee Fraud Expert</h2>
          <p>
            CPR Part 35 compliant expert reports that trace the fraud clearly,
            quantify the loss precisely, and withstand cross-examination. Experts
            who understand privilege, civil fraud procedure, and POCA.
          </p>

          <h2>How We Support Solicitors</h2>
          <ul>
            <li>Preliminary case assessment (under LPP - privileged report)</li>
            <li>Expert witness report (CPR Part 35 compliant)</li>
            <li>Asset tracing evidence for freezing injunctions</li>
            <li>Loss quantification for civil recovery claims</li>
            <li>POCA confiscation reports (criminal proceedings)</li>
            <li>Rebuttal reports</li>
            <li>SJE appointments</li>
            <li>Oral evidence at trial or tribunal</li>
          </ul>

          <h2>Civil Fraud Procedure</h2>
          <p>
            Overview of key procedures and the expert&apos;s role in each:
          </p>
          <ul>
            <li>
              <strong>Norwich Pharmacal orders</strong> - expert analyses disclosed
              bank records to identify wrongdoers
            </li>
            <li>
              <strong>Freezing injunctions (Mareva)</strong> - preliminary quantum
              and asset tracing within 24–48 hours
            </li>
            <li>
              <strong>Search orders (Anton Piller)</strong> - expert identifies
              financial records to be seized
            </li>
            <li>
              <strong>Disclosure orders</strong> - expert advises on categories of
              financial documents required
            </li>
            <li>
              <strong>Civil recovery route</strong> - full investigation and CPR Part
              35 expert report for trial
            </li>
          </ul>
          <p>
            <Link href="/guides/civil-fraud-recovery-guide">
              Civil fraud recovery guide for solicitors →
            </Link>
          </p>

          <h2>POCA Confiscation Proceedings</h2>
          <p>
            Expert role in quantifying benefit from criminal conduct and available
            assets under POCA 2002. Forensic accountants prepare benefit and
            available assets schedules for confiscation hearings following employee
            fraud conviction.{" "}
            <Link href="/guides/poca-confiscation-fraud-guide">POCA guide →</Link>
          </p>

          <h2>Employment Tribunal</h2>
          <p>
            Expert evidence on financial loss arising from employee misconduct in
            ET proceedings - including investigation integrity where the dismissed
            employee challenges the employer&apos;s findings.
          </p>

          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center rounded bg-highlight px-8 py-3 font-semibold text-white hover:bg-[#b45309]"
            >
              Instruct an Expert Witness
            </Link>
          </div>
        </div>
      </Section>
      <CTASection />
    </>
  );
}
