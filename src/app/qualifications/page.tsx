import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = createMetadata({
  title:
    "Employee Fraud Expert Witness Qualifications UK | CFE, ACA & Forensic Credentials",
  description:
    "What credentials should a UK employee fraud expert witness hold? CFE, ACA, CIMA, digital forensics, and CPR Part 35 compliance explained.",
  path: "/qualifications",
});

export default function QualificationsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Qualifications", path: "/qualifications" },
        ])}
      />
      <PageHero
        title="Employee Fraud Expert Witness Qualifications & Credentials"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Qualifications" },
        ]}
      />
      <Section>
        <div className="prose-content mx-auto max-w-3xl">
          <h2>Core Credentials</h2>

          <h3>CFE (Certified Fraud Examiner)</h3>
          <p>
            Issued by the ACFE - the primary global credential for fraud
            investigation. Covers fraud prevention, detection, and deterrence.
            Essential for employee fraud expert witnesses.
          </p>

          <h3>ACA / FCA (ICAEW)</h3>
          <p>Chartered accountancy - baseline financial expertise.</p>

          <h3>CIMA / FCMA</h3>
          <p>
            Management accounting - relevant for payroll and management
            information fraud.
          </p>

          <h3>ACCA / FCCA</h3>
          <p>Widely recognised UK accounting qualification.</p>

          <h3>ICFA (Institute of Certified Forensic Accountants)</h3>
          <p>CPFAacct status - specialist forensic accounting qualification.</p>

          <h3>Digital Forensics credentials (FBCS, EnCE, GCFE)</h3>
          <p>Where digital evidence is central to the fraud investigation.</p>

          <h3>FEWI / Academy of Experts</h3>
          <p>Expert witness professional body membership.</p>

          <h2>ACFE Membership</h2>
          <p>
            Membership of the Association of Certified Fraud Examiners (ACFE) is
            the professional marker for employee fraud investigation specialists
            - equivalent to ICAEW for forensic accounting.
          </p>

          <h2>Experience Requirements</h2>
          <ul>
            <li>Active fraud investigation practice</li>
            <li>Experience in both civil and criminal proceedings</li>
            <li>CPR Part 35 expert report history</li>
            <li>Knowledge of POCA</li>
            <li>Professional indemnity insurance</li>
          </ul>

          <h2>CPR Part 35 Compliance</h2>
          <p>
            All expert witnesses in England and Wales court proceedings must comply
            with CPR Part 35 and the accompanying Practice Direction. The expert&apos;s
            overriding duty is to the court - established in{" "}
            <em>The Ikarian Reefer</em> [1993]. Reports must contain a statement
            of truth, details of instructions, the expert&apos;s qualifications,
            methodology, findings, and conclusions. Experts must not act as
            advocates for the instructing party.
          </p>

          <h2>Legal Professional Privilege</h2>
          <p>
            Employee fraud experts must understand how to work within the LPP
            framework - ensuring investigation reports are protected from
            disclosure when instructed via solicitors.{" "}
            <Link href="/who-we-help/employers-hr">Learn about LPP →</Link>
          </p>

          <p>
            <Link href="/contact">Instruct an expert witness →</Link>
          </p>
        </div>
      </Section>
      <CTASection />
    </>
  );
}
