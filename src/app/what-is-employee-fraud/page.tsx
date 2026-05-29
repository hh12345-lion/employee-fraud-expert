import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = createMetadata({
  title: "What Is Employee Fraud? | UK Definition, Types & Legal Framework",
  description:
    "Employee fraud is financial crime committed by an employee against their employer. Types, Fraud Act 2006, Theft Act 1968, Failure to Prevent Fraud offence, and expert witness role explained.",
  path: "/what-is-employee-fraud",
});

export default function WhatIsEmployeeFraudPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "What Is Employee Fraud?", path: "/what-is-employee-fraud" },
        ])}
      />
      <PageHero
        title="What Is Employee Fraud?"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "What Is Employee Fraud?" },
        ]}
      />
      <Section>
        <div className="prose-content mx-auto max-w-3xl">
          <h2>Definition</h2>
          <p>
            Employee fraud is the intentional misuse of an employer&apos;s assets,
            resources, or information by an employee for personal gain or to
            cause harm to the organisation. It is a form of occupational fraud
            - financial crime committed by a person in a position of trust
            against the organisation that employs them.
          </p>

          <h2>The Legal Framework</h2>
          <h3>Fraud Act 2006</h3>
          <p>
            The primary legislation covering employee fraud in England and Wales.
            Key offences include:
          </p>
          <ul>
            <li>
              <strong>Fraud by false representation (s2)</strong> - making false
              statements to obtain a financial advantage
            </li>
            <li>
              <strong>Fraud by abuse of position (s4)</strong> - exploiting a
              position of trust (e.g. a bookkeeper stealing funds)
            </li>
            <li>
              <strong>Fraud by failing to disclose (s3)</strong> - concealing
              information that creates financial gain
            </li>
          </ul>

          <h3>Theft Act 1968</h3>
          <ul>
            <li><strong>Theft (s1)</strong> - dishonest appropriation of property</li>
            <li><strong>False accounting (s17)</strong> - falsifying financial records</li>
            <li>
              <strong>False statements by company directors (s19)</strong>
            </li>
          </ul>

          <h3>Bribery Act 2010</h3>
          <p>
            Employee bribery - receiving or giving improper payments or benefits
            from/to third parties.
          </p>

          <h3>
            Economic Crime and Corporate Transparency Act 2023 - Failure to
            Prevent Fraud
          </h3>
          <p>
            In force from 1 September 2025, this offence makes large organisations
            liable if they fail to prevent employees from committing fraud offences
            for the organisation&apos;s benefit, facing potentially unlimited fines
            if convicted.{" "}
            <Link href="/guides/failure-to-prevent-fraud-guide">
              Read our FTPF guide →
            </Link>
          </p>

          <h2>The ACFE Fraud Triangle</h2>
          <p>The three conditions that enable employee fraud:</p>
          <ol>
            <li>
              <strong>Opportunity</strong> - access to assets and weak controls
            </li>
            <li>
              <strong>Pressure</strong> - financial stress, lifestyle demands
            </li>
            <li>
              <strong>Rationalisation</strong> - convincing themselves it is
              justified
            </li>
          </ol>

          <h2>How Long Does Employee Fraud Go Undetected?</h2>
          <p>
            Employee fraud typically goes undetected for extended periods -
            perpetrators exploit gaps in management oversight, manipulate data
            and financial records to hide activity, initially committing fraud
            at irregular intervals and for smaller amounts that increase over
            time.
          </p>

          <h2>Civil vs Criminal Proceedings</h2>
          <p>
            <strong>Civil proceedings:</strong> employer brings a claim to recover
            losses - typically through the High Court, using freezing injunctions,
            asset tracing, and civil fraud claims.
          </p>
          <p>
            <strong>Criminal proceedings:</strong> police and CPS/SFO prosecution
            of the employee - resulting in conviction and potential confiscation
            under POCA.
          </p>
          <p>
            Both can proceed simultaneously. Expert witnesses may be needed in
            both contexts.{" "}
            <Link href="/case-types">View case types →</Link>
          </p>

          <h2>CPR Part 35 &amp; Expert Duties</h2>
          <p>
            An employee fraud expert witness owes their primary duty to the court
            under CPR Part 35 - not to the employer or solicitor who instructed
            them. This independence is particularly important in fraud cases,
            where the expert&apos;s objectivity determines whether their findings
            are credible to a court. The duties were established in{" "}
            <em>The Ikarian Reefer</em> [1993] and require the expert to provide
            independent, objective evidence regardless of who pays their fees.{" "}
            <Link href="/qualifications">View expert qualifications →</Link>
          </p>
        </div>
      </Section>
      <CTASection />
    </>
  );
}
