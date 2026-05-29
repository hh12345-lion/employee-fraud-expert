import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { FTPFAlertBanner } from "@/components/FTPFAlertBanner";
import { JsonLd } from "@/components/JsonLd";
import {
  graphSchema,
  organizationSchema,
  professionalServiceSchema,
  websiteSchema,
} from "@/lib/schema";
import { services, serviceNames } from "@/data/services";

const stats = [
  {
    fact: "Annual fraud cost to UK economy",
    figure: "£219 billion",
    source: "Annual Fraud Indicator 2023",
  },
  {
    fact: "Financial fraud losses in 2023",
    figure: "£1.17 billion",
    source: "UK Finance 2024",
  },
  {
    fact: "Fraud as % of all UK crime",
    figure: "41%",
    source: "Home Office 2024",
  },
  {
    fact: "FTPF offence in force",
    figure: "1 September 2025",
    source: "ECCTA 2023",
  },
  {
    fact: "FTPF maximum penalty",
    figure: "Unlimited fine",
    source: "ECCTA 2023",
  },
  {
    fact: "% of fraud committed by employees",
    figure: "Over 50%",
    source: "ACFE Report to the Nations 2024",
  },
  {
    fact: "Median employee fraud loss",
    figure: "£100,000+",
    source: "ACFE Report to the Nations 2024",
  },
];

export default function HomePage() {
  const schemas = graphSchema([
    organizationSchema,
    professionalServiceSchema(serviceNames),
    websiteSchema,
  ]);

  return (
    <>
      <JsonLd data={schemas} />
      <PageHero
        title="Employee Fraud Expert Witness Services for UK Employers & Solicitors"
        subtitle="Whether you've just discovered suspected fraud or you're preparing for civil or criminal proceedings, you need an expert who moves fast and builds airtight evidence. EmployeeFraudExpert.com connects UK employers and solicitors with qualified forensic accountants specialising in employee fraud investigation and expert witness services."
      />
      <FTPFAlertBanner />

      <Section>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/who-we-help/employers-hr"
            className="inline-flex min-h-[44px] items-center justify-center rounded bg-highlight px-8 py-3 font-semibold text-white transition-colors hover:bg-[#b45309]"
          >
            I&apos;m an Employer
          </Link>
          <Link
            href="/who-we-help/solicitors-law-firms"
            className="inline-flex min-h-[44px] items-center justify-center rounded border-2 border-primary px-8 py-3 font-semibold text-primary transition-colors hover:bg-section-alt"
          >
            I&apos;m a Solicitor
          </Link>
        </div>
      </Section>

      <Section alt>
        <h2 className="text-2xl font-bold text-heading md:text-3xl">
          What Our Employee Fraud Expert Witnesses Cover
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.id}`}
              className="rounded-lg border border-border bg-white p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-md"
            >
              <h3 className="font-semibold text-heading">{service.title}</h3>
              <p className="mt-2 text-sm text-body">{service.shortDescription}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="text-2xl font-bold text-heading md:text-3xl">
          Employee Fraud in the UK: Key Facts
        </h2>
        <div className="table-scroll mt-8 overflow-x-auto">
          <table className="w-full min-w-[32rem] border-collapse text-sm">
            <thead>
              <tr className="bg-section-alt">
                <th className="border border-border px-4 py-3 text-left font-semibold text-heading">
                  Fact
                </th>
                <th className="border border-border px-4 py-3 text-left font-semibold text-heading">
                  Figure
                </th>
                <th className="border border-border px-4 py-3 text-left font-semibold text-heading">
                  Source
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.map((row) => (
                <tr key={row.fact} className="even:bg-section-alt/50">
                  <td className="border border-border px-4 py-3 text-body">
                    {row.fact}
                  </td>
                  <td className="border border-border px-4 py-3 font-medium text-heading">
                    {row.figure}
                  </td>
                  <td className="border border-border px-4 py-3 text-body">
                    {row.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-body/70">
          Sources: Annual Fraud Indicator 2023; UK Finance Annual Fraud Report
          2024; Home Office Crime Statistics 2024; ACFE Report to the Nations
          2024; Economic Crime and Corporate Transparency Act 2023.
        </p>
      </Section>

      <Section alt>
        <h2 className="text-2xl font-bold text-heading md:text-3xl">
          Who Uses Our Employee Fraud Expert Services?
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-white p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-lg font-semibold text-heading">
              Employers &amp; HR
            </h3>
            <p className="mt-3 text-body leading-relaxed">
              You&apos;ve discovered suspected fraud in your organisation. You
              need to move quickly, preserve evidence, and understand what has
              been taken - before engaging solicitors or the police.
            </p>
            <Link
              href="/who-we-help/employers-hr"
              className="mt-4 inline-flex min-h-[44px] items-center text-sm font-semibold text-highlight underline hover:text-[#b45309]"
            >
              Help for employers →
            </Link>
          </div>
          <div className="rounded-lg border border-border bg-white p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-lg font-semibold text-heading">
              Solicitors &amp; Law Firms
            </h3>
            <p className="mt-3 text-body leading-relaxed">
              You need a forensic accountant who produces CPR Part 35 compliant
              expert reports, traces assets, and gives credible evidence in civil
              or criminal proceedings.
            </p>
            <Link
              href="/who-we-help/solicitors-law-firms"
              className="mt-4 inline-flex min-h-[44px] items-center text-sm font-semibold text-highlight underline hover:text-[#b45309]"
            >
              Help for solicitors →
            </Link>
          </div>
        </div>
        <p className="mt-8 text-body leading-relaxed">
          Employee fraud is financial crime committed by a person in a position
          of trust against the organisation that employs them.{" "}
          <Link
            href="/what-is-employee-fraud"
            className="font-medium text-highlight underline hover:text-[#b45309]"
          >
            Learn what employee fraud is and how UK law applies →
          </Link>
        </p>
      </Section>

      <CTASection />
    </>
  );
}
